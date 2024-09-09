// src/components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; // Assuming you have a separate CSS file for styling

const NavBar = ({ onLoginClick }) => {
  return (
    <nav>
      <ul className="nav-list">
        <li className="nav-item left"><Link to="/">Home</Link></li>
        <li className="nav-item center">
          <input type="text" placeholder="Search" className="search-bar" />
        </li>
        <li className="nav-item right">
          <button className="login-button" onClick={onLoginClick}>Login</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
