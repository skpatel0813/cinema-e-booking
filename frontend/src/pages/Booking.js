// src/pages/Booking.js

import React, { useState } from 'react';

const Booking = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatSelection = (seat) => {
    // Logic for selecting/deselecting seats
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleBooking = () => {
    // Handle booking logic
    console.log('Booking seats:', selectedSeats);
  };

  return (
    <div>
      <h1>Select Seats</h1>
      <div className="seating-chart">
        {/* Render seats dynamically */}
        <button onClick={() => handleSeatSelection('A1')}>A1</button>
        <button onClick={() => handleSeatSelection('A2')}>A2</button>
        {/* Add more seats as needed */}
      </div>
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
};

export default Booking;
