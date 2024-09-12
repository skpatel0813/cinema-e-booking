package com.cinema.controller;

import com.cinema.dto.PasswordChangeRequest;
import com.cinema.model.User;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

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
            return ResponseEntity.ok(user);
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

    @PutMapping("/user/profile/{email}")
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

// DTO for password change request

