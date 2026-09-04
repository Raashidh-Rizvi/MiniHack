import axios from 'axios';

// Create Axios client with base API URL
export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request interceptor to attach authentication context
apiClient.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem('gramafix_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user?.id) {
        config.headers['x-user-id'] = String(user.id);
        config.headers['x-user-role'] = user.role || 'CITIZEN';
      }
    }
    const token = localStorage.getItem('gramafix_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Non-blocking
  }
  return config;
});

// Response interceptor for clear error messaging
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while contacting the server.';
    return Promise.reject(new Error(message));
  }
);
