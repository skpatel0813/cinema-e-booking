// src/pages/Account.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    subscription: false,
  });
  const [orderHistory, setOrderHistory] = useState([]);

  // Fetch user information and order history when the component mounts
  useEffect(() => {
    // Mock API call to fetch user information
    axios.get('/api/user')
      .then(response => {
        setUserInfo(response.data.user);
        setOrderHistory(response.data.orders);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubscriptionChange = () => {
    setUserInfo(prevState => ({
      ...prevState,
      subscription: !prevState.subscription,
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Mock API call to update user information
    axios.post('/api/user/update', userInfo)
      .then(response => {
        alert('Profile updated successfully!');
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <div>
      <h1>User Account</h1>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              disabled // Typically, email would not be changed
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Subscribe to Promotions:
            <input
              type="checkbox"
              checked={userInfo.subscription}
              onChange={handleSubscriptionChange}
            />
          </label>
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <h2>Order History</h2>
      <ul>
        {orderHistory.map(order => (
          <li key={order.id}>
            {order.movieTitle} - {order.showtime} - {order.ticketCount} tickets
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Account;
