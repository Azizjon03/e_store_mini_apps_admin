import { apiClient } from './client';
import type { Category } from '@/types';

export const categoriesApi = {
  getCategories: async (params?: { status?: string; search?: string }): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories', { params });
    return data.data;
  },

  getCategoryTree: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories/tree');
    return data.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data.data;
  },

  createCategory: async (formData: FormData): Promise<Category> => {
    const { data } = await apiClient.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateCategory: async (id: string, formData: FormData): Promise<Category> => {
    formData.append('_method', 'PUT');
    const { data } = await apiClient.post(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
