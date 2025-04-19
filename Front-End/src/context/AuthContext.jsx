import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth'; 

export const AuthContext = createContext();

 const AuthProvider = ({ children }) => {
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
  const isAuthenticated = !!user;

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return (
    <AuthContext.Provider value={{ token, setToken: handleSetToken, user, setUser,isAuthenticated, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;