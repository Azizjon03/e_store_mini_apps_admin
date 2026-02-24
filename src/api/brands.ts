import { apiClient } from './client';
import type { Brand, PaginatedResponse } from '@/types';

export const brandsApi = {
  getBrands: async (params?: { status?: string; search?: string; per_page?: number }): Promise<PaginatedResponse<Brand>> => {
    const { data } = await apiClient.get('/brands', { params });
    return data;
  },

  getBrand: async (id: string): Promise<Brand> => {
    const { data } = await apiClient.get(`/brands/${id}`);
    return data.data;
  },

  createBrand: async (formData: FormData): Promise<Brand> => {
    const { data } = await apiClient.post('/brands', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateBrand: async (id: string, formData: FormData): Promise<Brand> => {
    formData.append('_method', 'PUT');
    const { data } = await apiClient.post(`/brands/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};
