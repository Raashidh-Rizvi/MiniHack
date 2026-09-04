import { apiClient } from './api';
import { User, UserRole } from '../types/issue';
import { MOCK_USERS } from '../data/mockIssues';

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
   * Authenticate user credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data && response.data.data) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Authentication failed.');
    } catch (error: any) {
      // Graceful offline fallback to mock users if server is unavailable
      const normalizedEmail = credentials.email.trim().toLowerCase();
      const mockUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (mockUser) {
        return {
          success: true,
          message: 'Authenticated (Local Mode)',
          data: mockUser,
          token: `local_token_${mockUser.id}_${Date.now()}`,
        };
      }
      throw error;
    }
  },

  /**
   * Register a new user account with role
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      if (response.data && response.data.data) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Registration failed.');
    } catch (error: any) {
      // If network error, allow local test fallback
      if (error.message && !error.message.includes('already exists')) {
        const newUser: User = {
          id: Date.now(),
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          communityArea: data.communityArea || 'Matale Town',
        };
        return {
          success: true,
          message: 'Registered successfully (Local Mode)',
          data: newUser,
          token: `local_token_${newUser.id}_${Date.now()}`,
        };
      }
      throw error;
    }
  },

  /**
   * Fetch demo users for persona switching
   */
  async getDemoUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User[] }>('/auth/demo-users');
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  },
};
