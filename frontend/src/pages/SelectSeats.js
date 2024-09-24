import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/SelectSeats.css'; // Create this CSS file based on the seat layout

const SelectSeats = () => {
  const location = useLocation();
  const { ticketCounts } = location.state || {};
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);

  useEffect(() => {
    // Fetch seats from the backend
    axios.get('http://localhost:8081/api/seats/getSeats') // Assuming your backend endpoint for seats
      .then(response => {
        setSeats(response.data);
        // Assuming the response contains a list of seat objects { id, row, number, isReserved }
        setReservedSeats(response.data.filter(seat => seat.isReserved).map(seat => seat.id));
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
      });
  }, []);

  const handleSeatClick = (seatId) => {
    if (!reservedSeats.includes(seatId)) {
      setSelectedSeats(prevSeats => 
        prevSeats.includes(seatId) ? prevSeats.filter(id => id !== seatId) : [...prevSeats, seatId]
      );
    }
  };

  const handleReserveSeats = () => {
    axios.post('http://localhost:8081/api/seats/reserve', { seats: selectedSeats }) // Save to backend
      .then(() => {
        alert('Seats reserved successfully!');
      })
      .catch(error => {
        console.error('Error reserving seats:', error);
      });
  };

  return (
    <div className="select-seats-container">
      <h1>Select Your Seats</h1>
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
