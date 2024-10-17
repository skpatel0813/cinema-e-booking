package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.model.MovieShowtime;
import com.cinema.model.Promotion;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/home")
    public List<Movie> getHomeMovies() {
        return movieService.getRandomMovies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieDetails(@PathVariable int id) {
        Movie movie = movieService.getMovieById(id);
        if (movie != null) {
            return new ResponseEntity<>(movie, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable int id, @RequestBody Movie movieDetails) {
        Movie movie = movieService.getMovieById(id);

        if (movie != null) {
            movie.setTitle(movieDetails.getTitle());
            movie.setCategory(movieDetails.getCategory());
            movie.setCast(movieDetails.getCast());
            movie.setDirector(movieDetails.getDirector());
            movie.setProducer(movieDetails.getProducer());
            movie.setSynopsis(movieDetails.getSynopsis());
            movie.setReviews(movieDetails.getReviews());
            movie.setTrailerUrl(movieDetails.getTrailerUrl());
            movie.setPosterUrl(movieDetails.getPosterUrl());
            movie.setRatingCode(movieDetails.getRatingCode());
            movie.setPrice(movieDetails.getPrice());
            movie.setIsNowPlaying(movieDetails.getIsNowPlaying());
            movie.setIsComingSoon(movieDetails.getIsComingSoon());

            Movie updatedMovie = movieService.updateMovie(id, movieDetails);
            return ResponseEntity.ok(updatedMovie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

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
            Movie savedMovie = movieService .saveMovie(movie); // Save the movie
            return ResponseEntity.ok(savedMovie); // Return saved movie as JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding movie: " + e.getMessage());
        }
    }



    // Add this new method to handle the POST request for showtimes
    @PostMapping("/{id}/showtimes")
    public ResponseEntity<?> addShowtimes(@PathVariable("id") int movieId, @RequestBody List<String> showtimes) {
        try {
            List<MovieShowtime> savedShowtimes = movieService.addShowtimes(movieId, showtimes);
            return ResponseEntity.ok(savedShowtimes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding showtimes: " + e.getMessage());
        }
    }

    // In MovieController.java
    @GetMapping("/{id}/getShowtimes")
    public ResponseEntity<List<String>> getShowtimes(@PathVariable("id") Long movieId) {
        List<String> showtimeStrings = movieService.getShowtimesByMovieId(movieId); // Returns List<String>
        return ResponseEntity.ok(showtimeStrings);
    }





}
