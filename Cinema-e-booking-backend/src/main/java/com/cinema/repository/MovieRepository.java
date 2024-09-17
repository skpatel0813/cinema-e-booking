package com.cinema.repository;

import com.cinema.model.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends CrudRepository<Movie, Integer> {

    @Query("SELECT m FROM Movie m")
    List<Movie> getRandomMovies(); // Modify this if you want to use random logic
}
