import axios from 'axios';

const apiOrigin = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_URL = apiOrigin.endsWith('/api') ? apiOrigin : `${apiOrigin}/api`;

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.data?.success && response.data.data !== undefined) {
    return { ...response, data: response.data.data };
  }

  return response;
});

export default api;
