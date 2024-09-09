import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css'; // Assume a CSS file for styling

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to track login errors
  const navigate = useNavigate(); // Hook to navigate to other routes

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Reset the error message

    axios.post('/api/login', { email, password })
      .then(response => {
        console.log('Logged in successfully:', response.data);

        // Store the user's name in localStorage
        localStorage.setItem('user', response.data.name);

        // Redirect to the homepage
        onClose(); // Close the modal on successful login
        navigate('/'); // Redirect to homepage

        // Optionally reload the page to update the UI
        window.location.reload();
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError('Invalid email or password. Please try again.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          {error && <p className="error-message">{error}</p>} {/* Display login errors */}
          <input
            type="text"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
