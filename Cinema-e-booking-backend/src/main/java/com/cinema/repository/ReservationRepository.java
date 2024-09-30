package com.cinema.repository;

import com.cinema.model.Reservation;
import com.cinema.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Find a reservation by seat ID, movie ID, and showtime
    Optional<Reservation> findBySeatIdAndMovieIdAndShowtime(int seatId, int movieId, String showtime);

    // Find all reserved seats for a movie and showtime
    @Query("SELECT s FROM Seat s JOIN Reservation r ON s.id = r.seatId WHERE r.movieId = :movieId AND r.showtime = :showtime AND r.reserved = true")
    List<Seat> findReservedSeatsByMovieIdAndShowtime(int movieId, String showtime);
}
