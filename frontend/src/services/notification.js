import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { updatePushToken } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Fix #24: This only registers for permissions and gets the token.
// The actual API call to send token to backend is done AFTER login via sendPushTokenToBackend().
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return tokenData.data;
};

// Fix #24: Call this AFTER login when we have a valid JWT
export const sendPushTokenToBackend = async () => {
  try {
    const token = await registerForPushNotifications();
    if (token) {
      await updatePushToken(token);
      console.log('Push token sent to backend');
    }
  } catch (error) {
    console.log('Push notifications not available in Expo Go');
  }
};