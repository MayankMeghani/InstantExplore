import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/userContext'; // Assuming you're using this hook to access user context

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const message = "Please log in to access the page.";
  if (!user) {
    return <Navigate to="/login" state={{ message }} replace />;
  }

  return children;
};

export default ProtectedRoute;
