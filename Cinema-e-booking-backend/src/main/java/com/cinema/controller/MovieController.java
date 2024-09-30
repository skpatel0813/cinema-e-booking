package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Fetch random movies for the home page
    @GetMapping("/home")
    public List<Movie> getHomeMovies() {
        return movieService.getRandomMovies();
    }

    // Fetch movie details by movie_id
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieDetails(@PathVariable int id) {
        Movie movie = movieService.getMovieById(id);
        if (movie != null) {
            return new ResponseEntity<>(movie, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update movie details
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable int id, @RequestBody Movie updatedMovie) {
        try {
            Movie movie = movieService.updateMovie(id, updatedMovie);
            return new ResponseEntity<>(movie, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete movie by id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable int id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.ok("Movie deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting movie");
        }
    }

    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody Movie movie) {
        try {
            Movie savedMovie = movieService.addMovie(movie);  // Call the addMovie method
            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding movie");
        }
    }

    // Endpoint to update ticket prices for a movie
    @PostMapping("/ticket-prices")
    public ResponseEntity<Movie> updateTicketPrices(
            @PathVariable int movieId,
            @RequestParam BigDecimal adultPrice,
            @RequestParam BigDecimal childrenPrice,
            @RequestParam BigDecimal seniorPrice) {
        Movie updatedMovie = movieService.updateTicketPrices(movieId, adultPrice, childrenPrice, seniorPrice);
        if (updatedMovie != null) {
            return ResponseEntity.ok(updatedMovie);
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint to add or update a promotion for a movie
    @PostMapping("/promotions")
    public ResponseEntity<Movie> addOrUpdatePromotion(
            @PathVariable int movieId,
            @RequestParam String code,
            @RequestParam String description,
            @RequestParam BigDecimal discount) {
        Movie updatedMovie = movieService.addOrUpdatePromotion(movieId, code, description, discount);
        if (updatedMovie != null) {
            return ResponseEntity.ok(updatedMovie);
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint to get showtimes for a specific movie by ID
    @GetMapping("/{movieId}/showtimes")
    public ResponseEntity<List<String>> getShowtimes(@PathVariable int movieId) {
        List<String> showtimes = movieService.getShowtimesByMovieId(movieId);
        return ResponseEntity.ok(showtimes);
    }

}
