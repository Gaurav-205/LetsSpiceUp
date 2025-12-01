import apiClient from './api-client';
import {
  AuthResponse,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from '@/types/auth';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

