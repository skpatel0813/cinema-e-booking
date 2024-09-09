package com.cinema.controller;

public class VerificationRequest {
    private String email;
    private String verificationCode;

    // Default Constructor
    public VerificationRequest() {
    }

    // Parameterized Constructor
    public VerificationRequest(String email, String verificationCode) {
        this.email = email;
        this.verificationCode = verificationCode;
    }

    // Getter and Setter for email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter and Setter for verificationCode
    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
    
}
