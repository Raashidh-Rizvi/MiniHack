import { apiClient } from './api';
import { User, UserRole } from '../types/issue';
export interface LoginCredentials { email: string; password?: string; }
export interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  verificationToken?: string;
  otp?: string;
  password?: string;
  communityArea?: string;
  role: UserRole;
}
export interface AuthResponse { success: boolean; message?: string; data: User; token: string; }
export interface OtpSendResponse { success: boolean; message: string; otp?: string; email?: string; phone?: string; expiresInSeconds?: number; }
export interface OtpVerifyResponse { success: boolean; message: string; verificationToken: string; email?: string; phone?: string; }

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> { return (await apiClient.post('/auth/login', credentials)).data; },
  async register(data: RegisterData): Promise<AuthResponse> { return (await apiClient.post('/auth/register', data)).data; },
  async sendOtp(params: { email?: string; phone?: string } | string): Promise<OtpSendResponse> {
    const payload = typeof params === 'string' ? (params.includes('@') ? { email: params } : { phone: params }) : params;
    return (await apiClient.post('/auth/send-otp', payload)).data;
  },
  async verifyOtp(params: { email?: string; phone?: string; otp: string } | string, otpParam?: string): Promise<OtpVerifyResponse> {
    const payload = typeof params === 'string'
      ? (params.includes('@') ? { email: params, otp: otpParam || '' } : { phone: params, otp: otpParam || '' })
      : params;
    return (await apiClient.post('/auth/verify-otp', payload)).data;
  },
  async me(): Promise<User> { return (await apiClient.get('/auth/me')).data.data; },
  async logout(): Promise<void> { await apiClient.post('/auth/logout', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('gramafix_token') } }); },
  async getDemoUsers(): Promise<User[]> { return (await apiClient.get('/auth/demo-users')).data.data; },
};
