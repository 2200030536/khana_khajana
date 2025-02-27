import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Set the base URL for your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;