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

    /**
     * Creates a new booking based on payment request details.
     * @param paymentRequest details of the payment for the booking.
     * @return the created booking.
     */
    public Booking createBooking(PaymentRequest paymentRequest) {
        Booking booking = new Booking();
        booking.setBookingNumber(UUID.randomUUID().toString().substring(0, 8)); // Generate a random booking number
        booking.setUserId(paymentRequest.getUserId());
        booking.setTotalAmount(paymentRequest.getTotalAmount());

        return booking;
    }

}
