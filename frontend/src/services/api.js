import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://your-backend-url.com/api'; // Replace with your actual backend URL

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
export const reportIncident = (formData) => api.post('/incidents', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const updatePushToken = (token) => api.post('/users/push-token', { token });