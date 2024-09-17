import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Account from './pages/Account';
import Register from './pages/Register'; // Assuming Register page is in src/pages
import EditMovie from './pages/EditMovie';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/account" element={<Account />} />
        <Route path="/register" element={<Register />} /> {/* Add route for Register */}
        <Route path="/edit-movie/:id" element={<EditMovie />} />
      </Routes>
    </Router>
  );
};

export default App;
