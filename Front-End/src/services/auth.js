import api from './api';

// Service object pour les nouvelles fonctionnalités
const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user && user.role === 'admin';
    }
};

// Exports nommés pour la compatibilité avec le code existant
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
export const getCurrentUser = (token) => {
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

// Export par défaut pour les nouvelles fonctionnalités
export default authService;
