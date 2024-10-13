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
        System.out.println("Fetching profile for email: " + email);
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

    /*
    @PutMapping("/updatePaymentCards")
    public User updatePaymentCards(@RequestBody UpdateCardsRequest updateRequest) {
        return userService.updateUserPaymentCards(updateRequest);
    }

     */

    // Inner class to hold the update request data
    public static class UpdateCardsRequest {
        private String email;
        private String cardType1;
        private String cardNumber1;
        private String expirationDate1;
        private String cvv1;
        private String cardType2;
        private String cardNumber2;
        private String expirationDate2;
        private String cvv2;
        private String cardType3;
        private String cardNumber3;
        private String expirationDate3;
        private String cvv3;

        // Getters and Setters for all fields
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getCardType1() { return cardType1; }
        public void setCardType1(String cardType1) { this.cardType1 = cardType1; }

        public String getCardNumber1() { return cardNumber1; }
        public void setCardNumber1(String cardNumber1) { this.cardNumber1 = cardNumber1; }

        public String getExpirationDate1() { return expirationDate1; }
        public void setExpirationDate1(String expirationDate1) { this.expirationDate1 = expirationDate1; }

        public String getCvv1() { return cvv1; }
        public void setCvv1(String cvv1) { this.cvv1 = cvv1; }

        public String getCardType2() { return cardType2; }
        public void setCardType2(String cardType2) { this.cardType2 = cardType2; }

        public String getCardNumber2() { return cardNumber2; }
        public void setCardNumber2(String cardNumber2) { this.cardNumber2 = cardNumber2; }

        public String getExpirationDate2() { return expirationDate2; }
        public void setExpirationDate2(String expirationDate2) { this.expirationDate2 = expirationDate2; }

        public String getCvv2() { return cvv2; }
        public void setCvv2(String cvv2) { this.cvv2 = cvv2; }

        public String getCardType3() { return cardType3; }
        public void setCardType3(String cardType3) { this.cardType3 = cardType3; }

        public String getCardNumber3() { return cardNumber3; }
        public void setCardNumber3(String cardNumber3) { this.cardNumber3 = cardNumber3; }

        public String getExpirationDate3() { return expirationDate3; }
        public void setExpirationDate3(String expirationDate3) { this.expirationDate3 = expirationDate3; }

        public String getCvv3() { return cvv3; }
        public void setCvv3(String cvv3) { this.cvv3 = cvv3; }
    }

}

class LoginRequest {
    private String email;
    private String password;

    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}