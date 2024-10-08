import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState(localStorage.getItem('user') || ''); // Retrieve user name from local storage
  const [email] = useState(localStorage.getItem('email')); // Retrieve email from local storage
  const [role] = useState(localStorage.getItem('role')); // Retrieve role from local storage

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8081/api/orders/user/${email}`)
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error('Error fetching order history:', error);
        });
    }
  }, [email]);

  const handleLoginClick = () => {
    // Logic for showing login modal or redirecting to login page
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUserName('');
    window.location.reload(); // Reload the page after logout
  };

  const handleEditProfileClick = () => {
    // Logic for editing profile
  };

  return (
    <>
      <NavBar
        onLoginClick={handleLoginClick}
        userName={userName}
        onLogout={handleLogout}
        onEditProfileClick={handleEditProfileClick}
      />
      <div className="order-history-container">
        <h1>Your Order History</h1>
        {orders.length > 0 ? (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order-item">
                <div className="order-details">
                  <h2>{order.movieTitle}</h2>
                  <p>Date: {order.showtime}</p>
                  <p>Seats: {Array.isArray(order.selectedSeatsAsList) 
                    ? order.selectedSeatsAsList.join(', ') 
                    : 'N/A'}
                  </p>
                  <p>Total Cost: ${order.totalCost.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
