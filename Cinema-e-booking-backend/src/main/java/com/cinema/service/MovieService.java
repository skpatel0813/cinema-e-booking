package com.cinema.service;

import com.cinema.model.Movie;
import com.cinema.model.MovieShowtime;
import com.cinema.model.Promotion;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.MovieShowtimeRepository;
import com.cinema.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    public List<Movie> getRandomMovies() {
        return movieRepository.getRandomMovies();
    }

    public Movie getMovieById(int id) {
        return movieRepository.findById(id).orElse(null);
    }

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

    public void deleteMovie(int id) {
        movieRepository.deleteById(id);
    }

    public Promotion addOrUpdatePromotion(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public void deletePromotion(Long promotionId) {
        promotionRepository.deleteById(promotionId);
    }

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

    // In MovieService.java or relevant service class
    public List<String> getShowtimesByMovieId(Long movieId) {
        return movieShowtimeRepository.findByMovieId(movieId).stream()
                .map(showtime -> showtime.getShowTime().toString()) // Convert LocalTime to String
                .collect(Collectors.toList());
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }



}
