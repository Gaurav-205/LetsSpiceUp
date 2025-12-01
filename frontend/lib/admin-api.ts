import apiClient from './api-client';

export interface AdminStats {
  users: {
    total: number;
    verified: number;
    googleAuth: number;
    recent: number;
  };
  pranks: {
    total: number;
    recent: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prank {
  _id: string;
  userId: string | User;
  yourName: string;
  yourPhone: string;
  yourEmail: string;
  friendName: string;
  friendAge: string;
  personalityTypes: string[];
  prankType: string;
  additionalInfo?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  users?: T[];
  pranks?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminApi = {
  // Get admin dashboard stats
  getStats: async (): Promise<{ stats: AdminStats }> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  // Get all users (paginated)
  getUsers: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get all pranks (paginated)
  getPranks: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Prank>> => {
    const response = await apiClient.get('/admin/pranks', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user by ID
  getUser: async (userId: string): Promise<{ user: User; pranks: Prank[] }> => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Delete prank
  deletePrank: async (prankId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/pranks/${prankId}`);
    return response.data;
  },
};

