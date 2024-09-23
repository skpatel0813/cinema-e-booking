package com.cinema.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pricing")
public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "adult_price", nullable = false)
    private Double adultPrice;

    @Column(name = "children_price", nullable = false)
    private Double childrenPrice;

    @Column(name = "senior_price", nullable = false)
    private Double seniorPrice;

    @Column(name = "fee", nullable = false)
    private Double fee;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAdultPrice() {
        return adultPrice;
    }

    public void setAdultPrice(Double adultPrice) {
        this.adultPrice = adultPrice;
    }

    public Double getChildrenPrice() {
        return childrenPrice;
    }

    public void setChildrenPrice(Double childrenPrice) {
        this.childrenPrice = childrenPrice;
    }

    public Double getSeniorPrice() {
        return seniorPrice;
    }

    public void setSeniorPrice(Double seniorPrice) {
        this.seniorPrice = seniorPrice;
    }

    public Double getFee() {

        return fee;

    }

    public void setFee(Double fee) {

        this.fee = fee;

    }
}
