// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../Services/api';
import { usePlayer } from './PlayerContext';

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearPlayer } = usePlayer();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.validateToken();
        setUser(userData);
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.error('Auth validation failed unexpectedly:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const signup = async (email, username, password) => {
    const userData = await authService.signup(email, username, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed on server, clearing local state anyway:', err);
    } finally {
      setUser(null);
      clearPlayer?.();
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};