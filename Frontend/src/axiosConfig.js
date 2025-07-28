import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://khana-khajana-i2rp-1omjcbd84-rohits-projects-c8d7edd1.vercel.app', // for local
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default axiosInstance;
