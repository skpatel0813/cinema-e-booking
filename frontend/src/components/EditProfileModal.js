import React, { useState, useEffect } from 'react';
import '../styles/EditProfileModal.css';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    subscribeToPromotions: false,
    cardType1: '',
    cardNumber1: '',
    expirationDate1: '',
    cvv1: '',
    cardType2: '',
    cardNumber2: '',
    expirationDate2: '',
    cvv2: '',
    cardType3: '',
    cardNumber3: '',
    expirationDate3: '',
    cvv3: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const email = localStorage.getItem('userEmail');
      if (email) {
        axios.get(`http://localhost:8081/api/user/profile?email=${email}`)
          .then(response => {
            setProfileData(response.data);
          })
          .catch(error => console.error('Error fetching profile:', error));
      } else {
        console.error('User email not found');
      }
    }
  }, [isOpen]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios.put(`http://localhost:8081/api/user/profile/${email}`, profileData)
        .then(response => {
          alert('Profile updated successfully');
        })
        .catch(error => {
          console.error('Error updating profile:', error);
          setError('Failed to update profile.');
        });
    } else {
      console.error('Email not found for profile update');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios.put(`http://localhost:8081/api/user/change-password/${email}`, passwordData)
        .then(() => alert('Password updated successfully'))
        .catch(error => {
          console.error('Error updating password:', error);
          setError('Failed to update password.');
        });
    } else {
      console.error('Email not found for password update');
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (email) {
      const { cardNumber1, expirationDate1, cvv1, cardNumber2, expirationDate2, cvv2, cardNumber3, expirationDate3, cvv3 } = profileData;

      // Basic validation for card details
      if (cardNumber1 && (cardNumber1.length < 16 || cvv1.length < 3)) {
        setError('Invalid Card 1 information.');
        return;
      }
      if (cardNumber2 && (cardNumber2.length < 16 || cvv2.length < 3)) {
        setError('Invalid Card 2 information.');
        return;
      }
      if (cardNumber3 && (cardNumber3.length < 16 || cvv3.length < 3)) {
        setError('Invalid Card 3 information.');
        return;
      }

      // If no errors, clear the error state and proceed
      setError('');
      
      const cardData = {
        cardType1: profileData.cardType1,
        cardNumber1: profileData.cardNumber1,
        expirationDate1: profileData.expirationDate1,
        cvv1: profileData.cvv1,
        cardType2: profileData.cardType2,
        cardNumber2: profileData.cardNumber2,
        expirationDate2: profileData.expirationDate2,
        cvv2: profileData.cvv2,
        cardType3: profileData.cardType3,
        cardNumber3: profileData.cardNumber3,
        expirationDate3: profileData.expirationDate3,
        cvv3: profileData.cvv3
      };
      
      axios.put(`http://localhost:8081/api/user/cards/${email}`, cardData)
        .then(response => {
          alert('Cards updated successfully');
        })
        .catch(error => {
          console.error('Error updating cards:', error);
          setError('Failed to update cards.');
        });
    } else {
      console.error('Email not found for card update');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={profileData.name} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Phone" 
            value={profileData.phone} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="street" 
            placeholder="Street" 
            value={profileData.street} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="city" 
            placeholder="City" 
            value={profileData.city} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="state" 
            placeholder="State" 
            value={profileData.state} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="zip" 
            placeholder="Zip" 
            value={profileData.zip} 
            onChange={handleProfileChange} 
            required 
          />
          <input 
            type="text" 
            name="billingStreet" 
            placeholder="Billing Street" 
            value={profileData.billingStreet} 
            onChange={handleProfileChange} 
          />
          <input 
            type="text" 
            name="billingCity" 
            placeholder="Billing City" 
            value={profileData.billingCity} 
            onChange={handleProfileChange} 
          />
          <input 
            type="text" 
            name="billingState" 
            placeholder="Billing State" 
            value={profileData.billingState} 
            onChange={handleProfileChange} 
          />
          <input 
            type="text" 
            name="billingZip" 
            placeholder="Billing Zip" 
            value={profileData.billingZip} 
            onChange={handleProfileChange} 
          />
          <label>
            <input 
              type="checkbox" 
              name="subscribeToPromotions" 
              checked={profileData.subscribeToPromotions} 
              onChange={e => setProfileData({ ...profileData, subscribeToPromotions: e.target.checked })} 
            />
            Subscribe to promotions
          </label>
          <button type="submit">Update Profile</button>
        </form>

        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input 
            type="password" 
            name="oldPassword" 
            placeholder="Old Password" 
            value={passwordData.oldPassword} 
            onChange={handlePasswordChange} 
            required 
          />
          <input 
            type="password" 
            name="newPassword" 
            placeholder="New Password" 
            value={passwordData.newPassword} 
            onChange={handlePasswordChange} 
            required 
          />
          <button type="submit">Change Password</button>
        </form>

        <h2>Payment Cards</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleCardSubmit}>
          <div className="form-section">
            <h3>Card 1</h3>
            <input 
              type="text" 
              name="cardType1" 
              placeholder="Card Type" 
              value={profileData.cardType1} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cardNumber1" 
              placeholder="Card Number" 
              value={profileData.cardNumber1} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="expirationDate1" 
              placeholder="Expiration Date (MM/YY)" 
              value={profileData.expirationDate1} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cvv1" 
              placeholder="CVV" 
              value={profileData.cvv1} 
              onChange={handleProfileChange} 
            />
          </div>
          <div className="form-section">
            <h3>Card 2</h3>
            <input 
              type="text" 
              name="cardType2" 
              placeholder="Card Type" 
              value={profileData.cardType2} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cardNumber2" 
              placeholder="Card Number" 
              value={profileData.cardNumber2} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="expirationDate2" 
              placeholder="Expiration Date (MM/YY)" 
              value={profileData.expirationDate2} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cvv2" 
              placeholder="CVV" 
              value={profileData.cvv2} 
              onChange={handleProfileChange} 
            />
          </div>
          <div className="form-section">
            <h3>Card 3</h3>
            <input 
              type="text" 
              name="cardType3" 
              placeholder="Card Type" 
              value={profileData.cardType3} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cardNumber3" 
              placeholder="Card Number" 
              value={profileData.cardNumber3} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="expirationDate3" 
              placeholder="Expiration Date (MM/YY)" 
              value={profileData.expirationDate3} 
              onChange={handleProfileChange} 
            />
            <input 
              type="text" 
              name="cvv3" 
              placeholder="CVV" 
              value={profileData.cvv3} 
              onChange={handleProfileChange} 
            />
          </div>
          <button type="submit">Update Cards</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
