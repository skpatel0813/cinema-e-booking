package com.cinema.repository;

import com.cinema.model.Reservation;
import com.cinema.model.Seat;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Find a reservation by seat ID, movie ID, and showtime
    Optional<Reservation> findBySeatIdAndMovieIdAndShowtime(int seatId, int movieId, String showtime);

    // Find all reserved seats for a movie and showtime
    @Query("SELECT s FROM Seat s JOIN Reservation r ON s.id = r.seatId WHERE r.movieId = :movieId AND r.showtime = :showtime AND r.reserved = true")
    List<Seat> findReservedSeatsByMovieIdAndShowtime(int movieId, String showtime);

    @Transactional
    @Modifying
    @Query("DELETE FROM Reservation r WHERE r.movieId = :movieId AND r.showtime = :showtime AND r.seatId IN :seatIds")
    void deleteByMovieIdAndShowtimeAndSeatIds(@Param("movieId") int movieId,
                                              @Param("showtime") String showtime,
                                              @Param("seatIds") List<Integer> seatIds);


}
