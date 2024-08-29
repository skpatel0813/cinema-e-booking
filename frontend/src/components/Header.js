import React from 'react';
import './Header.css'; // Optional: for custom styling

const Header = () => {
    return (
        <header className="header">
            <div className="search-container">
                <input type="text" placeholder="Search..." className="search-bar" />
            </div>
            <button className="login-button">Login</button>
        </header>
    );
};

export default Header;
