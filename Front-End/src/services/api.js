import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Ajouter automatiquement le token dans les requêtes (si tu utilises AuthContext ou localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou depuis ton context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
