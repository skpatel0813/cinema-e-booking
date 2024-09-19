package com.cinema.service;

import com.cinema.model.User;
import com.cinema.repository.UserRepository;
import com.cinema.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already in use.");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        String verificationCode = UUID.randomUUID().toString().substring(0, 6);
        user.setVerificationCode(verificationCode);
        user.setVerified(false);

        // Set role to 'user' by default, unless specified
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }

        User savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return savedUser;
    }

    public boolean verifyUser(String email, String verificationCode) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getVerificationCode().equals(verificationCode)) {
            user.setVerified(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public User verifyLogin(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User updateUserProfile(String email, User updatedUser) {
        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            throw new IllegalArgumentException("User not found.");
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setStreet(updatedUser.getStreet());
        existingUser.setCity(updatedUser.getCity());
        existingUser.setState(updatedUser.getState());
        existingUser.setZip(updatedUser.getZip());
        existingUser.setBillingStreet(updatedUser.getBillingStreet());
        existingUser.setBillingCity(updatedUser.getBillingCity());
        existingUser.setBillingState(updatedUser.getBillingState());
        existingUser.setBillingZip(updatedUser.getBillingZip());
        existingUser.setCardNumber1(updatedUser.getCardNumber1());
        existingUser.setCardType(updatedUser.getCardType());
        existingUser.setExpirationDate1(updatedUser.getExpirationDate1());

        return userRepository.save(existingUser);
    }

    public void changeUserPassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user == null || !passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
        userRepository.save(user);
    }

    public User updateUserCards(String email, Map<String, String> cardData) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setCardType1(cardData.getOrDefault("cardType1", user.getCardType1()));
            user.setCardNumber1(cardData.getOrDefault("cardNumber1", user.getCardNumber1()));
            user.setExpirationDate1(cardData.getOrDefault("expirationDate1", user.getExpirationDate1()));
            user.setCvv1(cardData.getOrDefault("cvv1", user.getCvv1()));

            user.setCardType2(cardData.getOrDefault("cardType2", user.getCardType2()));
            user.setCardNumber2(cardData.getOrDefault("cardNumber2", user.getCardNumber2()));
            user.setExpirationDate2(cardData.getOrDefault("expirationDate2", user.getExpirationDate2()));
            user.setCvv2(cardData.getOrDefault("cvv2", user.getCvv2()));

            user.setCardType3(cardData.getOrDefault("cardType3", user.getCardType3()));
            user.setCardNumber3(cardData.getOrDefault("cardNumber3", user.getCardNumber3()));
            user.setExpirationDate3(cardData.getOrDefault("expirationDate3", user.getExpirationDate3()));
            user.setCvv3(cardData.getOrDefault("cvv3", user.getCvv3()));

            return userRepository.save(user);
        }
        return null;
    }

}
