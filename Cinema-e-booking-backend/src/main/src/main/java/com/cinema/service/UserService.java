package com.cinema.service;

import com.cinema.model.User;
import com.cinema.repository.UserRepository;
import com.cinema.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        existingUser.setCardNumber(updatedUser.getCardNumber());
        existingUser.setCardType(updatedUser.getCardType());
        existingUser.setExpirationDate(updatedUser.getExpirationDate());

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
}
