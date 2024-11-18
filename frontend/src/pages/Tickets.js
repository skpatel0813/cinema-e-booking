import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import EditProfileModal from '../components/EditProfileModal'; // Import EditProfileModal component
import '../styles/Tickets.css'; // Create this CSS file based on your design

const Tickets = () => {
  const [prices, setPrices] = useState({});
  const [ticketCounts, setTicketCounts] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch prices from the backend
    axios.get('http://localhost:8081/api/pricing/getPrices') // Assuming your backend endpoint
      .then(response => {
        console.log('Prices fetched successfully:', response.data); // Debugging log
        setPrices(response.data);
      })
      .catch(error => {
        console.error('Error fetching prices:', error);
      });
  }, []);

  const incrementTicket = (type) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1
    }));
  };

  const decrementTicket = (type) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [type]: prevCounts[type] > 0 ? prevCounts[type] - 1 : 0
    }));
  };

  const handleContinue = () => {
    navigate('/selectseats', { state: { ticketCounts } });
  };

  // Check if there are any non-child tickets selected
  const nonChildTicketsSelected = ticketCounts.adult > 0 || ticketCounts.senior > 0;

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

      <div className="tickets-container">
        <h1>Select Your Tickets</h1>
        <div className="ticket-type">
          <div className="ticket-info">
            <h2>Adult</h2>
            <p>${prices.adultPrice ? prices.adultPrice.toFixed(2) : 'Loading...'}</p>
          </div>
          <div className="ticket-controls">
            <button onClick={() => decrementTicket('adult')}>-</button>
            <span>{ticketCounts.adult}</span>
            <button onClick={() => incrementTicket('adult')}>+</button>
          </div>
        </div>
        <div className="ticket-type">
          <div className="ticket-info">
            <h2>Child <span>Age 2-12</span></h2>
            <p>${prices.childrenPrice ? prices.childrenPrice.toFixed(2) : 'Loading...'}</p>
          </div>
          <div className="ticket-controls">
            <button onClick={() => decrementTicket('child')}>-</button>
            <span>{ticketCounts.child}</span>
            <button onClick={() => incrementTicket('child')}>+</button>
          </div>
        </div>
        <div className="ticket-type">
          <div className="ticket-info">
            <h2>Senior <span>Age 60+</span></h2>
            <p>${prices.seniorPrice ? prices.seniorPrice.toFixed(2) : 'Loading...'}</p>
          </div>
          <div className="ticket-controls">
            <button onClick={() => decrementTicket('senior')}>-</button>
            <span>{ticketCounts.senior}</span>
            <button onClick={() => incrementTicket('senior')}>+</button>
          </div>
        </div>
        {nonChildTicketsSelected && (
          <div className="continue-button-container">
            <button className="continue-button" onClick={handleContinue}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
