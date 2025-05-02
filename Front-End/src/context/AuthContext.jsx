import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth'; 
import { initEcho } from '../services/echo';

export const AuthContext = createContext();

 const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (token) {
        getCurrentUser(token)
        .then((response) => {
          console.log("User Data:", response.data);  
          setUser(response.data);
          // Initialize Laravel Echo for real-time messaging
          initEcho(token);
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoadingUser(false);
        });;
    }else{
      setLoadingUser(false);
    }
  }, [token]);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      // Initialize Echo when token is set
      initEcho(newToken);
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
    <AuthContext.Provider value={{ token, setToken: handleSetToken, user, setUser, isAuthenticated, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;