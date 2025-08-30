import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type is allowed for this route
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = user.userType === 'messUser' 
      ? '/messDashboard' 
      : user.userType === 'studentUser' 
      ? '/profile' 
      : '/adminDashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
