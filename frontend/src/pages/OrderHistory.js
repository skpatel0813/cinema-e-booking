import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import EditProfileModal from '../components/EditProfileModal'; // Import the modal
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState(localStorage.getItem('user') || '');
  const [email, setEmail] = useState('');
  const [role] = useState(localStorage.getItem('role'));
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const rememberMeData = localStorage.getItem('rememberMeData');
    if (rememberMeData) {
      try {
        const parsedData = JSON.parse(rememberMeData);
        if (parsedData.email) {
          setEmail(parsedData.email);
        }
      } catch (error) {
        console.error('Error parsing rememberMeData:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (email) {
      console.log('Fetching order history for email:', email);

      axios.get(`http://localhost:8081/api/orders/user/${email}`)
        .then(response => {
          console.log('Order history received from backend:', response.data);
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
    localStorage.removeItem('rememberMeData');
    setUserName('');
    window.location.reload();
  };

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true); // Open the modal
  };

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false); // Close the modal
  };

  return (
    <>
      <NavBar
        onLoginClick={handleLoginClick}
        userName={userName}
        onLogout={handleLogout}
        onEditProfileClick={handleEditProfileClick}
      />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfileModal} />
      <div className="order-history-container">
        <h1>Your Order History</h1>
        {orders.length > 0 ? (
          <ul className="order-list">
            {orders.map((order) => {
              let selectedSeats = [];
              try {
                selectedSeats = JSON.parse(order.selectedSeats);
              } catch (error) {
                console.error('Error parsing selectedSeats:', error);
              }

              return (
                <li key={order.id} className="order-item">
                  <div className="order-details">
                    <h2>{order.movieTitle}</h2>
                    <p>Date: {order.showtime}</p>
                    <p>Seats: {Array.isArray(selectedSeats) 
                      ? selectedSeats.join(', ') 
                      : 'N/A'}
                    </p>
                    <p>Total Cost: ${order.totalCost.toFixed(2)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderHistory;
