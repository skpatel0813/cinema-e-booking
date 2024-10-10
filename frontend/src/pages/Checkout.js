import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import '../styles/Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { movieId, showtime, selectedSeats = [], ticketCounts = {} } = location.state || {};
  
  const [movieTitle, setMovieTitle] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [promotionCode, setPromotionCode] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState(0);
  const [fee, setFee] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [user, setUser] = useState({ name: '', email: '', cards: [] });
  const [selectedCard, setSelectedCard] = useState('');
  const [promotionError, setPromotionError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableCards, setEditableCards] = useState([]);
  const [currentTicketCounts, setCurrentTicketCounts] = useState(ticketCounts);

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (movieId) {
      axios.get(`http://localhost:8081/api/movies/${movieId}`)
        .then(response => setMovieTitle(response.data.title))
        .catch(error => console.error('Error fetching movie title:', error));
    } else {
      console.error('Movie ID is missing!');
    }
  }, [movieId]);

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8081/user/getUserInfoByEmail?email=${email}`)
        .then(response => {
          const userData = response.data;
          const cards = [];

          if (userData.cardNumber1) {
            cards.push({
              id: 'card1',
              cardNumber: userData.cardNumber1,
              cardType: userData.cardType1,
              expirationDate: userData.expirationDate1
            });
          }
          if (userData.cardNumber2) {
            cards.push({
              id: 'card2',
              cardNumber: userData.cardNumber2,
              cardType: userData.cardType2,
              expirationDate: userData.expirationDate2
            });
          }
          if (userData.cardNumber3) {
            cards.push({
              id: 'card3',
              cardNumber: userData.cardNumber3,
              cardType: userData.cardType3,
              expirationDate: userData.expirationDate3
            });
          }

          setUser({ ...userData, cards });
          setEditableCards([...cards]);
        })
        .catch(error => console.error('Error fetching user info:', error));
    }
  }, [email]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/pricing/getPrices')
      .then(response => {
        const pricing = response.data;
        setFee(pricing.fee);
        calculateTotalPrice(pricing);
      })
      .catch(error => console.error('Error fetching prices:', error));
  }, [currentTicketCounts]);

  const calculateTotalPrice = (pricing) => {
    const { adultPrice = 0, childrenPrice = 0, seniorPrice = 0 } = pricing;
    const ticketPrice = (currentTicketCounts.adult || 0) * adultPrice + 
                        (currentTicketCounts.child || 0) * childrenPrice + 
                        (currentTicketCounts.senior || 0) * seniorPrice;

    const tax = ticketPrice * 0.07; // Sales tax of 7%
    setSalesTax(tax);

    const initialTotal = ticketPrice + tax + pricing.fee;
    setTotalPrice(ticketPrice);
    setFinalPrice(initialTotal);
  };

  const applyPromotion = () => {
    if (promotionCode.trim() === '') {
      setPromotionError('Please enter a promotion code.');
      return;
    }

    axios.get(`http://localhost:8081/api/promotions/getPromotions`)
      .then(response => {
        const promo = response.data.find(promo => promo.code === promotionCode);
        if (promo) {
          const discountAmount = totalPrice * (promo.discount / 100);
          setPromotionDiscount(discountAmount);
          setFinalPrice((totalPrice - discountAmount) + fee + salesTax);
          setPromotionError('');
        } else {
          setPromotionError('Invalid Promotion Code');
        }
      })
      .catch(error => {
        console.error('Error applying promotion:', error);
        setPromotionError('Error applying promotion code. Please try again.');
      });
  };

  const handlePayment = async () => {
    if (!selectedCard) {
      alert('Please select a card for payment.');
      return;
    }

    try {
      for (let seat of selectedSeats) {
        await axios.post('http://localhost:8081/api/seats/reserveSeat', null, {
          params: {
            movieId,
            showtime,
            seatId: seat.id
          }
        });
      }

      const paymentDetails = {
        userId: user.id,
        cardId: selectedCard,
        totalAmount: finalPrice,
      };

      const response = await axios.post('http://localhost:8081/api/checkout/processPayment', paymentDetails);
      alert('Payment Successful!');
      const ticketNumber = response.data.ticketNumber;

      const orderDetails = {
        userName: user.name,
        userEmail: user.email,
        movieTitle,
        showtime,
        selectedSeats: selectedSeats.map(seat => `${seat.row}${seat.number}`),
        cardUsed: selectedCard,
        adultTickets: currentTicketCounts.adult || 0,
        childTickets: currentTicketCounts.child || 0,
        seniorTickets: currentTicketCounts.senior || 0,
        ticketPrice: totalPrice,
        salesTax,
        fee,
        promotionDiscount,
        totalCost: finalPrice,
      };

      await axios.post('http://localhost:8081/api/orders/save', orderDetails);
      
      navigate('/confirmation', {
        state: {
          booking: response.data.booking,
          selectedSeats,
          movieTitle,
          showtime,
          ticketCounts: currentTicketCounts,
          ticketNumber
        }
      });
    } catch (error) {
      console.error('Error reserving seats or processing payment:', error);
      alert('Failed to reserve seats or process payment. Please try again.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaveCards = () => {
    axios.put(`http://localhost:8081/user/updatePaymentCards`, { email, cards: editableCards })
      .then(() => {
        setUser((prevUser) => ({ ...prevUser, cards: editableCards }));
        alert('Cards updated successfully');
        closeModal();
      })
      .catch(error => {
        console.error('Error updating cards:', error);
        alert('Failed to update cards. Please try again.');
      });
  };

  const handleCancelBooking = () => {
    axios.post('http://localhost:8081/api/seats/releaseSeats', { movieId, showtime, seats: selectedSeats })
      .then(() => {
        alert('Booking cancelled and seats released.');
        navigate('/');
      })
      .catch(error => console.error('Error releasing seats:', error));
  };

  const handleCardInputChange = (index, field, value) => {
    setEditableCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[index] = { ...updatedCards[index], [field]: value };
      return updatedCards;
    });
  };

  return (
    <div>
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName={user.name || "Guest"} 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
      />

      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="user-info">
          <h3>User Information</h3>
          <p>Name: {user.name || 'Guest'}</p>
          <p>Email: {user.email || 'Not Provided'}</p>
        </div>
        <div className="movie-details">
          <h3>Movie Details</h3>
          <p><strong>Title:</strong> {movieTitle}</p>
          <p><strong>Showtime:</strong> {showtime}</p>
          <p><strong>Selected Seats:</strong> {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}</p>
        </div>
        <div className="card-selection">
          <h3>Select Payment Card</h3>
          {user.cards && user.cards.length > 0 ? (
            <div>
              {user.cards.map((card, index) => (
                <div key={index} className="card-option">
                  <input
                    type="radio"
                    id={card.id}
                    name="card"
                    value={card.id}
                    onChange={() => setSelectedCard(card.id)}
                  />
                  <label htmlFor={card.id}>{`${card.cardType} ending in ${card.cardNumber.slice(-4)}`}</label>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved cards. Please add a card in your profile settings.</p>
          )}
          <button className="edit-cards-button" onClick={openModal}>
            Edit Payment Cards
          </button>
        </div>

        {/* New Section for Editing Ticket Counts, now above Ticket Summary */}
        <div className="ticket-count-edit">
          <h3>Edit Ticket Counts</h3>
          <div>
            <label>Adult:</label>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, adult: (prev.adult || 0) + 1 }))}>+</button>
            <span>{currentTicketCounts.adult || 0}</span>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, adult: Math.max((prev.adult || 0) - 1, 0) }))}>-</button>
          </div>
          <div>
            <label>Child:</label>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, child: (prev.child || 0) + 1 }))}>+</button>
            <span>{currentTicketCounts.child || 0}</span>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, child: Math.max((prev.child || 0) - 1, 0) }))}>-</button>
          </div>
          <div>
            <label>Senior:</label>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, senior: (prev.senior || 0) + 1 }))}>+</button>
            <span>{currentTicketCounts.senior || 0}</span>
            <button onClick={() => setCurrentTicketCounts(prev => ({ ...prev, senior: Math.max((prev.senior || 0) - 1, 0) }))}>-</button>
          </div>
          <button onClick={() => navigate('/selectseats', { state: { movieId, showtime, ticketCounts: currentTicketCounts } })}>
            Update Seats
          </button>
        </div>

        <div className="ticket-summary">
          <h3>Ticket Summary</h3>
          <p>Adult Tickets: {currentTicketCounts.adult || 0}</p>
          <p>Child Tickets: {currentTicketCounts.child || 0}</p>
          <p>Senior Tickets: {currentTicketCounts.senior || 0}</p>
          <p>Total Ticket Price: ${totalPrice.toFixed(2)}</p>
          <p>Sales Tax (7%): ${salesTax.toFixed(2)}</p>
          <p>Online Fee: ${fee.toFixed(2)}</p>
          <p>Promotion Discount: ${promotionDiscount.toFixed(2)}</p>
          <h3>Total: ${finalPrice.toFixed(2)}</h3>
        </div>
        
        <div className="promotion-section">
          <input
            type="text"
            placeholder="Enter Promotion Code"
            value={promotionCode}
            onChange={(e) => setPromotionCode(e.target.value)}
          />
          <button onClick={applyPromotion} disabled={!promotionCode.trim()}>
            Apply Promotion
          </button>
          {promotionError && <p className="error">{promotionError}</p>}
        </div>
        <div className="checkout-buttons">
          <button className="payment-button" onClick={handlePayment}>
            Proceed to Payment
          </button>
          <button className="cancel-button" onClick={handleCancelBooking}>
            Cancel Booking
          </button>
        </div>
      </div>

      {/* Modal for editing payment cards */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Edit Payment Cards</h3>
            {editableCards.map((card, index) => (
              <div key={card.id} className="edit-card-form">
                <label>Card Type:</label>
                <input
                  type="text"
                  value={card.cardType}
                  onChange={(e) => handleCardInputChange(index, 'cardType', e.target.value)}
                />
                <label>Card Number:</label>
                <input
                  type="text"
                  value={card.cardNumber}
                  onChange={(e) => handleCardInputChange(index, 'cardNumber', e.target.value)}
                />
                <label>Expiration Date:</label>
                <input
                  type="text"
                  value={card.expirationDate}
                  onChange={(e) => handleCardInputChange(index, 'expirationDate', e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleSaveCards}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
