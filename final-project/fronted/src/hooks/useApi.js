import { useCallback } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useApi = () => {
  const { token, setAuthState } = useAuth();

  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false
        });
      }
      return Promise.reject(error);
    }
  );

  const api = useCallback({
    get: (url, config = {}) => apiClient.get(url, config),
    post: (url, data, config = {}) => apiClient.post(url, data, config),
    put: (url, data, config = {}) => apiClient.put(url, data, config),
    patch: (url, data, config = {}) => apiClient.patch(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config)
  }, [apiClient]);

  return api;
};