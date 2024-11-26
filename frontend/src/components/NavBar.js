import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/NavBar.css';

// NavBar component to display navigation links, admin controls, and user-specific options
const NavBar = ({ onLoginClick, onLogout, onEditProfileClick }) => {
  // State variables
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manages the visibility of the dropdown menu
  const [loginPromptVisible, setLoginPromptVisible] = useState(false); // Manages the visibility of the login prompt modal
  const [role, setRole] = useState(null); // Stores the role of the logged-in user (e.g., admin or user)
  const [userName, setUserName] = useState(''); // Stores the user's first name

  // Reference for detecting clicks outside the dropdown menu
  const dropdownRef = useRef(null);

  // Hook for navigation
  const navigate = useNavigate();

  // Effect to fetch user role and profile details on component mount
  useEffect(() => {
    // Retrieve the user's role from localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }

    // Retrieve and parse the user's email from rememberMeData in localStorage
    const rememberMeData = localStorage.getItem('rememberMeData');
    if (rememberMeData) {
      try {
        const parsedData = JSON.parse(rememberMeData);
        const email = parsedData.email;
        if (email) {
          fetchUserProfile(email); // Fetch user's profile data
        }
      } catch (error) {
        console.error('Error parsing rememberMeData:', error);
      }
    }

    // Close dropdown if user clicks outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to fetch user profile using email
  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8081/user/profile?email=${email}`);
      const firstName = response.data['first name']; // Access 'first name' from the backend response
      localStorage.setItem('user', firstName); // Save the first name to localStorage
      setUserName(firstName); // Update the userName state
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout handler
  const handleLogout = () => {
    // Clear all data from localStorage
    localStorage.clear();
    localStorage.setItem('loggedOut', 'true'); // Set a flag for logout

    // Reset states
    setUserName('');
    setRole(null);

    // Trigger the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }

    // Navigate to the home page
    navigate('/');

    // Reload the page to reflect logout changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Handlers for admin actions
  const handleAddMovieClick = () => {
    navigate('/add-movie');
  };

  const handleEditUsersClick = () => {
    navigate('/edit-users');
  };

  const handleEditPricingClick = () => {
    navigate('/edit-pricing');
  };

  // Handle clicking on "Get Tickets"
  const handleGetTicketsClick = () => {
    if (!userName) {
      setLoginPromptVisible(true); // Show login prompt if user is not logged in
    } else {
      navigate('/showtimes'); // Navigate to the showtimes page
    }
  };

  // Close the login prompt modal
  const closeLoginPrompt = () => {
    setLoginPromptVisible(false);
  };

  // Navigate to order history page
  const handleOrderHistoryClick = () => {
    navigate('/order-history');
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left">
          <Link to="/">Home</Link>
        </li>

        {/* Render admin-specific buttons */}
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

        {/* User login/logout section */}
        <li className="nav-item right">
          {userName ? (
            <div className="user-section" ref={dropdownRef}>
              <span onClick={toggleDropdown} className="user-name">
                Welcome, {userName}
              </span>
              {dropdownOpen && (
                <div className="dropdown">
                  <button className="dropdown-btn" onClick={onEditProfileClick}>
                    Edit Profile
                  </button>
                  {/* Show Order History button for non-admin users */}
                  {role !== 'admin' && (
                    <button className="dropdown-btn" onClick={handleOrderHistoryClick}>
                      Order History
                    </button>
                  )}
                  <button className="dropdown-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Login
            </button>
          )}
        </li>
      </ul>

      {/* Login Prompt Modal */}
      {loginPromptVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeLoginPrompt}>
              &times;
            </span>
            <p>You need to sign in to get tickets</p>
            <button className="login-button" onClick={onLoginClick}>
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
