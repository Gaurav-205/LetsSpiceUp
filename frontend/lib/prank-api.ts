import apiClient from './api-client';
import { PrankSubmissionData, PrankResponse } from '@/types/prank';

export const prankApi = {
  createPrank: async (data: PrankSubmissionData): Promise<{ message: string; prank: PrankResponse }> => {
    const response = await apiClient.post('/pranks', data);
    return response.data;
  },

  getPranks: async (): Promise<{ pranks: PrankResponse[]; count: number }> => {
    const response = await apiClient.get('/pranks');
    return response.data;
  },

  getPrankById: async (id: string): Promise<{ prank: PrankResponse }> => {
    const response = await apiClient.get(`/pranks/${id}`);
    return response.data;
  },
};

