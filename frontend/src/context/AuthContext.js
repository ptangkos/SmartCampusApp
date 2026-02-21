import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('jwt');
      if (token) {
        setUser({ token });
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (spireId, password) => {
    try {
      const response = await apiLogin({ spireId, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('jwt', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};