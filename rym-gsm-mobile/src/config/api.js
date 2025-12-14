import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend URL when deployed
const API_URL = __DEV__ 
  ? 'http://192.168.1.210:5000/api' 
  : 'https://your-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Debug log for development
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - Token: ${token ? 'Present' : 'Missing'}`);
      }
    } catch (error) {
      console.error('[API] Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration or invalid token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Clear token on 401 (unauthorized) or 403 (invalid/expired token)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log('[API] Token rejected, clearing stored credentials');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
