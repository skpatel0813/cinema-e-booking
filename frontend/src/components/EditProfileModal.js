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
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (isOpen) {
      const email = localStorage.getItem('userEmail'); // Retrieve user email from localStorage
      if (email) {
        // Fetch the user's current profile data when modal is open
        axios.get(`http://localhost:8081/api/profile?email=${email}`)
          .then(response => {
            const data = response.data;
            setProfileData({
              name: data.name || '',
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
            });
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
    const email = localStorage.getItem('userEmail'); // Retrieve the email for PUT request
    if (email) {
      axios.put(`http://localhost:8081/api/user/profile/${email}`, profileData)
        .then(response => {
          alert('Profile updated successfully');
        })
        .catch(error => {
          console.error('Error updating profile:', error);
        });
    } else {
      console.error('Email not found for profile update');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail'); // Email might be needed for password change
    if (email) {
      axios.put(`http://localhost:8081/api/user/change-password/${email}`, passwordData)
        .then(() => alert('Password updated successfully'))
        .catch(error => console.error('Error updating password:', error));
    } else {
      console.error('Email not found for password update');
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
      </div>
    </div>
  );
};

export default EditProfileModal;
