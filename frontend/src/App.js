import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Account from './pages/Account';
import Register from './pages/Register'; // Assuming Register page is in src/pages
import EditMovie from './pages/EditMovie';
import AddMovie from './pages/AddMovie';
import UserManagement from './pages/UserManagement'; // Import UserManagement component
import EditUser from './pages/EditUser';
import EditPricing from './pages/EditPricing';
import Showtimes from './pages/Showtimes';
import Tickets from './pages/Tickets';
import SelectSeats from './pages/SelectSeats';

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
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/edit-users" element={<UserManagement />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />
        <Route path="/edit-pricing" element={<EditPricing />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/selectseats" element={<SelectSeats />} />
      </Routes>
    </Router>
  );
};

export default App;
