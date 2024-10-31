import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('role');

  if (!isLoggedIn) {
    // Redirect to login page if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // Redirect to homepage if the user is not authorized
    return <Navigate to="/" replace />;
  }

  // Render child components if checks pass
  return children;
};

export default ProtectedRoute;
