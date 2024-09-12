import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, userName, onLogout, onEditProfileClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
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
                  <button className="dropdown-btn" onClick={onLogout}>Logout</button>
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
