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

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip")
    private String zip;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "subscribe_to_promotions")
    private boolean subscribeToPromotions;

    @Column(name = "billingStreet")
    private String billingStreet;

    @Column(name = "billingCity")
    private String billingCity;

    @Column(name = "billingState")
    private String billingState;

    @Column(name = "billingZip")
    private String billingZip;

    @Column(name = "card_number1")
    private String cardNumber;

    @Column(name = "cardType1")
    private String cardType;

    @Column(name = "expirationDate1")
    private String expirationDate;

    @Column(name = "cvv1")
    private String cvv1;

    private String cvv2;

    private String cvv3;

    @Column(name = "role", nullable = false)
    private String role = "user";  // Default role is 'user'


    private String cardType2;
    private String cardNumber2;
    private String expirationDate2;

    private String cardType3;
    private String cardNumber3;
    private String expirationDate3;

    private String resetToken; // Token for resetting the password
    private LocalDateTime tokenExpiryTime; // Expiry time for the reset token

    // Constructors
    public User() {}

    public User(String name, String email, String password, String phone, boolean subscribeToPromotions, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.subscribeToPromotions = subscribeToPromotions;
        this.isVerified = false;
        this.role = role;  // 'admin' or 'user'
    }

    // Getters and Setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public boolean isSubscribeToPromotions() {
        return subscribeToPromotions;
    }

    public void setSubscribeToPromotions(boolean subscribeToPromotions) {
        this.subscribeToPromotions = subscribeToPromotions;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getBillingStreet() {
        return billingStreet;
    }

    public void setBillingStreet(String billingStreet) {
        this.billingStreet = billingStreet;
    }

    public String getBillingCity() {
        return billingCity;
    }

    public void setBillingCity(String billingCity) {
        this.billingCity = billingCity;
    }

    public String getBillingState() {
        return billingState;
    }

    public void setBillingState(String billingState) {
        this.billingState = billingState;
    }

    public String getBillingZip() {
        return billingZip;
    }

    public void setBillingZip(String billingZip) {
        this.billingZip = billingZip;
    }

    public String getCardNumber1() {
        return cardNumber;
    }

    public void setCardNumber1(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getExpirationDate1() {
        return expirationDate;
    }

    public void setExpirationDate1(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getCardType1() {
        return cardType;
    }

    public void setCardType1(String cardType1) {
        this.cardType = cardType1;
    }

    public String getCardType2() {
        return cardType2;
    }

    public void setCardType2(String cardType2) {
        this.cardType2 = cardType2;
    }

    public String getCardNumber2() {
        return cardNumber2;
    }

    public void setCardNumber2(String cardNumber2) {
        this.cardNumber2 = cardNumber2;
    }

    public String getExpirationDate2() {
        return expirationDate2;
    }

    public void setExpirationDate2(String expirationDate2) {
        this.expirationDate2 = expirationDate2;
    }

    public String getCardType3() {
        return cardType3;
    }

    public void setCardType3(String cardType3) {
        this.cardType3 = cardType3;
    }

    public String getCardNumber3() {
        return cardNumber3;
    }

    public void setCardNumber3(String cardNumber3) {
        this.cardNumber3 = cardNumber3;
    }

    public String getExpirationDate3() {
        return expirationDate3;
    }

    public void setExpirationDate3(String expirationDate3) {
        this.expirationDate3 = expirationDate3;
    }

    public String getCvv2() {
        return cvv2;
    }

    public void setCvv2(String cvv2) {
        this.cvv2 = cvv2;
    }

    public String getCvv3() {
        return cvv3;
    }

    public void setCvv3(String cvv3) {
        this.cvv3 = cvv3;
    }

    public String getCvv1() {
        return cvv1;
    }

    public void setCvv1(String cvv1) {
        this.cvv1 = cvv1;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getTokenExpiryTime() {
        return tokenExpiryTime;
    }

    public void setTokenExpiryTime(LocalDateTime tokenExpiryTime) {
        this.tokenExpiryTime = tokenExpiryTime;
    }
}
