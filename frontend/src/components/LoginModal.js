import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css'; // Ensure you have the CSS for styling

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to track login errors
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // State to track Forgot Password modal visibility
  const [showCodeVerification, setShowCodeVerification] = useState(false); // State to show/hide code verification fields
  const [isCodeVerified, setIsCodeVerified] = useState(false); // State to show/hide new password fields after verification
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate to other routes

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Reset the error message
    setIsLoading(true); // Start loading

    axios.post('/user/login', { email, password })
      .then(response => {
        const { userName, role } = response.data;

        // Store the user's name and role in localStorage
        localStorage.setItem('user', userName);
        localStorage.setItem('role', role);

        // Close the modal on successful login and navigate to homepage
        onClose();
        navigate('/');

        // Optionally reload the page to update the UI
        window.location.reload();
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError('Invalid email or password. Please try again.');
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  // Function to navigate to the Register page
  const handleRegisterNavigation = () => {
    onClose(); // Close the modal
    navigate('/register'); // Navigate to the Register page
  };

  // Function to handle Forgot Password request
  const handleForgotPassword = () => {
    setError('');
    setForgotPasswordSuccess('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/request-password-reset', { email: forgotPasswordEmail })
      .then(response => {
        setForgotPasswordSuccess('Password reset code has been sent to your email.');
        setShowCodeVerification(true); // Show code verification fields
      })
      .catch(error => {
        console.error('Error sending reset password email:', error);
        setError('Failed to send password reset email. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to verify the reset code
  const handleVerifyCode = () => {
    setError('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/verify-reset-code', { email: forgotPasswordEmail, code: resetCode })
      .then(response => {
        setForgotPasswordSuccess('Code verified. You can now reset your password.');
        setIsCodeVerified(true); // Show password reset fields
      })
      .catch(error => {
        console.error('Error verifying code:', error);
        setError('Invalid or expired code. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to handle password reset
  const handleResetPassword = () => {
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    axios.post('http://localhost:8081/user/reset-password', { email: forgotPasswordEmail, newPassword, confirmPassword })
      .then(response => {
        setForgotPasswordSuccess('Password has been reset successfully. You can now log in.');
        setShowForgotPasswordModal(false);
      })
      .catch(error => {
        console.error('Error resetting password:', error);
        setError('Failed to reset password. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
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
          {isLoading && <p className="loading-message">Loading...</p>} {/* Display loading indicator */}
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
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="forgot-password-link">
            <span>Forgot your password? </span>
            <button
              type="button"
              className="link-button"
              onClick={() => setShowForgotPasswordModal(true)} // Show Forgot Password modal
            >
              Reset Password
            </button>
          </div>
          <div className="register-link">
            <span>New User? </span>
            <button
              type="button"
              className="link-button"
              onClick={handleRegisterNavigation} // Updated button to navigate
            >
              Register here
            </button>
          </div>
        </form>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForgotPasswordModal(false)}>X</button>
            <h3>Forgot Password</h3>
            {forgotPasswordSuccess && <p className="success-message">{forgotPasswordSuccess}</p>}
            {!showCodeVerification && !isCodeVerified && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="reset-button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </>
            )}
            {showCodeVerification && !isCodeVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="verify-button"
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </>
            )}
            {isCodeVerified && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="reset-button"
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
