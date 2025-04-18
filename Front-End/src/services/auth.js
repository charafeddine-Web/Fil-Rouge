import api from './api';

export const login = (data) => api.post('/login', data);

export const register = (data) => {
    const formData = new FormData();
  
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
  
    return api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/me');
export const verifyEmail = (data) => api.post('/verify-email', data);
