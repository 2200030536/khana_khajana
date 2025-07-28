import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://khana-khajana-y852.vercel.app/', // for local
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default axiosInstance;
