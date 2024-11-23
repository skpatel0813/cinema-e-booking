package com.cinema.service;

import com.cinema.model.Reservation;
import com.cinema.model.Seat;
import com.cinema.repository.ReservationRepository;
import com.cinema.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    @Transactional
    public List<Integer> releaseSeats(List<String> letters, List<Integer> numbers) {
        if (letters == null || numbers == null || letters.size() != numbers.size()) {
            throw new IllegalArgumentException("Invalid seat data: letters and numbers must not be null and must have the same size.");
        }

        List<Integer> releasedSeatIds = new ArrayList<>();

        for (int i = 0; i < letters.size(); i++) {
            String letter = letters.get(i);
            int number = numbers.get(i);

            // Find the seat by row and number
            seatRepository.findByRowAndNumber(letter, number)
                    .ifPresentOrElse(seat -> {
                        System.out.println("Releasing seat with ID: " + seat.getId() + ", Row: " + seat.getRow() + ", Number: " + seat.getNumber());
                        seat.setReserved(false); // Mark seat as available
                        seatRepository.save(seat); // Save the updated seat status
                        releasedSeatIds.add(seat.getId()); // Add seat ID to the list
                    }, () -> {
                        System.err.println("Seat not found for Row: " + letter + ", Number: " + number);
                    });
        }

        return releasedSeatIds;
    }






    @Autowired
    public SeatService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }




}


