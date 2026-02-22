import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Fix #27: Point to your local backend. 
// For physical device: replace 'localhost' with your Mac's local IP (run `ifconfig | grep inet` to find it)
// For iOS simulator: localhost works fine
const API_URL = 'http://172.31.34.123:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getFeed = () => api.get('/incidents/feed');
export const getIncidents = () => api.get('/incidents');
export const getIncidentById = (id) => api.get(`/incidents/${id}`);
export const getResources = () => api.get('/resources');
export const reportIncident = async (formData) => {
  const token = await SecureStore.getItemAsync('jwt');
  return axios.post(`${API_URL}/incidents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    transformRequest: (data) => data,
  });
};
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const updatePushToken = (token) => api.post('/users/push-token', { token });