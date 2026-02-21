import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications } from './src/services/notification';
import { initWebSocket } from './src/services/websocket';

export default function App() {
  useEffect(() => {
    registerForPushNotifications();
    initWebSocket();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}