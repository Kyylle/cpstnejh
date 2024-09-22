import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Get the auth token from localStorage

  // If no token exists, redirect to the sign-in page
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the children (protected page)
  return children;
};

export default ProtectedRoute;
