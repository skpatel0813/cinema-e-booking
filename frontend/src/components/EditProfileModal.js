import React, { useState, useEffect } from 'react';
import '../styles/EditProfileModal.css';
import axios from 'axios';

// Component to handle editing user profile data, including personal details, billing address, password, and payment methods
const EditProfileModal = ({ isOpen, onClose }) => {
  // State for storing user email
  const [email, setEmail] = useState('');

  // State for managing user profile details
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
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

  // State for handling password update form inputs
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  // State to handle errors for general form updates
  const [error, setError] = useState('');

  // State to handle password-specific validation errors
  const [passwordError, setPasswordError] = useState('');

  // Effect to retrieve "remember me" email from local storage
  useEffect(() => {
    const rememberMeData = localStorage.getItem('rememberMeData');
    if (rememberMeData) {
      try {
        const parsedData = JSON.parse(rememberMeData);
        setEmail(parsedData.email || '');
      } catch (error) {
        console.error('Error parsing rememberMeData:', error);
      }
    }
  }, []);

  // Effect to fetch profile details when modal opens
  useEffect(() => {
    if (isOpen && email) {
      console.log('Fetching profile data...');
      axios.get(`http://localhost:8081/user/profile?email=${email}`)
        .then(response => {
          console.log('Profile data received:', response.data);
          const data = response.data;

          // Update the state with the fetched profile data
          setProfileData({
            firstName: data['first name'] || '',
            lastName: data['last name'] || '',
            phone: data.phone || '',
            street: data.street || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            billingStreet: data.billingStreet || '',
            billingCity: data.billingCity || '',
            billingState: data.billingState || '',
            billingZip: data.billingZip || '',
            subscribeToPromotions: data.subscribeToPromotions || false,
            cardType1: data.cardType1 || '',
            cardNumber1: data.cardNumber1 || '',
            expirationDate1: data.expirationDate1 || '',
            cvv1: data.cvv1 || '',
            cardType2: data.cardType2 || '',
            cardNumber2: data.cardNumber2 || '',
            expirationDate2: data.expirationDate2 || '',
            cvv2: data.cvv2 || '',
            cardType3: data.cardType3 || '',
            cardNumber3: data.cardNumber3 || '',
            expirationDate3: data.expirationDate3 || '',
            cvv3: data.cvv3 || ''
          });
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setError('Failed to fetch profile data.');
        });
    }
  }, [isOpen, email]);

  // Function to handle changes in profile inputs
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Function to handle changes in password inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Function to validate the strength of a password
  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handler for submitting the profile update form
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Update general profile data
      axios.put(`http://localhost:8081/user/profile/${email}`, profileData)
        .then(() => alert('Profile updated successfully'))
        .catch(error => {
          console.error('Error updating profile:', error);
          setError('Failed to update profile.');
        });

      // Update billing address separately
      axios.put(`http://localhost:8081/user/profile/${email}/billing-address`, {
        billingStreet: profileData.billingStreet,
        billingCity: profileData.billingCity,
        billingState: profileData.billingState,
        billingZip: profileData.billingZip
      })
      .then(() => alert('Billing address updated successfully'))
      .catch(error => {
        console.error('Error updating billing address:', error);
        setError('Failed to update billing address.');
      });
    } else {
      console.error('Email not found for profile update');
    }
  };

  // Handler for submitting the password change form
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!isStrongPassword(passwordData.newPassword)) {
      setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
    if (email) {
      axios.put(`http://localhost:8081/user/change-password/${email}`, passwordData)
        .then(() => {
          alert('Password updated successfully');
          setPasswordError('');
        })
        .catch(error => {
          console.error('Error updating password:', error);
          setError('Failed to update password.');
        });
    } else {
      console.error('Email not found for password update');
    }
  };

  // Handler for submitting the payment methods update form
  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const paymentMethods = [
        {
          cardType: profileData.cardType1,
          cardNumber: profileData.cardNumber1,
          expirationDate: profileData.expirationDate1,
          cvv: profileData.cvv1,
        },
        {
          cardType: profileData.cardType2,
          cardNumber: profileData.cardNumber2,
          expirationDate: profileData.expirationDate2,
          cvv: profileData.cvv2,
        },
        {
          cardType: profileData.cardType3,
          cardNumber: profileData.cardNumber3,
          expirationDate: profileData.expirationDate3,
          cvv: profileData.cvv3,
        },
      ];

      // Validate card details
      const invalidCard = paymentMethods.some(card => {
        return (card.cardNumber && card.cardNumber.length < 16) || (card.cvv && card.cvv.length < 3);
      });

      if (invalidCard) {
        setError('One or more cards have invalid information.');
        return;
      }

      setError('');
      axios.put(`http://localhost:8081/user/profile/${email}/payment-methods`, paymentMethods)
        .then(() => alert("Payment methods updated successfully"))
        .catch((error) => {
          console.error("Error updating payment methods:", error);
          setError("Failed to update payment methods.");
        });
    } else {
      console.error('Email not found for card update');
    }
  };

  // Render nothing if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <input type="text" name="firstName" placeholder="First Name" value={profileData.firstName} onChange={handleProfileChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={profileData.lastName} onChange={handleProfileChange} required />
          <input type="text" name="phone" placeholder="Phone" value={profileData.phone} onChange={handleProfileChange} required />
          <input type="text" name="street" placeholder="Street" value={profileData.street} onChange={handleProfileChange} required />
          <input type="text" name="city" placeholder="City" value={profileData.city} onChange={handleProfileChange} required />
          <input type="text" name="state" placeholder="State" value={profileData.state} onChange={handleProfileChange} required />
          <input type="text" name="zip" placeholder="Zip" value={profileData.zip} onChange={handleProfileChange} required />
          <input type="text" name="billingStreet" placeholder="Billing Street" value={profileData.billingStreet} onChange={handleProfileChange} />
          <input type="text" name="billingCity" placeholder="Billing City" value={profileData.billingCity} onChange={handleProfileChange} />
          <input type="text" name="billingState" placeholder="Billing State" value={profileData.billingState} onChange={handleProfileChange} />
          <input type="text" name="billingZip" placeholder="Billing Zip" value={profileData.billingZip} onChange={handleProfileChange} />
          <label>
            <input type="checkbox" name="subscribeToPromotions" checked={profileData.subscribeToPromotions} onChange={e => setProfileData({ ...profileData, subscribeToPromotions: e.target.checked })} />
            Subscribe to promotions
          </label>
          <button type="submit">Update Profile</button>
        </form>

        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input type="password" name="oldPassword" placeholder="Old Password" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
          <input type="password" name="newPassword" placeholder="New Password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <button type="submit">Change Password</button>
        </form>

        <h2>Payment Cards</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleCardSubmit}>
          <div className="form-section">
            <h3>Card 1</h3>
            <input type="text" name="cardType1" placeholder="Card Type" value={profileData.cardType1} onChange={handleProfileChange} />
            <input type="text" name="cardNumber1" placeholder="Card Number" value={profileData.cardNumber1} onChange={handleProfileChange} />
            <input type="text" name="expirationDate1" placeholder="Expiration Date (MM/YY)" value={profileData.expirationDate1} onChange={handleProfileChange} />
            <input type="text" name="cvv1" placeholder="CVV" value={profileData.cvv1} onChange={handleProfileChange} />
          </div>
          <div className="form-section">
            <h3>Card 2</h3>
            <input type="text" name="cardType2" placeholder="Card Type" value={profileData.cardType2} onChange={handleProfileChange} />
            <input type="text" name="cardNumber2" placeholder="Card Number" value={profileData.cardNumber2} onChange={handleProfileChange} />
            <input type="text" name="expirationDate2" placeholder="Expiration Date (MM/YY)" value={profileData.expirationDate2} onChange={handleProfileChange} />
            <input type="text" name="cvv2" placeholder="CVV" value={profileData.cvv2} onChange={handleProfileChange} />
          </div>
          <div className="form-section">
            <h3>Card 3</h3>
            <input type="text" name="cardType3" placeholder="Card Type" value={profileData.cardType3} onChange={handleProfileChange} />
            <input type="text" name="cardNumber3" placeholder="Card Number" value={profileData.cardNumber3} onChange={handleProfileChange} />
            <input type="text" name="expirationDate3" placeholder="Expiration Date (MM/YY)" value={profileData.expirationDate3} onChange={handleProfileChange} />
            <input type="text" name="cvv3" placeholder="CVV" value={profileData.cvv3} onChange={handleProfileChange} />
          </div>
          <button type="submit">Update Cards</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
