import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/profile');
          setUser(data);
        } catch (error) {
          console.error("Token invalid, logging out.", error);
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('authToken', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    const profileResponse = await api.get('/profile');
    setUser(profileResponse.data);
    // REMOVED: navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    // REMOVED: navigate('/login');
  };

  const value = { user, login, logout, isAuthenticated: !!user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};