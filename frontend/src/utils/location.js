import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission denied');
  }
  return await Location.getCurrentPositionAsync({});
};