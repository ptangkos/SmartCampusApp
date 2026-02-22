import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import AlertBanner from './src/components/AlertBanner';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { registerForPushNotifications } from './src/services/notification';
import { initWebSocket } from './src/services/websocket';

export default function App() {
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Fix #24: Only register for permissions here, NOT send token to backend
    // Token is sent to backend after login (handled in AuthContext)
    registerForPushNotifications();
    initWebSocket();

    // Fix #23: Listen for CRITICAL alerts and show banner
    const alertSub = DeviceEventEmitter.addListener('NEW_ALERT', (alert) => {
      setAlertMessage(`${alert.category}: ${alert.description}`);
      // Auto-dismiss after 10 seconds
      setTimeout(() => setAlertMessage(null), 10000);
    });

    return () => {
      alertSub.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        {alertMessage && <AlertBanner message={alertMessage} onDismiss={() => setAlertMessage(null)} />}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}