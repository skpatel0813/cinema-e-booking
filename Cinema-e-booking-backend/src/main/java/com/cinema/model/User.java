package com.cinema.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String street;
    private String city;
    private String state;
    private String zip;
    private boolean isVerified;
    private String verificationCode;
    private String role = "user";
    private String resetToken;
    private LocalDateTime tokenExpiryTime;

    // New field for promotional subscription status
    private Boolean subscribeToPromotions;

    // Constructors
    public User() {}

    public User(String name, String email, String password, String phone, Boolean subscribeToPromotions, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.isVerified = false;
        this.subscribeToPromotions = subscribeToPromotions;
        this.role = role;
    }

    // Getters and Setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean isVerified) { this.isVerified = isVerified; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getTokenExpiryTime() { return tokenExpiryTime; }
    public void setTokenExpiryTime(LocalDateTime tokenExpiryTime) { this.tokenExpiryTime = tokenExpiryTime; }

    public Boolean getSubscribeToPromotions() { return subscribeToPromotions; }
    public void setSubscribeToPromotions(Boolean subscribeToPromotions) { this.subscribeToPromotions = subscribeToPromotions; }
}
