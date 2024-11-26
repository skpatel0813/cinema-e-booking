package com.cinema.controller;

import com.cinema.model.Booking;
import com.cinema.model.PaymentRequest;
import com.cinema.model.User;
import com.cinema.service.BookingService;
import com.cinema.service.EmailService;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    /**
     * Processes the payment request and creates a booking.
     *
     * @param paymentRequest The request containing payment and user details.
     * @return ResponseEntity containing booking details and ticket number.
     */
    @PostMapping("/processPayment")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody PaymentRequest paymentRequest) {

        System.out.println("Received payment request: " + paymentRequest);

        if (paymentRequest.getUserId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User ID must not be null"));
        }

        // Create booking details
        Booking booking = bookingService.createBooking(paymentRequest);

        // Generate a ticket number
        String ticketNumber = "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Include the ticket number in the response
        Map<String, Object> response = new HashMap<>();
        response.put("booking", booking);
        response.put("ticketNumber", ticketNumber);

        // Retrieve user info
        User user = userService.getUserById(paymentRequest.getUserId());

        System.out.println(paymentRequest.getUserId());

        // Send confirmation email
        String subject = "Booking Confirmation";
        String body = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
                "Thank you for your purchase! Your booking number is: " + booking.getBookingNumber() + ".\n" +
                "Ticket Number: " + ticketNumber + "\n" +
                "Total amount: $" + paymentRequest.getTotalAmount() + "\n\n" +
                "Best Regards,\nCinema Booking Team";
        emailService.sendEmail(user.getEmail(), subject, body);

        // Return booking details and ticket number to frontend
        return ResponseEntity.ok(response);
    }




}