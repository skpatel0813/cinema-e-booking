package com.cinema.controller;

import com.cinema.dto.PasswordChangeRequest;
import com.cinema.model.User;
import com.cinema.service.EmailService;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerificationRequest request) {
        boolean verified = userService.verifyUser(request.getEmail(), request.getVerificationCode());
        if (verified) {
            return ResponseEntity.ok("User verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid verification code");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userService.verifyLogin(request.getEmail(), request.getPassword());
        if (user != null) {
            // Return role and username for frontend to manage user/admin behavior
            Map<String, String> response = new HashMap<>();
            response.put("userName", user.getName());
            response.put("role", user.getRole());

            System.out.println(user.getId());
            response.put("userID", String.valueOf(user.getId()));

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @PutMapping("/profile/{email}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String email, @RequestBody User updatedUser) {
        try {
            User updated = userService.updateUserProfile(email, updatedUser);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user/change-password/{email}")
    public ResponseEntity<?> changeUserPassword(@PathVariable String email, @RequestBody PasswordChangeRequest request) {
        try {
            userService.changeUserPassword(email, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cards/{email}")
    public User updateUserCards(@PathVariable String email, @RequestBody Map<String, String> cardData) {
        return userService.updateUserCards(email, cardData);
    }

    // Endpoint to request password reset
    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        // Generate a random 6-digit code
        String resetCode = generateRandomCode(6);

        // Save the code and email association
        userService.saveResetCode(email, resetCode);

        // Send the code via email
        String subject = "Your Password Reset Code";
        String body = "Your password reset code is: " + resetCode;
        boolean isEmailSent = emailService.sendEmail(email, subject, body);

        if (isEmailSent) {
            return ResponseEntity.ok("Password reset code has been sent to your email.");
        } else {
            return ResponseEntity.status(500).body("Failed to send reset password email.");
        }
    }

    // Endpoint to verify reset code
    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        if (userService.verifyResetCode(email, code)) {
            return ResponseEntity.ok("Code verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired reset code.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (newPassword == null || confirmPassword == null || !newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match or are missing.");
        }

        boolean isReset = userService.resetPassword(email, newPassword);
        if (isReset) {
            return ResponseEntity.ok("Password has been successfully reset.");
        } else {
            return ResponseEntity.status(500).body("Failed to reset password.");
        }
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update user by ID
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete user by ID (Optional)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Generate a random numeric code of the given length
    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10)); // Append a random digit (0-9)
        }
        return code.toString();
    }

    @GetMapping("/getUserInfo/{id}")
    public User getUserInfo(@PathVariable Long id) {
        return userService.getUserInfo(id);
    }

    // New method to get user info by email
    @GetMapping("/getUserInfoByEmail")
    public User getUserInfoByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
}

// DTO for login request
class LoginRequest {
    private String email;
    private String password;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}