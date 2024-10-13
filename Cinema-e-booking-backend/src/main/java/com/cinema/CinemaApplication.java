package com.cinema;

import com.cinema.model.Movie; // Import the Movie model
import com.cinema.service.MovieService; // Import the MovieService to use its methods
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class CinemaApplication implements CommandLineRunner {

    @Autowired
    private MovieService movieService; // Use MovieService for business logic

    public static void main(String[] args) {
        SpringApplication.run(CinemaApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Fetch movies from the service
        List<Movie> homeMovies = movieService.getRandomMovies(); // Get the list of movies

        // Print the movie details to the console
        for (Movie movie : homeMovies) {
            System.out.println(movie.getMovieId() + " Title: " + movie.getTitle() + ", Poster URL: " + movie.getPosterUrl());
        }
    }
}
