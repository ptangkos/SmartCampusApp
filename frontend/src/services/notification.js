import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { updatePushToken } from './api';

export async function registerForPushNotifications() {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Send token to backend
  await updatePushToken({ token });
}

// Handle incoming notifications when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});