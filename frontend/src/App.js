import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Account from './pages/Account';
import Register from './pages/Register';
import EditMovie from './pages/EditMovie';
import AddMovie from './pages/AddMovie';
import UserManagement from './pages/UserManagement';
import EditUser from './pages/EditUser';
import EditPricing from './pages/EditPricing';
import Showtimes from './pages/Showtimes';
import Tickets from './pages/Tickets';
import SelectSeats from './pages/SelectSeats';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes for All Logged-In Users */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* Admin-Only Routes */}
        <Route
          path="/edit-movie/:id"
          element={
            <ProtectedRoute roleRequired="admin">
              <EditMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-movie"
          element={
            <ProtectedRoute roleRequired="admin">
              <AddMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-users"
          element={
            <ProtectedRoute roleRequired="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:userId"
          element={
            <ProtectedRoute roleRequired="admin">
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-pricing"
          element={
            <ProtectedRoute roleRequired="admin">
              <EditPricing />
            </ProtectedRoute>
          }
        />

        {/* Other Routes */}
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/selectseats" element={<SelectSeats />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />

        {/* Fallback Route: Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
