import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type is allowed for this route
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user?.userType)) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = {
      'studentUser': '/profile',
      'messUser': '/messDashboard',
      'admin': '/adminDashboard'
    }[user?.userType] || '/login';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
