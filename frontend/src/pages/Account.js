// src/pages/Account.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Account component to display user information and order history
const Account = () => {
  // State to manage user information
  const [userInfo, setUserInfo] = useState({
    name: '',        // User's full name
    email: '',       // User's email address
    phone: '',       // User's phone number
    subscription: false, // User's subscription status for promotions
  });

  // State to manage user's order history
  const [orderHistory, setOrderHistory] = useState([]);

  // Fetch user information and order history when the component mounts
  useEffect(() => {
    axios.get('/api/user') // Mock API endpoint to fetch user data
      .then(response => {
        setUserInfo(response.data.user); // Update user information state
        setOrderHistory(response.data.orders); // Update order history state
      })
      .catch(error => console.error('Error fetching user data:', error)); // Log any errors
  }, []);

  // Handle input changes in the user information form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState, // Preserve existing state
      [name]: value, // Update the specific field
    }));
  };

  // Handle changes to the subscription checkbox
  const handleSubscriptionChange = () => {
    setUserInfo(prevState => ({
      ...prevState,
      subscription: !prevState.subscription, // Toggle subscription status
    }));
  };

  // Handle profile update submission
  const handleUpdateProfile = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    axios.post('/api/user/update', userInfo) // Mock API endpoint to update user data
      .then(response => {
        alert('Profile updated successfully!'); // Notify the user of a successful update
      })
      .catch(error => console.error('Error updating profile:', error)); // Log any errors
  };

  return (
    <div>
      <h1>User Account</h1>

      {/* User Information Form */}
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={userInfo.name} // Bind input to userInfo state
              onChange={handleInputChange} // Handle input change
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userInfo.email} // Bind input to userInfo state
              onChange={handleInputChange} // Handle input change
              disabled // Email field is read-only
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={userInfo.phone} // Bind input to userInfo state
              onChange={handleInputChange} // Handle input change
            />
          </label>
        </div>
        <div>
          <label>
            Subscribe to Promotions:
            <input
              type="checkbox"
              checked={userInfo.subscription} // Bind checkbox to subscription state
              onChange={handleSubscriptionChange} // Handle subscription toggle
            />
          </label>
        </div>
        <button type="submit">Update Profile</button> {/* Submit button to save changes */}
      </form>

      {/* Order History Section */}
      <h2>Order History</h2>
      <ul>
        {orderHistory.map(order => (
          <li key={order.id}> {/* Each order is displayed as a list item */}
            {order.movieTitle} - {order.showtime} - {order.ticketCount} tickets
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Account;
