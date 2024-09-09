// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    homeAddress: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    paymentInfo: {
      cardType: '',
      cardNumber: '',
      expirationDate: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [group, field] = name.split('.'); // Handling nested fields

    if (field) {
      // Nested fields (homeAddress, paymentInfo, billingAddress)
      setFormData((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value
        }
      }));
    } else {
      // Standard fields (name, email, password, phone)
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const { name, email, password, phone } = formData;
    if (!name || !email || !password || !phone) {
      return 'All personal information fields are required.';
    }
    // Add any other validation as necessary
    return '';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    axios.post('/api/register', formData)
      .then(response => {
        console.log('User registered successfully:', response.data);
        // Handle success, such as redirecting or showing a success message
      })
      .catch(error => {
        console.error('Error registering user:', error);
        setErrorMessage('An error occurred while registering. Please try again.');
      });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Personal Information */}
        <h3>Personal Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Home Address */}
        <h3>Home Address</h3>
        <input
          type="text"
          name="homeAddress.street"
          placeholder="Street"
          value={formData.homeAddress.street}
          onChange={handleChange}
        />
        <input
          type="text"
          name="homeAddress.city"
          placeholder="City"
          value={formData.homeAddress.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="homeAddress.state"
          placeholder="State"
          value={formData.homeAddress.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="homeAddress.zip"
          placeholder="Zip Code"
          value={formData.homeAddress.zip}
          onChange={handleChange}
        />

        {/* Payment Information (Optional) */}
        <h3>Payment Information (Optional)</h3>
        <input
          type="text"
          name="paymentInfo.cardType"
          placeholder="Card Type (e.g., Visa)"
          value={formData.paymentInfo.cardType}
          onChange={handleChange}
        />
        <input
          type="text"
          name="paymentInfo.cardNumber"
          placeholder="Card Number"
          value={formData.paymentInfo.cardNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="paymentInfo.expirationDate"
          placeholder="Expiration Date (MM/YY)"
          value={formData.paymentInfo.expirationDate}
          onChange={handleChange}
        />

        {/* Billing Address */}
        <h3>Billing Address</h3>
        <input
          type="text"
          name="billingAddress.street"
          placeholder="Billing Street Address"
          value={formData.billingAddress.street}
          onChange={handleChange}
        />
        <input
          type="text"
          name="billingAddress.city"
          placeholder="Billing City"
          value={formData.billingAddress.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="billingAddress.state"
          placeholder="Billing State"
          value={formData.billingAddress.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="billingAddress.zip"
          placeholder="Billing Zip Code"
          value={formData.billingAddress.zip}
          onChange={handleChange}
        />

        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
