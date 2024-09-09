import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ onLoginClick, userName, onLogout }) => {
  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
        <li className="nav-item center">
          <input type="text" placeholder="Search" className="search-bar" />
        </li>
        <li className="nav-item right">
          {userName ? (
            <div>
              <span>Welcome, {userName}</span>
              <button className="logout-button" onClick={onLogout}>Logout</button>
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
