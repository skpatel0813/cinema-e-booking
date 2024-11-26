package com.cinema.service;

import com.cinema.model.Movie;
import com.cinema.model.MovieShowtime;
import com.cinema.model.Promotion;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.MovieShowtimeRepository;
import com.cinema.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private MovieShowtimeRepository movieShowtimeRepository;

    /**
     * Retrieves a random list of movies.
     * @return a list of movies.
     */
    public List<Movie> getRandomMovies() {
        return movieRepository.getRandomMovies();
    }

    /**
     * Retrieves a movie by its unique identifier.
     *
     * @param id The unique ID of the movie.
     * @return The Movie object if found, otherwise null.
     */
    public Movie getMovieById(int id) {
        return movieRepository.findById(id).orElse(null);
    }

    /**
     * Updates an existing movie with new details.
     *
     * @param id The unique ID of the movie to update.
     * @param updatedMovie The Movie object containing updated details.
     * @return The updated Movie object.
     * @throws IllegalArgumentException if the movie is not found.
     */
    public Movie updateMovie(int id, Movie updatedMovie) {
        Optional<Movie> existingMovieOpt = movieRepository.findById(id);
        if (existingMovieOpt.isPresent()) {
            Movie existingMovie = existingMovieOpt.get();
            existingMovie.setTitle(updatedMovie.getTitle());
            existingMovie.setCategory(updatedMovie.getCategory());
            existingMovie.setCast(updatedMovie.getCast());
            existingMovie.setDirector(updatedMovie.getDirector());
            existingMovie.setProducer(updatedMovie.getProducer());
            existingMovie.setSynopsis(updatedMovie.getSynopsis());
            existingMovie.setTrailerUrl(updatedMovie.getTrailerUrl());
            existingMovie.setPosterUrl(updatedMovie.getPosterUrl());
            existingMovie.setRatingCode(updatedMovie.getRatingCode());
            existingMovie.setIsNowPlaying(updatedMovie.getIsNowPlaying());
            existingMovie.setIsComingSoon(updatedMovie.getIsComingSoon());
            return movieRepository.save(existingMovie);
        }
        throw new IllegalArgumentException("Movie with ID " + id + " not found.");
    }

    /**
     * Deletes a movie by its ID.
     *
     * @param id The unique ID of the movie to delete.
     */
    public void deleteMovie(int id) {
        movieRepository.deleteById(id);
    }

    /**
     * Adds showtimes for a specific movie.
     *
     * @param movieId The ID of the movie to associate with showtimes.
     * @param showtimes A list of showtime strings.
     * @return A list of saved MovieShowtime objects.
     */
    public List<MovieShowtime> addShowtimes(int movieId, List<String> showtimes) {
        List<MovieShowtime> savedShowtimes = new ArrayList<>();
        for (String time : showtimes) {
            MovieShowtime showtime = new MovieShowtime();
            showtime.setMovieId(movieId);
            showtime.setShowTime(LocalTime.parse(time));  // Parse String to LocalTime
            savedShowtimes.add(movieShowtimeRepository.save(showtime));
        }
        return savedShowtimes;
    }

    /**
     * Retrieves showtimes for a specific movie by its ID.
     *
     * @param movieId The unique ID of the movie.
     * @return A list of showtime strings.
     */
    public List<String> getShowtimesByMovieId(Long movieId) {
        return movieShowtimeRepository.findByMovieId(movieId).stream()
                .map(showtime -> showtime.getShowTime().toString()) // Convert LocalTime to String
                .collect(Collectors.toList());
    }

    /**
     * Saves a new movie to the repository.
     *
     * @param movie The Movie object to save.
     * @return The saved Movie object.
     */
    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }



}
