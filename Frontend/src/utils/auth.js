// Frontend authentication utility for JWT
import axiosInstance from '../axiosConfig';

// Store JWT token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    // Set default authorization header for axios
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Get stored token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

// Logout function
export const logout = () => {
  setAuthToken(null);
  // Redirect to login page
  window.location.href = '/login';
};

// Example login function
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data;
    setAuthToken(token);
    
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

// Example protected API call
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logout(); // Token expired or invalid
    }
    throw error;
  }
};

// Initialize auth on app startup
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token && isAuthenticated()) {
    setAuthToken(token);
  } else {
    setAuthToken(null);
  }
};
