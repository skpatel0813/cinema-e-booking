import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      setReservedSeats(response.data.map(seat => seat.id));
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
    // Check if the seat is not reserved and we are not trying to deselect
    if (!reservedSeats.includes(seatId)) {
      if (selectedSeats.includes(seatId)) {
        // If seat is already selected, deselect it
        setSelectedSeats(prevSeats => prevSeats.filter(id => id !== seatId));
      } else if (selectedSeats.length < totalTickets) {
        // If limit not reached, add the seat
        setSelectedSeats(prevSeats => [...prevSeats, seatId]);
      } else if (selectedSeats.length === totalTickets) {
        // If limit reached, remove the first selected seat and add the new one
        setSelectedSeats(prevSeats => [...prevSeats.slice(1), seatId]);
      }
    }
  };

  const handleReserveSeats = () => {
    if (selectedSeats.length !== totalTickets) {
      alert(`You must select ${totalTickets} seats.`);
      return;
    }

    // Ensure movieId and showtime are available before navigating
    if (!movieId || !showtime) {
      alert('Movie ID or Showtime is missing!');
      return;
    }

    // Find detailed information about selected seats
    const selectedSeatDetails = seats.filter(seat => selectedSeats.includes(seat.id));

    // Navigate to checkout with necessary details
    navigate('/checkout', {
      state: {
        movieId,      // Make sure movieId is passed
        showtime,     // Make sure showtime is passed
        selectedSeats: selectedSeatDetails,  // Pass seat details to the checkout
        ticketCounts
      }
    });
  };

  return (
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
        <button className="reserve-button" onClick={handleReserveSeats}>
          Reserve Seats
        </button>
      )}
    </div>
  );
};

export default SelectSeats;
