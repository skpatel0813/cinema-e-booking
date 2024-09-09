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
    private PasswordEncoder passwordEncoder; // Password encryption using BCrypt

    /**
     * Registers a new user, generates a verification code, encrypts the password,
     * sends a verification email, and saves the user.
     *
     * @param user The user to be registered.
     * @return The registered user entity.
     */
    public User registerUser(User user) {
        // Check if the email already exists
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // Encrypt the user's password
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // Generate a verification code
        String verificationCode = UUID.randomUUID().toString().substring(0, 6); // Generate 6-character code
        user.setVerificationCode(verificationCode);
        user.setVerified(false); // Initially set the user as not verified

        // Save the user to the database
        User savedUser = userRepository.save(user);

        // Send verification email to the user
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return savedUser;
    }

    /**
     * Verifies a user by checking the verification code.
     *
     * @param email The email of the user to be verified.
     * @param verificationCode The verification code provided by the user.
     * @return True if the user is verified successfully, false otherwise.
     */
    public boolean verifyUser(String email, String verificationCode) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getVerificationCode().equals(verificationCode)) {
            user.setVerified(true); // Set user as verified
            userRepository.save(user); // Save the verified user to the database
            return true;
        }
        return false;
    }

    /**
     * Verifies the login credentials of a user by checking the email and matching the password.
     *
     * @param email The email of the user trying to log in.
     * @param password The password provided by the user.
     * @return The user if login is successful, null otherwise.
     */
    public User verifyLogin(String email, String password) {
        User user = userRepository.findByEmail(email);

        // Check if the user exists and if the password matches the encrypted password
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user; // Login success
        }
        return null; // Invalid credentials
    }
}
