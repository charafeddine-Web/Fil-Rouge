import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth'; // fonction API pour récupérer l'utilisateur connecté

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
        getCurrentUser(token)
        .then(setUser)
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
