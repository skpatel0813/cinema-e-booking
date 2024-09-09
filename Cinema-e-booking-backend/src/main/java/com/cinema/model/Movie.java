package com.cinema.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int movie_id;

    private String title;
    private String category;
    private String cast;        // Comma-separated string of cast members
    private String director;
    private String producer;
    private String synopsis;
    private String reviews;
    private String trailer_url;
    private String poster_url;  // Poster URL for the movie
    private String ratingCode;

    @Column(name = "show_time")
    private LocalDateTime showTime;

    private double price;
}
