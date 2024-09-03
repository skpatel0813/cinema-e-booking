// src/main/java/com/cinema/repository/MovieRepository.java

package com.cinema.repository;

import com.cinema.model.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends CrudRepository<Movie, Long> {

    @Query("SELECT m FROM Movie m")
    List<Movie> findRandomMovies();
}
