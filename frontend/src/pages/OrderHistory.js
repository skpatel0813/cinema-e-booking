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

  const handleCancelOrder = (orderId, showtime, movieTitle, selectedSeats) => {
    if (!selectedSeats || !Array.isArray(selectedSeats)) {
      console.error("Invalid or undefined selectedSeats:", selectedSeats);
      return;
    }

    // Parse each seat into letter and number
    const parsedSeats = selectedSeats.map((seat) => {
      const match = seat.match(/^([A-Za-z]+)(\d+)$/);
      if (match) {
        return { letter: match[1], number: parseInt(match[2], 10) };
      } else {
        console.error(`Invalid seat format: ${seat}`);
        return null;
      }
    }).filter(Boolean); // Filter out invalid seats (null values)

    console.log("Parsed seats:", parsedSeats);

    // Send parsed data to the backend
    axios.post(
      `http://localhost:8081/api/orders/cancel`,
      { // Include orderId and parsedSeats in the payload
        orderId,
        showtime,
        movieTitle,
        seats: parsedSeats,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        alert(response.data);
        setOrders((prevOrders) =>
          prevOrders.filter(
            (order) => order.id !== orderId // Remove canceled order
          )
        );
      })
      .catch((error) => {
        console.error("Error canceling order:", error);
        alert(error.response?.data || "Failed to cancel order.");
      });
  };

  // Helper function to check if cancellation is allowed
  const isCancellationAllowed = (showtime) => {
    const currentTime = new Date();
    const orderTime = new Date(showtime);
    const diffMinutes = (orderTime - currentTime) / (1000 * 60); // Difference in minutes

    if (diffMinutes > 0) {
      console.log(`Seats available for cancellation (time hasn't passed): ${showtime}`);
    }
    return diffMinutes > 60; // Cancellation allowed only if more than 60 minutes left
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
                if (!Array.isArray(selectedSeats)) {
                  throw new Error('Parsed selectedSeats is not an array');
                }
              } catch (error) {
                console.error('Error parsing selectedSeats:', error);
                selectedSeats = []; // Default to an empty array
              }

              const canCancel = isCancellationAllowed(order.showtime);

              // Log seats if the date and time haven't passed
              if (canCancel) {
                console.log(`Seats for order ${order.id}:`, selectedSeats);
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
                    {canCancel ? (
                      <button
                        onClick={() => handleCancelOrder(order.id, order.showtime, order.movieTitle, selectedSeats || [])}
                        className="cancel-button"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <p className="cancel-info">Cancellation not allowed</p>
                    )}
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
