import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, userName, onLogout, onEditProfileClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    if (onLogout) {
      onLogout();
    }

    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleAddMovieClick = () => {
    navigate('/add-movie');
  };

  const handleEditUsersClick = () => {
    navigate('/edit-users'); // Navigate to the Edit Users page
  };

  const handleEditPricingClick = () => {
    navigate('/edit-pricing'); // Navigate to the Edit Pricing page
  };

  const handleGetTicketsClick = () => {
    if (!userName) {
      setLoginPromptVisible(true); // Show login prompt if not logged in
    } else {
      // Logic for navigating to the ticket booking page
      navigate('/showtimes');
    }
  };

  const closeLoginPrompt = () => {
    setLoginPromptVisible(false);
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
        
        {/* Render Admin Specific Buttons */}
        {role === 'admin' && (
          <>
            <li className="nav-item left">
              <button className="add-movie-btn" onClick={handleAddMovieClick}>
                Add Movie
              </button>
            </li>
            <li className="nav-item left">
              <button className="edit-users-btn" onClick={handleEditUsersClick}>
                Edit Users
              </button>
            </li>
            <li className="nav-item left">
              <button className="edit-pricing-btn" onClick={handleEditPricingClick}>
                Pricing / Promotions
              </button>
            </li>
          </>
        )}
        
        {(
          <li className="nav-item right">
            <button className="get-tickets-btn" onClick={handleGetTicketsClick}>
              Get Tickets
            </button>
          </li>
        )}
        
        {/* User Login/Logout Section */}
        <li className="nav-item right">
          {userName ? (
            <div className="user-section">
              <span onClick={toggleDropdown} className="user-name">Welcome, {userName}</span>
              {dropdownOpen && (
                <div className="dropdown">
                  <button className="dropdown-btn" onClick={onEditProfileClick}>Edit Profile</button>
                  <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>Login</button>
          )}
        </li>
      </ul>

      {/* Login Prompt Modal */}
      {loginPromptVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginPrompt}>&times;</span>
            <p>You need to sign in to get tickets</p>
            <button className="login-button" onClick={onLoginClick}>Sign In</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
