import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { sendPushTokenToBackend } from '../services/notification';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('jwt');
      const spireId = await SecureStore.getItemAsync('spireId');
      if (token) {
        setUser({ token, spireId: spireId || 'User' });
        // Fix #24: Send push token after restoring session
        sendPushTokenToBackend();
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
      await SecureStore.setItemAsync('spireId', spireId);
      // Fix #26: Store spireId in user state
      setUser({ token, spireId });
      // Fix #24: Send push token AFTER login when we have JWT
      sendPushTokenToBackend();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  // Fix #20: Wire up registration
  const register = async (spireId, fullName, password) => {
    try {
      await apiRegister({ spireId, fullName, password });
      // Auto-login after registration
      return await login(spireId, password);
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  // Fix #21: Guest mode for anonymous reporting
  const continueAsGuest = () => {
    setUser({ token: null, spireId: null, isGuest: true });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('spireId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, continueAsGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};