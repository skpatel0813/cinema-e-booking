package com.cinema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")  // Explicitly map this to the movie_id column in the database
    private int id;  // Changed movie_id to id as the name, but it maps to movie_id in the DB

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

    private BigDecimal price;  // Price of the movie ticket

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructor
    public Movie() {}

    public Movie(int id, String title, String category, String cast, String director, String producer, String synopsis, String reviews, String trailer_url, String poster_url, String ratingCode, LocalDateTime showTime, BigDecimal price) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.cast = cast;
        this.director = director;
        this.producer = producer;
        this.synopsis = synopsis;
        this.reviews = reviews;
        this.trailer_url = trailer_url;
        this.poster_url = poster_url;
        this.ratingCode = ratingCode;
        this.showTime = showTime;
        this.price = price;
    }

    // Getters and Setters for all fields

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCast() {
        return cast;
    }

    public void setCast(String cast) {
        this.cast = cast;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }

    public String getTrailer_url() {
        return trailer_url;
    }

    public void setTrailer_url(String trailer_url) {
        this.trailer_url = trailer_url;
    }

    public String getPoster_url() {
        return poster_url;
    }

    public void setPoster_url(String poster_url) {
        this.poster_url = poster_url;
    }

    public String getRatingCode() {
        return ratingCode;
    }

    public void setRatingCode(String ratingCode) {
        this.ratingCode = ratingCode;
    }

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Lifecycle hooks for setting creation and update timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
