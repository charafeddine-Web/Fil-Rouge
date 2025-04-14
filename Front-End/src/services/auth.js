import api from './api';

export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/me');
export const verifyEmail = (data) => api.post('/verify-email', data);
