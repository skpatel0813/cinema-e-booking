package com.cinema.service;

import com.cinema.model.Movie;
import com.cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRandomMovies() {
        return movieRepository.findRandomMovies();
    }

    // Example method to fetch a movie by ID
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }
}
