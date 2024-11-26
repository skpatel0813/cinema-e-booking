package com.cinema.controller;

import com.cinema.model.Movie;
import com.cinema.model.MovieShowtime;
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

    /**
     * Retrieves random movies for the homepage.
     *
     * @return A list of random movies.
     */
    @GetMapping("/home")
    public List<Movie> getHomeMovies() {
        return movieService.getRandomMovies();
    }

    /**
     * Retrieves details of a specific movie by ID.
     *
     * @param id The unique ID of the movie.
     * @return ResponseEntity containing the movie or HTTP 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieDetails(@PathVariable int id) {
        Movie movie = movieService.getMovieById(id);
        if (movie != null) {
            return new ResponseEntity<>(movie, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Updates the details of an existing movie.
     *
     * @param id The unique ID of the movie.
     * @param movieDetails Updated movie details.
     * @return ResponseEntity with the updated movie or HTTP 404 if not found.
     */
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
            movie.setIsNowPlaying(movieDetails.getIsNowPlaying());
            movie.setIsComingSoon(movieDetails.getIsComingSoon());

            Movie updatedMovie = movieService.updateMovie(id, movieDetails);
            return ResponseEntity.ok(updatedMovie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a specific movie by its ID.
     *
     * @param id The unique ID of the movie.
     * @return ResponseEntity indicating the success or failure of the operation.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable int id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.ok("Movie deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting movie");
        }
    }

    /**
     * Adds new showtimes for a specific movie.
     *
     * @param movieId The unique ID of the movie.
     * @param showtimes A list of showtime strings to be added.
     * @return ResponseEntity containing the saved showtimes.
     */
    @PostMapping
    public ResponseEntity<?> addMovie(@RequestBody Movie movie) {
        try {
            Movie savedMovie = movieService .saveMovie(movie); // Save the movie
            return ResponseEntity.ok(savedMovie); // Return saved movie as JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding movie: " + e.getMessage());
        }
    }


    @PostMapping("/{id}/showtimes")
    public ResponseEntity<?> addShowtimes(@PathVariable("id") int movieId, @RequestBody List<String> showtimes) {
        try {
            List<MovieShowtime> savedShowtimes = movieService.addShowtimes(movieId, showtimes);
            return ResponseEntity.ok(savedShowtimes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding showtimes: " + e.getMessage());
        }
    }


    @GetMapping("/{id}/getShowtimes")
    public ResponseEntity<List<String>> getShowtimes(@PathVariable("id") Long movieId) {
        List<String> showtimeStrings = movieService.getShowtimesByMovieId(movieId); // Returns List<String>
        return ResponseEntity.ok(showtimeStrings);
    }





}
