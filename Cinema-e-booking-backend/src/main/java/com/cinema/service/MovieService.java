package com.cinema.service;

import com.cinema.model.Movie;
import com.cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRandomMovies() {
        return movieRepository.getRandomMovies();
    }

    public Movie getMovieById(int id) { // id is int

        System.out.println(id);
        return movieRepository.findById(id).orElse(null);
    }

    public Movie updateMovie(int id, Movie updatedMovie) { // id is int
        Optional<Movie> existingMovieOpt = movieRepository.findById(id);
        if (existingMovieOpt.isPresent()) {
            Movie existingMovie = existingMovieOpt.get();


            existingMovie.setNowPlaying(updatedMovie.isNowPlaying());
            existingMovie.setComingSoon(updatedMovie.isComingSoon());
            existingMovie.setOnDemand(updatedMovie.isOnDemand());

            // Update the movie fields with the new details
            existingMovie.setTitle(updatedMovie.getTitle());
            existingMovie.setCategory(updatedMovie.getCategory());
            existingMovie.setCast(updatedMovie.getCast());
            existingMovie.setDirector(updatedMovie.getDirector());
            existingMovie.setProducer(updatedMovie.getProducer());
            existingMovie.setSynopsis(updatedMovie.getSynopsis());
            existingMovie.setReviews(updatedMovie.getReviews());
            existingMovie.setTrailer_url(updatedMovie.getTrailer_url());
            existingMovie.setPoster_url(updatedMovie.getPoster_url());
            existingMovie.setRatingCode(updatedMovie.getRatingCode());
            existingMovie.setShow_time_1(updatedMovie.getShow_time_1());
            existingMovie.setShow_time_2(updatedMovie.getShow_time_2());
            existingMovie.setShow_time_3(updatedMovie.getShow_time_3());
            existingMovie.setShow_time_4(updatedMovie.getShow_time_4());
            existingMovie.setShow_time_5(updatedMovie.getShow_time_5());
            existingMovie.setPrice(updatedMovie.getPrice());

            System.out.println("Showtimes being updated: " + updatedMovie.getShow_time_1() + ", " +
                    updatedMovie.getShow_time_2() + ", " + updatedMovie.getShow_time_3() + ", " +
                    updatedMovie.getShow_time_4() + ", " + updatedMovie.getShow_time_5());


            return movieRepository.save(existingMovie); // Save the updated movie
        } else {
            throw new IllegalArgumentException("Movie with ID " + id + " not found.");
        }
    }

    public void deleteMovie(int id) {
        movieRepository.deleteById(id);
    }

    // Save or update movie
    public Movie save(Movie movie) {
        return movieRepository.save(movie); // This is where the 'save' method is called
    }

    // Method to add a new movie to the database
    public Movie addMovie(Movie movie) {
        // You can add validation or additional logic here if needed
        return movieRepository.save(movie);  // Save the movie to the database
    }

    // Update ticket prices for a specific movie
    public Movie updateTicketPrices(int movieId, BigDecimal adultPrice, BigDecimal childrenPrice, BigDecimal seniorPrice) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        if (optionalMovie.isPresent()) {
            Movie movie = optionalMovie.get();
            movie.setAdultTicketPrice(adultPrice);
            movie.setChildrenTicketPrice(childrenPrice);
            movie.setSeniorTicketPrice(seniorPrice);
            return movieRepository.save(movie);
        }
        return null;
    }

    // Add or update a promotion for a specific movie
    public Movie addOrUpdatePromotion(int movieId, String code, String description, BigDecimal discount) {
        Optional<Movie> optionalMovie = movieRepository.findById(movieId);
        if (optionalMovie.isPresent()) {
            Movie movie = optionalMovie.get();
            movie.setPromotionCode(code);
            movie.setPromotionDescription(description);
            movie.setDiscountAmount(discount);
            return movieRepository.save(movie);
        }
        return null;
    }

    // Fetch showtimes for a specific movie by ID
    public List<String> getShowtimesByMovieId(int movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Collect all non-null showtimes into a list
        List<String> showtimes = new ArrayList<>();
        if (movie.getShow_time_1() != null) showtimes.add(movie.getShow_time_1().toString());
        if (movie.getShow_time_2() != null) showtimes.add(movie.getShow_time_2().toString());
        if (movie.getShow_time_3() != null) showtimes.add(movie.getShow_time_3().toString());
        if (movie.getShow_time_4() != null) showtimes.add(movie.getShow_time_4().toString());
        if (movie.getShow_time_5() != null) showtimes.add(movie.getShow_time_5().toString());

        return showtimes;
    }

}
