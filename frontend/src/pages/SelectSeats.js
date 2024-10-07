import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import '../styles/SelectSeats.css';

const SelectSeats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticketCounts } = location.state || {};
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  // Retrieve movieId and showtime from local storage
  const movieId = localStorage.getItem('selectedMovieId');
  const showtime = localStorage.getItem('selectedShowtime');

  // Calculate total tickets selected
  const totalTickets = (ticketCounts.adult || 0) + (ticketCounts.child || 0) + (ticketCounts.senior || 0);

  useEffect(() => {
    // Fetch reserved seats for this movie and showtime from the backend
    axios.get('http://localhost:8081/api/seats/getReservedSeats', {
      params: {
        movieId,
        showtime,
      }
    }).then(response => {
      setReservedSeats(response.data.map(seat => seat.id));  // Store reserved seat IDs
    }).catch(error => {
      console.error('Error fetching reserved seats:', error);
    });

    // Fetch all seats from the backend
    axios.get('http://localhost:8081/api/seats/getSeats')
      .then(response => {
        setSeats(response.data);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
      });
  }, [movieId, showtime]);

  const handleSeatClick = (seatId) => {
    if (!reservedSeats.includes(seatId)) {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(prevSeats => prevSeats.filter(id => id !== seatId));
      } else if (selectedSeats.length < totalTickets) {
        setSelectedSeats(prevSeats => [...prevSeats, seatId]);
      } else if (selectedSeats.length === totalTickets) {
        setSelectedSeats(prevSeats => [...prevSeats.slice(1), seatId]);
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length !== totalTickets) {
      alert(`You must select ${totalTickets} seats.`);
      return;
    }

    navigate('/checkout', {
      state: {
        movieId,
        showtime,
        selectedSeats: seats.filter(seat => selectedSeats.includes(seat.id)), // Pass selected seats
        ticketCounts
      }
    });
  };

  return (
    <div>
      {/* Include NavBar at the top */}
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="User" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
      />
      
      <div className="select-seats-container">
        <h1>Select Your Seats</h1>
        <p>Total Tickets: {totalTickets}</p>
        <div className="seat-layout">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`seat ${reservedSeats.includes(seat.id) ? 'reserved' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat.id)}
            >
              {seat.row}-{seat.number}
            </div>
          ))}
        </div>
        {selectedSeats.length > 0 && (
          <button className="reserve-button" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectSeats;
