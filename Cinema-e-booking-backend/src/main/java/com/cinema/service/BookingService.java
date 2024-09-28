package com.cinema.service;

import com.cinema.model.Booking;
import com.cinema.model.PaymentRequest;
import com.cinema.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a booking and save it to the database (you need to implement this method to save to your Booking table)
    public Booking createBooking(PaymentRequest paymentRequest) {
        Booking booking = new Booking();
        booking.setBookingNumber(UUID.randomUUID().toString().substring(0, 8)); // Generate a random booking number
        booking.setUserId(paymentRequest.getUserId());
        booking.setTotalAmount(paymentRequest.getTotalAmount());
        // Save booking to the database (implement repository logic here)

        return booking;
    }

    public Booking processPayment(PaymentRequest paymentRequest, String ticketNumber) {
        // Create a new booking object
        Booking booking = new Booking();
        booking.setUserId(paymentRequest.getUserId());
        booking.setTotalAmount(paymentRequest.getTotalAmount());
        booking.setTicketNumber(ticketNumber);  // Store the generated ticket number

        // Save booking to the database
        bookingRepository.save(booking);

        return booking;
    }
}
