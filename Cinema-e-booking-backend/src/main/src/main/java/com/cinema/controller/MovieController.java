package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Fetch a list of random movies for the home page
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable int id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.ok("Movie deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting movie");
        }
    }

}
