import axios from 'axios';

export const AUTH_TOKEN_KEY = 'auth_token';

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});