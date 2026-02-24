import { apiClient } from './client';
import type { Product, PaginatedResponse } from '@/types';

interface ProductFilters {
  status?: string;
  category_id?: string;
  brand_id?: string;
  q?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}

export const productsApi = {
  getProducts: async (params?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.data;
  },

  createProduct: async (formData: FormData): Promise<Product> => {
    const { data } = await apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updateProduct: async (id: string, formData: FormData): Promise<Product> => {
    formData.append('_method', 'PUT');
    const { data } = await apiClient.post(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
