import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Adjust the base URL as needed
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default axiosInstance;