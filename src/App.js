// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Account from './pages/Account';
import Login from './pages/Login';
import NavBar from './components/NavBar'; // Import NavBar from components
import './styles/App.css';


const App = () => {
  return (
    <Router>
      <NavBar /> {/* NavBar is included here for consistent navigation across all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} /> {/* Adding login route */}
      </Routes>
    </Router>
  );
};

export default App;
