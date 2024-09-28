import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Confirmation.css'; 

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    booking = {},
    selectedSeats = [],
    movieTitle = '',
    showtime = '',
    ticketCounts = { adult: 0, child: 0, senior: 0 },
    ticketNumber = ''
  } = location.state || {};

  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');

  useEffect(() => {
    if (!booking || !selectedSeats || !movieTitle || !showtime) {
      // Redirect to home if no state is found
      navigate('/');
    }
  }, [booking, selectedSeats, movieTitle, showtime, navigate]);

  return (
    <div className="confirmation-container">
      <h1>Booking Confirmation</h1>
      <div className="confirmation-details">
        <h3>Thank you for your purchase!</h3>
        <p><strong>Booking Number:</strong> {booking.bookingNumber}</p>
        <p><strong>Ticket Number:</strong> {ticketNumber}</p>
        <p><strong>Movie Title:</strong> {movieTitle}</p>
        <p><strong>Showtime:</strong> {showtime}</p>
        <p><strong>Total Amount:</strong> ${booking.totalAmount && booking.totalAmount.toFixed(2)}</p>
        <h3>Order Details</h3>
        <p>Adult Tickets: {ticketCounts.adult}</p>
        <p>Child Tickets: {ticketCounts.child}</p>
        <p>Senior Tickets: {ticketCounts.senior}</p>
        <ul>
          {selectedSeats.map((seat, index) => (
            <li key={index}>
              Seat: Row {seat.row}, Number {seat.number}
            </li>
          ))}
        </ul>
        <p>A confirmation email has been sent to <strong>{userEmail}</strong>.</p>
        <button className="home-button" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
};

export default Confirmation;
