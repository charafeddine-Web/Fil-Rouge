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
export const getCurrentUser = (token) => 
  {
    return api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
export const verifyEmail = (data) => api.post('/verify-email', data);


export const updateProfile = (data, token) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  return api.put('/user/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};
