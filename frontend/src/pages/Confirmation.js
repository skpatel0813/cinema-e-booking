import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Import NavBar component
import EditProfileModal from '../components/EditProfileModal'; // Import EditProfileModal component
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

  const [userEmail, setUserEmail] = useState('');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal state

  useEffect(() => {
    // Get rememberMeData from localStorage and parse it
    const rememberMeData = localStorage.getItem('rememberMeData');
    if (rememberMeData) {
      try {
        const parsedData = JSON.parse(rememberMeData);
        if (parsedData.email) {
          setUserEmail(parsedData.email);
        }
      } catch (error) {
        console.error('Error parsing rememberMeData:', error);
      }
    }

    // Redirect to home if critical state is missing
    if (!booking || !selectedSeats || !movieTitle || !showtime) {
      navigate('/'); // Redirect to home if no state is found
    }

    // Replace history entries to prevent back navigation to restricted pages
    const restrictedPages = ['/checkout', '/selectseats', '/showtimes'];
    const filteredHistory = window.history.state?.entries?.filter(
      (entry) => !restrictedPages.includes(entry.pathname)
    );

    if (filteredHistory) {
      window.history.replaceState(
        { ...window.history.state, entries: filteredHistory },
        ''
      );
    }
  }, [booking, selectedSeats, movieTitle, showtime, navigate]);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true); // Open the modal
  };

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false); // Close the modal
  };

  return (
    <div>
      {/* Include NavBar at the top */}
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="User" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={handleEditProfileClick} // Use modal opening function
      />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfileModal} />

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
    </div>
  );
};

export default Confirmation;
