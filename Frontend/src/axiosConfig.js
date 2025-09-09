import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://khana-khajana-y852.vercel.app/'
    // 'https://khana-khajana-0lwr.onrender.com' 
    : 'http://localhost:3001', // Local development backend
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default axiosInstance;
