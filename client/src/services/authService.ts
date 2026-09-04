import { apiClient } from './api';
import { User, UserRole } from '../types/issue';
export interface LoginCredentials { email: string; password?: string; }
export interface RegisterData { fullName: string; email: string; password?: string; communityArea?: string; role: UserRole; }
export interface AuthResponse { success: boolean; message?: string; data: User; token: string; }
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> { return (await apiClient.post('/auth/login', credentials)).data; },
  async register(data: RegisterData): Promise<AuthResponse> { return (await apiClient.post('/auth/register', data)).data; },
  async me(): Promise<User> { return (await apiClient.get('/auth/me')).data.data; },
  async logout(): Promise<void> { await apiClient.post('/auth/logout', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('gramafix_token') } }); },
  async getDemoUsers(): Promise<User[]> { return (await apiClient.get('/auth/demo-users')).data.data; },
};
