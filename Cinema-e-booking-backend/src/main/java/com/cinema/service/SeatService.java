package com.cinema.service;

import com.cinema.model.Reservation;
import com.cinema.model.Seat;
import com.cinema.repository.ReservationRepository;
import com.cinema.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SeatRepository seatRepository;

    // Method to fetch all seats
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public List<Seat> getReservedSeats(int movieId, String showtime) {
        return reservationRepository.findReservedSeatsByMovieIdAndShowtime(movieId, showtime);
    }

    // Check if a seat is already reserved for a specific movie and showtime
    public boolean isSeatReserved(int seatId, int movieId, String showtime) {
        Optional<Reservation> reservation = reservationRepository.findBySeatIdAndMovieIdAndShowtime(seatId, movieId, showtime);
        return reservation.isPresent();
    }

    // Reserve a seat for a specific movie and showtime
    public void reserveSeat(int seatId, int movieId, String showtime) {
        if (!isSeatReserved(seatId, movieId, showtime)) {
            Reservation reservation = new Reservation();
            reservation.setSeatId(seatId);
            reservation.setMovieId(movieId);
            reservation.setShowtime(showtime);
            reservation.setReserved(true);

            reservationRepository.save(reservation);
        } else {
            throw new IllegalStateException("Seat is already reserved for this showtime.");
        }
    }
}


