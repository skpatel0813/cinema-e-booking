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

    /**
     * Retrieves a list of all seats in the cinema.
     *
     * @return A list of Seat objects.
     */
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    /**
     * Retrieves a list of reserved seats for a specific movie and showtime.
     *
     * @param movieId The ID of the movie.
     * @param showtime The specific showtime of the movie.
     * @return A list of reserved Seat objects.
     */
    public List<Seat> getReservedSeats(int movieId, String showtime) {
        return reservationRepository.findReservedSeatsByMovieIdAndShowtime(movieId, showtime);
    }

    /**
     * Checks if a seat is reserved for a specific movie and showtime.
     *
     * @param seatId The unique ID of the seat.
     * @param movieId The ID of the movie.
     * @param showtime The specific showtime.
     * @return True if the seat is reserved, otherwise false.
     */
    public boolean isSeatReserved(int seatId, int movieId, String showtime) {
        Optional<Reservation> reservation = reservationRepository.findBySeatIdAndMovieIdAndShowtime(seatId, movieId, showtime);
        return reservation.isPresent();
    }

    /**
     * Reserves a seat for a specific movie and showtime.
     *
     * @param seatId The unique ID of the seat.
     * @param movieId The ID of the movie.
     * @param showtime The specific showtime.
     */
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

    /**
     * Releases reserved seats based on the row and seat number details.
     *
     * @param letters The row letters of the seats to release.
     * @param numbers The seat numbers to release.
     * @return A list of released seat IDs.
     */
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


