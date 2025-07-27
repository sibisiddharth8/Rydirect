import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<any | void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/profile'); 
        setUser(data);
        // --- THIS IS THE FIX ---
        // We now set loading to false AFTER a successful fetch.
        setLoading(false); 
        return data;
      } catch (error) {
        console.error("Token is invalid, logging out.", error);
        logout();
        setLoading(false); // Also set loading to false on error
      }
    } else {
      // Also set loading to false if there is no token at all
      setLoading(false); 
    }
  }, [logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('authToken', data.token);
    await fetchUserProfile();
  };

  const value = { user, login, logout, fetchUserProfile, isAuthenticated: !!user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};