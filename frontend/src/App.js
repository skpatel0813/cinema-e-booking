import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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

// Helper Component to Block Restricted Navigation
const RestrictedRoute = ({ element, restrictedPaths, ...rest }) => {
  const location = useLocation();
  const isRestricted = restrictedPaths.includes(location.pathname);

  return isRestricted ? <Navigate to="/" replace /> : element;
};

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

        {/* Pages Restricted After Confirmation */}
        <Route
          path="/showtimes"
          element={
            <RestrictedRoute
              element={<Showtimes />}
              restrictedPaths={["/confirmation"]}
            />
          }
        />
        <Route
          path="/tickets"
          element={
            <RestrictedRoute
              element={<Tickets />}
              restrictedPaths={["/confirmation"]}
            />
          }
        />
        <Route
          path="/selectseats"
          element={
            <RestrictedRoute
              element={<SelectSeats />}
              restrictedPaths={["/confirmation"]}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <RestrictedRoute
              element={<Checkout />}
              restrictedPaths={["/confirmation"]}
            />
          }
        />
        <Route path="/confirmation" element={<Confirmation />} />

        {/* Fallback Route: Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
