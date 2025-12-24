import axios from 'axios';

// src/pages/apiClient.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bizpulse-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// This "Interceptor" automatically attaches your token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; //
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;