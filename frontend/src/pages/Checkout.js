import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Import NavBar component
import EditProfileModal from '../components/EditProfileModal'; // Import EditProfileModal component
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
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', cards: [] });
  const [selectedCard, setSelectedCard] = useState('');
  const [promotionError, setPromotionError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Modal state for Edit Profile
  const [editableCards, setEditableCards] = useState([]);
  const [currentTicketCounts, setCurrentTicketCounts] = useState(ticketCounts);
  const [originalTicketCounts] = useState(ticketCounts); // Store original counts
  const [ticketCountsChanged, setTicketCountsChanged] = useState(false); // New state

  const [newCard, setNewCard] = useState({
    cardType: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  // Retrieve and parse email from rememberMeData in localStorage
  useEffect(() => {
    const rememberMeData = localStorage.getItem('rememberMeData');
    if (rememberMeData) {
      try {
        const parsedData = JSON.parse(rememberMeData);
        const email = parsedData.email || '';
        setUser((prevUser) => ({ ...prevUser, email }));
      } catch (error) {
        console.error('Error parsing rememberMeData:', error);
      }
    }
  }, []);

  // Fetch movie title
  useEffect(() => {
    if (movieId) {
      axios.get(`http://localhost:8081/api/movies/${movieId}`)
        .then(response => setMovieTitle(response.data.title))
        .catch(error => console.error('Error fetching movie title:', error));
    } else {
      console.error('Movie ID is missing!');
    }
  }, [movieId]);

  // Fetch user info and payment methods
  useEffect(() => {
    if (user.email) {
      axios.get(`http://localhost:8081/user/getUserInfoByEmail?email=${user.email}`)
        .then(response => {
          const userData = response.data;
          setUser(prevUser => ({
            ...prevUser,
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          }));
        })
        .catch(error => console.error('Error fetching user info:', error));

      axios.get(`http://localhost:8081/user/getPaymentMethodsByEmail?email=${user.email}`)
        .then(response => {
          const cards = response.data; // Array of card details
          setUser(prevUser => ({ ...prevUser, cards }));
        })
        .catch(error => console.error('Error fetching payment methods:', error));
    }
  }, [user.email]);

  // Fetch pricing details and calculate total price
  useEffect(() => {
    axios.get('http://localhost:8081/api/pricing/getPrices')
      .then(response => {
        const pricing = response.data;
        setFee(pricing.fee);
        calculateTotalPrice(pricing);
      })
      .catch(error => console.error('Error fetching prices:', error));
  }, [currentTicketCounts]);

  // Check if ticket counts have changed
  useEffect(() => {
    const countsHaveChanged =
      currentTicketCounts.adult !== (ticketCounts.adult || 0) ||
      currentTicketCounts.child !== (ticketCounts.child || 0) ||
      currentTicketCounts.senior !== (ticketCounts.senior || 0);

    setTicketCountsChanged(countsHaveChanged);
  }, [currentTicketCounts, ticketCounts]);

  // Calculate total price
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

  // Apply promotion code
  const applyPromotion = () => {
    if (promotionCode.trim() === '') {
      setPromotionError('Please enter a promotion code.');
      return;
    }

    axios.get(`http://localhost:8081/api/promotions/getPromotionByCode?code=${promotionCode}`)
      .then(response => {
        const promo = response.data;
        if (promo) {
          const discountAmount = totalPrice * (promo.discountAmount / 100);
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

  // Handle payment and seat reservation
  const handlePayment = async () => {
    if (!selectedCard) {
      alert('Please select a card for payment.');
      return;
    }

    try {
      const paymentDetails = {
        userId: user.id,
        cardId: selectedCard,
        totalAmount: finalPrice,
        bookingNumber: movieId + showtime,
      };

      console.log('Payment Details:', paymentDetails); // Log for debugging

      const paymentResponse = await axios.post('http://localhost:8081/api/checkout/processPayment', paymentDetails);

      if (paymentResponse.status === 200) {
        alert('Payment Successful!');
        const ticketNumber = paymentResponse.data.ticketNumber;

        for (let seat of selectedSeats) {
          await axios.post('http://localhost:8081/api/seats/reserveSeat', null, {
            params: {
              movieId,
              showtime,
              seatId: seat.id,
            },
          });
        }

        const orderDetails = {
          userName: `${user.firstName} ${user.lastName}`,
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

        console.log('Order Details:', orderDetails); // Log for debugging

        await axios.post('http://localhost:8081/api/orders/save', orderDetails);

        navigate('/confirmation', {
          state: {
            booking: paymentResponse.data.booking,
            selectedSeats,
            movieTitle,
            showtime,
            ticketCounts: currentTicketCounts,
            ticketNumber,
          },
        });
      }
    } catch (error) {
      console.error('Error processing payment or reserving seats:', error);
      alert('Failed to process payment or reserve seats. Please try again.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true); // Open the Edit Profile modal
  };

  const closeEditProfileModal = () => {
    setIsEditProfileOpen(false); // Close the Edit Profile modal
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

  const handleCancelChanges = () => {
    setCurrentTicketCounts(originalTicketCounts); // Reset to original counts
    setTicketCountsChanged(false); // Reset the changed flag
  };

  const canProceedToPayment = currentTicketCounts.adult > 0 || currentTicketCounts.senior > 0;

  const handleAddNewCard = () => {
    if (!newCard.cardType || !newCard.cardNumber || !newCard.expirationDate || !newCard.cvv) {
      alert('Please fill in all fields to add a new card.');
      return;
    }
  
    // Prepare updated cards
    const updatedCards = [...user.cards, {
      id: null, // Or omit this field if the backend generates it
      cardType: newCard.cardType,
      cardNumber: newCard.cardNumber,
      expirationDate: newCard.expirationDate,
      cvv: newCard.cvv
    }];
  
    axios.put(`http://localhost:8081/user/updatePaymentCards`, {
      email: user.email,
      cards: updatedCards
    })
    .then(() => {
      setUser((prevUser) => ({ ...prevUser, cards: updatedCards }));
      setNewCard({ cardType: '', cardNumber: '', expirationDate: '', cvv: '' }); // Reset form
      alert('New card added successfully');
    })
    .catch(error => {
      console.error('Error adding new card:', error);
      alert('Failed to add new card. Please try again.');
    });
  };
  

  return (
    <div>
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName={`${user.firstName} ${user.lastName}` || "Guest"} 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={handleEditProfileClick} // Use modal opening function
      />

      <EditProfileModal isOpen={isEditProfileOpen} onClose={closeEditProfileModal} />

      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="user-info">
          <h3>User Information</h3>
          <p>Name: {`${user.firstName} ${user.lastName}` || 'Guest'}</p>
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
                    id={card.cardNumber}
                    name="card"
                    value={card.cardNumber}
                    onChange={() => setSelectedCard(card.cardNumber)}
                  />
                  <label htmlFor={card.cardNumber}>
                    {`${card.cardType} ending in ${card.cardNumber.slice(-4)} - Exp: ${card.expirationDate}`}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved cards. Please add a card in your profile settings.</p>
          )}
        </div>

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
          <button onClick={handleCancelChanges} className="cancel-changes-button">
            Cancel
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
          {!ticketCountsChanged && canProceedToPayment && (
            <button className="payment-button" onClick={handlePayment}>
              Proceed to Payment
            </button>
          )}
          <button className="cancel-button" onClick={handleCancelBooking}>
            Cancel Booking
          </button>
        </div>
      </div>

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
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
