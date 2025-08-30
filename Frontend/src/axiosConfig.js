import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://khana-khajana-y852.vercel.app/', // Production backend
  baseURL: 'http://localhost:3001/', // Local development backend
  withCredentials: true, // Allow credentials (cookies) to be sent
  timeout: 10000, // 10 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle session expiry globally
    if (error.response?.status === 401) {
      console.log('Session expired - user needs to log in again');
      // Don't redirect here as it might cause loops, let components handle it
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
