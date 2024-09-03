package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from frontend
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/home")
    public List<Movie> getHomeMovies() {
        List<Movie> movies = movieService.getRandomMovies();
        movies.forEach(movie -> System.out.println("Title: " + movie.getTitle() + ", Poster URL: " + movie.getPoster_url()));
        return movies; // Ensure this returns a list of Movie objects
    }

}
