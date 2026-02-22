import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('ai_twin_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place to log or transform errors later if needed
    return Promise.reject(error);
  },
);

export const signup = async ({ name, email, password }) => {
  const payload = {
    username: name,
    email,
    password,
    is_active: true,
  };

  const response = await apiClient.post('/users/', payload);
  return response.data;
};

export const login = async ({ username, password }) => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const response = await apiClient.post('/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const chat = async ({ query, modelType = 'general', adapterName = null }) => {
  const payload = {
    query,
    model_type: modelType,
    adapter_name: adapterName,
  };

  const response = await apiClient.post('/chat/', payload);
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload-doc/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default apiClient;

