import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(''); // New state for password error
  const navigate = useNavigate();

  useEffect(() => {
    const rememberMeData = JSON.parse(localStorage.getItem('rememberMeData'));
    if (rememberMeData) {
      setEmail(rememberMeData.email || '');
      setPassword(rememberMeData.password || '');
      setRememberMe(true);
    }
  }, []);

  // Function to check if the password is strong
  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/login', { email, password })
      .then(response => {
        const { firstName, role, isSuspended } = response.data;

        if (isSuspended === "true") {
          setError('Account has been suspended. Please contact an Administrator.');
        } else {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('user', firstName);

          if (rememberMe) {
            localStorage.setItem('rememberMeData', JSON.stringify({ email, password }));
          } else {
            localStorage.removeItem('rememberMeData');
          }

          onClose();
          if (role === 'admin') {
            navigate('/');
          } else {
            navigate('/account');
          }

          window.location.reload();
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

  const handleRegisterNavigation = () => {
    onClose();
    navigate('/register');
  };

  const handleForgotPassword = () => {
    setError('');
    setForgotPasswordSuccess('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/request-password-reset', { email: forgotPasswordEmail })
      .then(response => {
        setForgotPasswordSuccess('Password reset code has been sent to your email.');
        setShowCodeVerification(true);
      })
      .catch(error => {
        console.error('Error sending reset password email:', error);
        setError('Failed to send password reset email. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerifyCode = () => {
    setError('');
    setIsLoading(true);

    axios.post('http://localhost:8081/user/verify-reset-code', { email: forgotPasswordEmail, code: resetCode })
      .then(response => {
        setForgotPasswordSuccess('Code verified. You can now reset your password.');
        setIsCodeVerified(true);
      })
      .catch(error => {
        console.error('Error verifying code:', error);
        setError('Invalid or expired code. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetPassword = () => {
    setError('');
    setPasswordError(''); // Reset password error
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

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>
          {error && <p className="error-message">{error}</p>}
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
          <div className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label>Remember Me</label>
          </div>
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

                {/* Display password strength error */}
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
