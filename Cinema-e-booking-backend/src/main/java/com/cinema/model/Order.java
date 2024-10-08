package com.cinema.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    private String userEmail;
    private String movieTitle;
    private String showtime;

    // Store selectedSeats as a JSON string
    @Column(columnDefinition = "TEXT")
    private String selectedSeats;

    private String cardUsed;
    private int adultTickets;
    private int childTickets;
    private int seniorTickets;
    private double ticketPrice;
    private double salesTax;
    private double fee;
    private double promotionDiscount;
    private double totalCost;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getShowtime() { return showtime; }
    public void setShowtime(String showtime) { this.showtime = showtime; }

    public String getSelectedSeats() { return selectedSeats; }

    // Setter to convert List<String> to JSON string
    public void setSelectedSeats(List<String> seats) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.selectedSeats = mapper.writeValueAsString(seats);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    // Getter to convert JSON string back to List<String>
    public List<String> getSelectedSeatsAsList() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(this.selectedSeats, List.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getCardUsed() { return cardUsed; }
    public void setCardUsed(String cardUsed) { this.cardUsed = cardUsed; }

    public int getAdultTickets() { return adultTickets; }
    public void setAdultTickets(int adultTickets) { this.adultTickets = adultTickets; }

    public int getChildTickets() { return childTickets; }
    public void setChildTickets(int childTickets) { this.childTickets = childTickets; }

    public int getSeniorTickets() { return seniorTickets; }
    public void setSeniorTickets(int seniorTickets) { this.seniorTickets = seniorTickets; }

    public double getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(double ticketPrice) { this.ticketPrice = ticketPrice; }

    public double getSalesTax() { return salesTax; }
    public void setSalesTax(double salesTax) { this.salesTax = salesTax; }

    public double getFee() { return fee; }
    public void setFee(double fee) { this.fee = fee; }

    public double getPromotionDiscount() { return promotionDiscount; }
    public void setPromotionDiscount(double promotionDiscount) { this.promotionDiscount = promotionDiscount; }

    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
}
