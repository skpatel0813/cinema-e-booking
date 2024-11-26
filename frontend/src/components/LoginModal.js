import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css';

// The LoginModal component handles user authentication (login) and password reset workflows
const LoginModal = ({ isOpen, onClose }) => {
  // State variables for managing login form data and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State variables for forgot password functionality
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // State variables for reset code and new password inputs
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Hook for navigation
  const navigate = useNavigate();

  // Effect to prefill email if "remember me" data exists in local storage
  useEffect(() => {
    const rememberMeData = JSON.parse(localStorage.getItem('rememberMeData'));
    if (rememberMeData) {
      setEmail(rememberMeData.email || '');
    }
  }, []);

  // Function to check if a password is strong
  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Handler for login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/login', { email, password })
      .then(response => {
        const { role, isSuspended } = response.data;
        const firstName = response.data["first name"]; // Accessing "first name" from backend

        if (isSuspended === "true") {
          setError('Account has been suspended. Please contact an Administrator.');
        } else {
          // Save authentication data to local storage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('user', firstName); // Save the first name
          localStorage.setItem('rememberMeData', JSON.stringify({ email })); // Save email for future login

          onClose(); // Close the modal
          if (role === 'admin') {
            navigate('/'); // Navigate to admin home page
          } else {
            navigate('/account'); // Navigate to user account page
          }

          window.location.reload(); // Reload the page to apply changes
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setError('Invalid email or password. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Navigate to the registration page
  const handleRegisterNavigation = () => {
    onClose(); // Close the modal
    navigate('/register'); // Redirect to registration page
  };

  // Handler for initiating the password reset process
  const handleForgotPassword = () => {
    setError('');
    setForgotPasswordSuccess('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/request-password-reset', { email: forgotPasswordEmail })
      .then(response => {
        setForgotPasswordSuccess('Password reset code has been sent to your email.');
        setShowCodeVerification(true); // Show the code verification input
      })
      .catch(error => {
        console.error('Error sending reset password email:', error);
        setError('Failed to send password reset email. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handler for verifying the reset code
  const handleVerifyCode = () => {
    setError('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/verify-reset-code', { email: forgotPasswordEmail, code: resetCode })
      .then(response => {
        setForgotPasswordSuccess('Code verified. You can now reset your password.');
        setIsCodeVerified(true); // Allow the user to reset their password
      })
      .catch(error => {
        console.error('Error verifying code:', error);
        setError('Invalid or expired code. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handler for resetting the password
  const handleResetPassword = () => {
    setError('');
    setPasswordError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsLoading(false);
      return;
    }

    axios.post('http://localhost:8081/user/reset-password', { email: forgotPasswordEmail, newPassword, confirmPassword })
      .then(response => {
        setForgotPasswordSuccess('Password has been reset successfully. You can now log in.');
        setShowForgotPasswordModal(false); // Close the forgot password modal
      })
      .catch(error => {
        console.error('Error resetting password:', error);
        setError('Failed to reset password. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          {error && (
            <div className="error-popup">
              <p>{error}</p>
            </div>
          )}
          {isLoading && <p className="loading-message">Loading...</p>}
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
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Reset Password
            </button>
          </div>
          <div className="register-link">
            <span>New User? </span>
            <button
              type="button"
              className="link-button"
              onClick={handleRegisterNavigation}
            >
              Register here
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="forgot-password-modal modal-content-overlay">
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

                {passwordError && <p className="error-message">{passwordError}</p>}

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
