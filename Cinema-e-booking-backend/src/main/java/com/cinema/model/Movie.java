package com.cinema.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    // Booleans for movie status
    @JsonProperty("isNowPlaying")
    private boolean isNowPlaying;

    @JsonProperty("isComingSoon")
    private boolean isComingSoon;

    @JsonProperty("isOnDemand")
    private boolean isOnDemand;

    @Column(name = "show_time")
    private LocalDateTime showTime;

    private BigDecimal price;  // Price of the movie ticket

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private BigDecimal adultTicketPrice;
    private BigDecimal childrenTicketPrice;
    private BigDecimal seniorTicketPrice;
    private String promotionCode;
    private String promotionDescription;
    private BigDecimal discountAmount;

    @Column(name = "show_time_1")
    private LocalTime show_time_1;

    @Column(name = "show_time_2")
    private LocalTime show_time_2;

    @Column(name = "show_time_3")
    private LocalTime show_time_3;

    @Column(name = "show_time_4")
    private LocalTime show_time_4;

    @Column(name = "show_time_5")
    private LocalTime show_time_5;



    // Constructor
    public Movie() {}

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

    public boolean isNowPlaying() {
        return isNowPlaying;
    }

    public void setNowPlaying(boolean nowPlaying) {
        isNowPlaying = nowPlaying;
    }

    public boolean isComingSoon() {
        return isComingSoon;
    }

    public void setComingSoon(boolean comingSoon) {
        isComingSoon = comingSoon;
    }

    public boolean isOnDemand() {
        return isOnDemand;
    }

    public void setOnDemand(boolean onDemand) {
        isOnDemand = onDemand;
    }

    public BigDecimal getAdultTicketPrice() {
        return adultTicketPrice;
    }

    public void setAdultTicketPrice(BigDecimal adultTicketPrice) {
        this.adultTicketPrice = adultTicketPrice;
    }

    public BigDecimal getChildrenTicketPrice() {
        return childrenTicketPrice;
    }

    public void setChildrenTicketPrice(BigDecimal childrenTicketPrice) {
        this.childrenTicketPrice = childrenTicketPrice;
    }

    public BigDecimal getSeniorTicketPrice() {
        return seniorTicketPrice;
    }

    public void setSeniorTicketPrice(BigDecimal seniorTicketPrice) {
        this.seniorTicketPrice = seniorTicketPrice;
    }

    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }

    public String getPromotionDescription() {
        return promotionDescription;
    }

    public void setPromotionDescription(String promotionDescription) {
        this.promotionDescription = promotionDescription;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public LocalTime getShow_time_1() {

        return  show_time_1;

    }

    public void setShow_time_1(LocalTime show_time_1) {

        this.show_time_1 = show_time_1;

    }

    public LocalTime getShow_time_2() {

        return  show_time_2;

    }

    public void setShow_time_2(LocalTime show_time_2) {

        this.show_time_2 = show_time_2;

    }


    public LocalTime getShow_time_3() {

        return  show_time_3;

    }

    public void setShow_time_3(LocalTime show_time_3) {

        this.show_time_3 = show_time_3;

    }

    public LocalTime getShow_time_4() {

        return  show_time_4;

    }

    public void setShow_time_4(LocalTime show_time_4) {

        this.show_time_4 = show_time_4;

    }

    public LocalTime getShow_time_5() {

        return  show_time_5;

    }

    public void setShow_time_5(LocalTime show_time_5) {

        this.show_time_5 = show_time_5;

    }

    public void setIsPlaying(boolean isPlaying) {

        this.isNowPlaying = isPlaying;

    }

    public Boolean getIsPlaying() {

        return isNowPlaying;

    }

    public void setComingSoon(Boolean comingSoon) {

        this.isComingSoon = comingSoon;

    }

    public Boolean getComingSoon() {

        return isComingSoon;

    }

}
