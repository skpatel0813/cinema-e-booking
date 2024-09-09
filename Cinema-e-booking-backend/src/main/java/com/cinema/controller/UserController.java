package com.cinema.controller;

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

    /**
     * Registers a new user and sends a verification email.
     *
     * @param user The user details from the request body.
     * @return ResponseEntity containing the user details or error.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Verifies a user by email and verification code.
     *
     * @param request The verification request containing email and verification code.
     * @return ResponseEntity indicating success or failure.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerificationRequest request) {
        boolean verified = userService.verifyUser(request.getEmail(), request.getVerificationCode());
        if (verified) {
            return ResponseEntity.ok("User verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid verification code");
    }

    /**
     * Handles user login by checking the credentials.
     *
     * @param request LoginRequest containing email and password.
     * @return ResponseEntity with user details if login is successful, or an error message.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userService.verifyLogin(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
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
