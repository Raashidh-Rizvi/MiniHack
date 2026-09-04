import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gramafix_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
apiClient.interceptors.response.use(response => response, error => {
  if (error.response?.data?.message) error.message = error.response.data.message;
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login') &&
      error.config?.headers?.Authorization === 'Bearer ' + localStorage.getItem('gramafix_token')) {
    window.dispatchEvent(new Event('gramafix-session-expired'));
  }
  return Promise.reject(error);
});
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The request failed. Please retry.';
}
// Offline demo data must never mask a failed authenticated request or HTTP error.
export function allowLocalDemo(error: unknown): boolean {
  return import.meta.env.VITE_LOCAL_DEMO === 'true' && !localStorage.getItem('gramafix_token') && axios.isAxiosError(error) && !error.response;
}
