package com.cinema.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "movie_showtimes")
public class MovieShowtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long showtimeId;

    private Long movieId;
    private LocalTime showTime;
    private BigDecimal adultTicketPrice;
    private BigDecimal childrenTicketPrice;
    private BigDecimal seniorTicketPrice;

    // Getters and Setters
    public Long getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Long showtimeId) {
        this.showtimeId = showtimeId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public LocalTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalTime showTime) {
        this.showTime = showTime;
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
}
