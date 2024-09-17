package com.cinema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a verification email with the provided verification code.
     *
     * @param toEmail          The email address to send the verification email to.
     * @param verificationCode The verification code to be included in the email.
     */
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verification Code");
        message.setText("Your verification code is: " + verificationCode);
        message.setFrom("your_email@gmail.com"); // Replace with your email

        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}
