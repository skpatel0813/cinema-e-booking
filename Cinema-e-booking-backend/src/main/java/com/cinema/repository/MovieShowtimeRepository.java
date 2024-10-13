package com.cinema.repository;

import com.cinema.model.MovieShowtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieShowtimeRepository extends JpaRepository<MovieShowtime, Long> {
    List<MovieShowtime> findByMovieId(Long movieId);
}
