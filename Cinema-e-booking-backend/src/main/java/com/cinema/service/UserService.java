package com.cinema.service;

import com.cinema.controller.UserController;
import com.cinema.model.User;
import com.cinema.repository.UserRepository;
import com.cinema.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Map<String, String> resetCodeStore = new HashMap<>();

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // Encrypt the password before saving
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

        // Encrypt the new password before saving
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


    public boolean resetPassword(String email, String newPassword) {
        try {
            User user = userRepository.findByEmail(email); // Find user by email
            if (user == null) {
                System.out.println("User not found with email: " + email);
                return false;
            }

            // Encrypt the new password before saving
            String hashedPassword = passwordEncoder.encode(newPassword);

            // Update the user's password (make sure to hash the password before saving)
            user.setPassword(hashedPassword);
            userRepository.save(user);
            System.out.println("Password updated successfully for user: " + email);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // In-memory store for email-resetCode pairs
    public void saveResetCode(String email, String resetCode) {
        resetCodeStore.put(email, resetCode);
    }

    // Verify if the provided code matches the stored code for the email
    public boolean verifyResetCode(String email, String code) {
        return code.equals(resetCodeStore.get(email));
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    // Update user by ID
    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setRole(updatedUser.getRole());


            return userRepository.save(existingUser);
        }
        return null;
    }

    // Delete user by ID
    public boolean deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return true;
        }
        return false;
    }

    public List<String> getSubscribedUserEmails() {
        return userRepository.findSubscribedUserEmails();
    }

    public User getUserInfo(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateUserPaymentCards(UserController.UpdateCardsRequest updateRequest) {
        User user = getUserByEmail(updateRequest.getEmail());

        // Update card 1 details
        user.setCardType1(updateRequest.getCardType1());
        user.setCardNumber1(updateRequest.getCardNumber1());
        user.setExpirationDate1(updateRequest.getExpirationDate1());
        user.setCvv1(updateRequest.getCvv1());

        // Update card 2 details
        user.setCardType2(updateRequest.getCardType2());
        user.setCardNumber2(updateRequest.getCardNumber2());
        user.setExpirationDate2(updateRequest.getExpirationDate2());
        user.setCvv2(updateRequest.getCvv2());

        // Update card 3 details
        user.setCardType3(updateRequest.getCardType3());
        user.setCardNumber3(updateRequest.getCardNumber3());
        user.setExpirationDate3(updateRequest.getExpirationDate3());
        user.setCvv3(updateRequest.getCvv3());

        return userRepository.save(user);  // Save the updated user to the database
    }

}

