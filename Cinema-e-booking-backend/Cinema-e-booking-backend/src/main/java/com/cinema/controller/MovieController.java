package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from frontend
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/home")
    public List<Movie> getHomeMovies() {
        return movieService.getRandomMovies(); // Fetches random movies for the home page
    }

    @GetMapping("/{id}")
    public Movie getMovieDetails(@PathVariable Long id) {
        return movieService.getMovieById(id); // Fetches movie details by ID
    }
}
