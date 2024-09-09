import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    cardType: '',
    cardNumber: '',
    expirationDate: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    subscribeToPromotions: false
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    axios.post('/api/register', formData)
      .then(response => {
        setGeneratedCode(response.data.verificationCode); // Set the generated code from backend
        setIsRegistered(true); // Move to verification step
      })
      .catch(error => {
        if (error.response && error.response.status === 400 && error.response.data === "Email already in use.") {
          setUserExists(true);
          setIsDisabled(true); // Disable the register button
        } else {
          console.error('Registration error:', error);
        }
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    
    if (verificationCode === generatedCode) {
      axios.post('/api/verify', { email: formData.email, verificationCode })
        .then(response => {
          // On successful verification, navigate to home page
          navigate('/');
          localStorage.setItem('user', formData.name); // Store user's name in localStorage
        })
        .catch(error => {
          console.error('Verification error:', error);
        });
    } else {
      // Display an error if the verification code is incorrect
      setVerificationError('Incorrect verification code');
    }
  };

  return (
    <div className="register-container">
      {!isRegistered ? (
        <form onSubmit={handleRegister} className="register-form">
          <h2>Register</h2>

          {/* Personal Information */}
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

          {/* Home Address */}
          <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} required />

          {/* Optional Payment Information */}
          <h3>Payment Information (Optional)</h3>
          <input type="text" name="cardType" placeholder="Card Type (e.g. Visa)" value={formData.cardType} onChange={handleChange} />
          <input type="text" name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleChange} />
          <input type="text" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} />

          {/* Optional Billing Address */}
          <h3>Billing Address (Optional)</h3>
          <input type="text" name="billingStreet" placeholder="Billing Street Address" value={formData.billingStreet} onChange={handleChange} />
          <input type="text" name="billingCity" placeholder="Billing City" value={formData.billingCity} onChange={handleChange} />
          <input type="text" name="billingState" placeholder="Billing State" value={formData.billingState} onChange={handleChange} />
          <input type="text" name="billingZip" placeholder="Billing Zip Code" value={formData.billingZip} onChange={handleChange} />

          {/* Promotions Subscription */}
          <label className="subscribe-label">
            <input type="checkbox" name="subscribeToPromotions" checked={formData.subscribeToPromotions} onChange={handleChange} />
            Subscribe to promotions
          </label>

          {userExists && (
            <div className="error-message">
              User with this email already exists.
            </div>
          )}

          <button type="submit" className="register-button" disabled={isDisabled}>Register</button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="verify-form">
          <h2>Enter Verification Code</h2>
          <input 
            type="text" 
            placeholder="Verification Code" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            required 
          />
          {verificationError && (
            <div className="error-message">{verificationError}</div>
          )}
          <button type="submit" className="verify-button">Verify</button>
        </form>
      )}
    </div>
  );
};

export default Register;
