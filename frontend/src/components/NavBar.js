import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, userName, onLogout, onEditProfileClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    // Clear localStorage and update the parent's state via onLogout prop
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
    navigate('/add-movie'); // Navigate to the add movie page
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
        {role === 'admin' && (
          <li className="nav-item left"><button className="add-movie-btn" onClick={handleAddMovieClick}>Add Movie</button></li>
        )}
        <li className="nav-item center">
          <input type="text" placeholder="Search" className="search-bar" />
        </li>
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
    </nav>
  );
};

export default NavBar;
