package com.cinema.service;

import com.cinema.model.Movie;
import com.cinema.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRandomMovies() {
        return movieRepository.findRandomMovies();
    }

    // New method to print movie titles
    public void printMovieTitles() {
        List<Movie> movies = getRandomMovies();
        int i = 1;
        for (Movie movie : movies) {
            System.out.println(i + ". " + movie.getTitle() + " " +  movie.getPoster_url());
            i++;
        }
    }
}
