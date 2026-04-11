// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies on every request
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest.url.includes('/auth/login')) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.user;
  },

  signup: async (email, username, password) => {
    const response = await api.post('/auth/signup', { email, username, password });
    return response.data.user;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  validateToken: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  },
};

export default api;
