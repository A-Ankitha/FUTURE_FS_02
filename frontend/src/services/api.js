import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (once auth is implemented in Phase 4/9) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leadflow-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
