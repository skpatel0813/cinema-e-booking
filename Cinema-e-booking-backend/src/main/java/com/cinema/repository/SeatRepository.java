package com.cinema.repository;

import com.cinema.model.Seat;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    // Find all reserved seats for a specific movie and showtime
    List<Seat> findByMovieIdAndShowtimeAndReserved(Long movieId, String showtime, boolean reserved);

    // Custom query to reserve seats
    @Modifying
    @Query("UPDATE Seat s SET s.reserved = true WHERE s.id IN :seatIds AND s.movieId = :movieId AND s.showtime = :showtime AND s.reserved = false")
    int reserveSeats(@Param("seatIds") List<Integer> seatIds, @Param("movieId") Long movieId, @Param("showtime") String showtime);
}
