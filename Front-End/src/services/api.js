import axios from 'axios';

// Use environment variable or fallback to localhost:8000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('API URL being used:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Ajouter Token to LocalStorage 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
