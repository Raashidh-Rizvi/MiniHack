import axios from 'axios';

// Create Axios client with base API URL
export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

<<<<<<< HEAD
export interface ApiError extends Error {
  status?: number;
  errors?: Array<{ field?: string; message: string } | string>;
  fieldErrors?: Record<string, string>;
  response?: any;
}

// Response interceptor for clear, suitable error messaging
=======
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
>>>>>>> 90b1160f1914f19d7c0fa3ca4b22a1bc062844b5
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const data = error.response?.data;
    let message = data?.message || error.message || 'An unexpected error occurred while contacting the server.';
    
    // If backend provided detailed validation errors array, construct clear composite message
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const errorList = data.errors.map((e: any) => (typeof e === 'string' ? e : e.message || e.field || 'Invalid field'));
      if (!data.message || data.message === 'Validation Error' || data.message.includes('Validation failed')) {
        message = errorList.join('. ');
      } else {
        message = `${message}: ${errorList.join(', ')}`;
      }
    }

    const customError: ApiError = new Error(message);
    customError.status = error.response?.status;
    customError.response = error.response;
    customError.errors = data?.errors;

    if (Array.isArray(data?.errors)) {
      const fieldMap: Record<string, string> = {};
      data.errors.forEach((e: any) => {
        if (typeof e === 'object' && e?.field && e?.message) {
          fieldMap[e.field] = e.message;
        }
      });
      customError.fieldErrors = fieldMap;
    }

    return Promise.reject(customError);
  }
);
