import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import '../styles/EditPricing.css';

const EditPricing = () => {
  const [ticketPrices, setTicketPrices] = useState({
    adult: '0',
    children: '0',
    senior: '0',
    fee: '0',
  });
  const [promotions, setPromotions] = useState([]);
  const [promotionCode, setPromotionCode] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [emailSubscribers, setEmailSubscribers] = useState([]);
  const [promotionMessage, setPromotionMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({});

  useEffect(() => {
    fetchPricingData();
    fetchPromotions();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/pricing/getPrices');
      setTicketPrices({
        adult: response.data.adultPrice,
        children: response.data.childrenPrice,
        senior: response.data.seniorPrice,
        fee: response.data.fee,
      });
    } catch (error) {
      console.error('Error fetching pricing data', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/promotions/getPromotions');
      setPromotions(response.data.map((promotion) => ({
        code: promotion.promotionCode,
        description: promotion.description,
        discountAmount: promotion.discountAmount
      })));
    } catch (error) {
      console.error('Error fetching promotions:', error);
      alert("Failed to load promotions. Please try again later.");
    }
  };

  const handleSavePricing = async () => {
    if (ticketPrices.adult === '' || ticketPrices.children === '' || ticketPrices.senior === '' || ticketPrices.fee === '') {
      alert("All pricing fields must be filled out.");
      return;
    }
    try {
      await axios.post('http://localhost:8081/api/pricing/updatePrices', {
        adultPrice: ticketPrices.adult,
        childrenPrice: ticketPrices.children,
        seniorPrice: ticketPrices.senior,
        fee: ticketPrices.fee
      });
      setSuccessMessage('Pricing updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving pricing', error);
    }
  };

  const handleAddPromotion = async () => {
    try {
      const newPromotion = {
        code: promotionCode,
        description: promotionDescription,
        discountAmount: discountAmount,
      };

      console.log("Sending promotion data:", newPromotion);

      await axios.post('http://localhost:8081/api/promotions/addPromotions', newPromotion);
      
      setPromotions([...promotions, newPromotion]);
      setPromotionCode('');
      setPromotionDescription('');
      setDiscountAmount('');
      setSuccessMessage('Promotion added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const handleEditPromotion = (index) => {
    const promotion = promotions[index];
    setCurrentPromotion({ ...promotion, index });
    setIsEditModalOpen(true);
  };

  const handleSendPromotion = async (promotion) => {
    try {
      await axios.post('http://localhost:8081/api/promotions/send', {
        message: `${promotion.description} - Use Code: ${promotion.code} for a ${promotion.discountAmount}% discount!`,
        subscribers: emailSubscribers
      });
      setSuccessMessage('Promotion sent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending promotions', error);
    }
  };

  const handleSaveEditedPromotion = async () => {
    try {
      const updatedPromotion = {
        code: currentPromotion.code,
        description: currentPromotion.description,
        discountAmount: currentPromotion.discountAmount // Ensure we use discountAmount here
      };

      console.log("Updated promotion data:", updatedPromotion);

      await axios.put('http://localhost:8081/api/promotions/updatePromotion', updatedPromotion);
      
      const updatedPromotions = [...promotions];
      updatedPromotions[currentPromotion.index] = updatedPromotion;
      setPromotions(updatedPromotions);
      setIsEditModalOpen(false);
      setSuccessMessage('Promotion updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const handleDeletePromotion = async (code, index) => {
    if (!window.confirm(`Are you sure you want to delete the promotion with code "${code}"?`)) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8081/api/promotions/delete/${code}`);
      
      // Update frontend promotions list
      const updatedPromotions = [...promotions];
      updatedPromotions.splice(index, 1);
      setPromotions(updatedPromotions);
  
      setSuccessMessage('Promotion deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Failed to delete promotion. Please try again.');
    }
  };
  

  return (
    <div>
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="Admin" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
      />

      <div className="edit-pricing-container">
        <h2>Edit Pricing and Promotions</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <div className="form-section">
          <h3>Update Ticket Prices</h3>
          <label>
            Adult Price ($):
            <input
              type="number"
              value={ticketPrices.adult}
              onChange={(e) => setTicketPrices({ ...ticketPrices, adult: e.target.value })}
            />
          </label>
          <label>
            Children Price ($):
            <input
              type="number"
              value={ticketPrices.children}
              onChange={(e) => setTicketPrices({ ...ticketPrices, children: e.target.value })}
            />
          </label>
          <label>
            Senior Price ($):
            <input
              type="number"
              value={ticketPrices.senior}
              onChange={(e) => setTicketPrices({ ...ticketPrices, senior: e.target.value })}
            />
          </label>
          <label>
            Online Booking Fee($):
            <input
              type="number"
              value={ticketPrices.fee}
              onChange={(e) => setTicketPrices({ ...ticketPrices, fee: e.target.value })}
            />
          </label>
          <button className="save-button" onClick={handleSavePricing}>
            Save Pricing
          </button>
        </div>

        <div className="form-section">
          <h3>Add New Promotion</h3>
          <label>
            Promotion Code:
            <input
              type="text"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
            />
          </label>
          <label>
            Promotion Description:
            <textarea
              value={promotionDescription}
              onChange={(e) => setPromotionDescription(e.target.value)}
            />
          </label>
          <label>
            Discount Amount (%):
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
          </label>
          <button className="add-button" onClick={handleAddPromotion}>
            Add Promotion
          </button>
        </div>

        <div className="form-section">
          <h3>Manage Promotions</h3>
          <table className="promotion-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion, index) => (
                <tr key={index}>
                  <td>{promotion.code}</td>
                  <td>{promotion.description}</td>
                  <td>{promotion.discountAmount}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditPromotion(index)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePromotion(promotion.code, index)}>
                       Delete
                    </button>
                    <button className="send-button" onClick={() => handleSendPromotion(promotion)}>
                      Send to Customers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
              <h3>Edit Promotion</h3>
              <label>
                Promotion Code:
                <input
                  type="text"
                  value={currentPromotion.code}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, code: e.target.value })}
                />
              </label>
              <label>
                Promotion Description:
                <textarea
                  value={currentPromotion.description}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                />
              </label>
              <label>
                Discount Amount (%):
                <input
                  type="number"
                  value={currentPromotion.discountAmount || ''}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, discountAmount: e.target.value })}
                />
              </label>
              <button className="save-button" onClick={handleSaveEditedPromotion}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPricing;
