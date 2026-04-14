import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Needed for sending browser cookies back to backend
});

export default api;
