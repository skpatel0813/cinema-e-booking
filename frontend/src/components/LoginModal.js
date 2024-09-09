// src/components/LoginModal.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css'; // Assume a CSS file for styling

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate to other routes

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('/api/login', { email, password })
      .then(response => {
        console.log('Logged in successfully:', response.data);
        onClose(); // Close the modal on successful login
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">Sign In</button>
          <div className="register-link">
            <span>New User? </span>
            <button type="button" className="link-button" onClick={() => navigate('/register')}>
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
