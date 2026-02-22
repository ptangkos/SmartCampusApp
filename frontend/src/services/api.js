import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://172.31.39.0:8080/api'; // Replace with your actual backend URL

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
export const reportIncident = (formData) => api.post('/incidents', formData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const updatePushToken = (token) => api.post('/users/push-token', { token });