import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Ensure correct import of NavBar
import '../styles/EditUser.css';

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details by user ID
    axios.get(`http://localhost:8081/user/${userId}`)
      .then(response => {
        setUser(response.data);
        setFormData(response.data);
      })
      .catch(error => console.error('Error fetching user details:', error));
    
    // Fetch billing address details by user ID
    axios.get(`http://localhost:8081/user/${userId}/billing-address`)
      .then(response => {
        setBillingAddress(response.data);
      })
      .catch(error => console.error('Error fetching billing address:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  const handleUpdateUser = () => {
    axios.put(`http://localhost:8081/user/${userId}`, formData)
      .then(() => {
        navigate('/edit-users');
      })
      .catch(error => console.error('Error updating user:', error));

    // Update billing address
    axios.put(`http://localhost:8081/user/${userId}/billing-address`, billingAddress)
      .catch(error => console.error('Error updating billing address:', error));
  };

  return (
    <div>
      {/* Include NavBar at the top */}
      <NavBar 
        onLoginClick={() => console.log('Login')} 
        userName="Admin" 
        onLogout={() => console.log('Logout')} 
        onEditProfileClick={() => console.log('Edit Profile')}
      />

      <div className="edit-user-container">
        {user ? (
          <>
            <h1>Edit User: {user.name}</h1>
            <form className="edit-user-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Street:</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Zip:</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              {/* Billing Address Section */}
              <h2>Billing Address</h2>
              <div className="form-group">
                <label>Billing Street:</label>
                <input
                  type="text"
                  name="street"
                  value={billingAddress.street || ''}
                  onChange={handleBillingAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Billing City:</label>
                <input
                  type="text"
                  name="city"
                  value={billingAddress.city || ''}
                  onChange={handleBillingAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Billing State:</label>
                <input
                  type="text"
                  name="state"
                  value={billingAddress.state || ''}
                  onChange={handleBillingAddressChange}
                />
              </div>
              <div className="form-group">
                <label>Billing Zip:</label>
                <input
                  type="text"
                  name="zip"
                  value={billingAddress.zip || ''}
                  onChange={handleBillingAddressChange}
                />
              </div>

              <div className="form-group">
                <label>Card Type 1:</label>
                <input
                  type="text"
                  name="cardType1"
                  value={formData.cardType1 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Card Number 1:</label>
                <input
                  type="text"
                  name="cardNumber1"
                  value={formData.cardNumber1 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Expiration Date 1:</label>
                <input
                  type="text"
                  name="expirationDate1"
                  value={formData.expirationDate1 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>CVV 1:</label>
                <input
                  type="text"
                  name="cvv1"
                  value={formData.cvv1 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Card Type 2:</label>
                <input
                  type="text"
                  name="cardType2"
                  value={formData.cardType2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Card Number 2:</label>
                <input
                  type="text"
                  name="cardNumber2"
                  value={formData.cardNumber2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Expiration Date 2:</label>
                <input
                  type="text"
                  name="expirationDate2"
                  value={formData.expirationDate2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>CVV 2:</label>
                <input
                  type="text"
                  name="cvv2"
                  value={formData.cvv2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Card Type 3:</label>
                <input
                  type="text"
                  name="cardType3"
                  value={formData.cardType3 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Card Number 3:</label>
                <input
                  type="text"
                  name="cardNumber3"
                  value={formData.cardNumber3 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Expiration Date 3:</label>
                <input
                  type="text"
                  name="expirationDate3"
                  value={formData.expirationDate3 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>CVV 3:</label>
                <input
                  type="text"
                  name="cvv3"
                  value={formData.cvv3 || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Subscribe to Promotions:</label>
                <input
                  type="checkbox"
                  name="subscribeToPromotions"
                  checked={formData.subscribeToPromotions || false}
                  onChange={(e) => setFormData({ ...formData, subscribeToPromotions: e.target.checked })}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select name="role" value={formData.role || 'ROLE_USER'} onChange={handleInputChange}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <button type="button" onClick={handleUpdateUser}>Update User</button>
            </form>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default EditUser;
