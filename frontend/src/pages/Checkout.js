import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (movieId) {
      axios.get(`http://localhost:8081/api/movies/${movieId}`)
        .then(response => {
          setMovieTitle(response.data.title);
        })
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
  }, [ticketCounts]);

  const calculateTotalPrice = (pricing) => {
    const { adultPrice = 0, childrenPrice = 0, seniorPrice = 0 } = pricing;
    const ticketPrice = (ticketCounts.adult || 0) * adultPrice + 
                        (ticketCounts.child || 0) * childrenPrice + 
                        (ticketCounts.senior || 0) * seniorPrice;

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
          const discountAmount = totalPrice * (promo.discount / 100); // Percentage discount
          setPromotionDiscount(discountAmount);
          setFinalPrice((totalPrice - discountAmount) + fee + salesTax);
          setPromotionError(''); // Clear error message
        } else {
          setPromotionError('Invalid Promotion Code');
        }
      })
      .catch(error => {
        console.error('Error applying promotion:', error);
        setPromotionError('Error applying promotion code. Please try again.');
      });
  };

  const handlePayment = () => {
    if (!selectedCard) {
      alert('Please select a card for payment.');
      return;
    }

    const paymentDetails = {
      userId: user.id,
      cardId: selectedCard,
      totalAmount: finalPrice,
    };

    axios.post('http://localhost:8081/api/checkout/processPayment', paymentDetails)
      .then(response => {
        alert('Payment Successful!');
        const ticketNumber = response.data.ticketNumber; // Get ticket number from response
        navigate('/confirmation', { state: { booking: response.data.booking, selectedSeats, movieTitle, showtime, ticketCounts, ticketNumber } });
      })
      .catch(error => console.error('Error processing payment:', error));
  };

  return (
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
      </div>
      <div className="ticket-summary">
        <h3>Ticket Summary</h3>
        <p>Adult Tickets: {ticketCounts.adult || 0}</p>
        <p>Child Tickets: {ticketCounts.child || 0}</p>
        <p>Senior Tickets: {ticketCounts.senior || 0}</p>
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
      <button className="payment-button" onClick={handlePayment}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
