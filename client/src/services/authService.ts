import { apiClient } from './api';
import { User, UserRole } from '../types/issue';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password?: string;
  communityArea?: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: User;
  token: string;
}

export const authService = {
  /**
   * Authenticate user credentials against real MongoDB backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data && response.data.data) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Authentication failed.');
  },

  /**
   * Register a new user account with role
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data && response.data.data) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Registration failed.');
  },

  /**
   * Fetch demo users for persona switching
   */
  async getDemoUsers(): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: User[] }>('/auth/demo-users');
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  },
};
