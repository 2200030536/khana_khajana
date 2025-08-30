import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in when app starts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const response = await axiosInstance.get('/auth/profile');
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('User is authenticated:', response.data.user);
      }
    } catch (error) {
      console.log('User is not authenticated:', error.response?.status);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('Login successful:', response.data.user);
        return response.data.user;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear any localStorage tokens if they exist
      localStorage.removeItem('token');
      console.log('User logged out');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
