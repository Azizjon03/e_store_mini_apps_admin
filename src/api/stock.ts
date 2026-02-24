import { apiClient } from './client';
import type { StockBalance, PaginatedResponse } from '@/types';

export const stockApi = {
  getBalances: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<PaginatedResponse<StockBalance>>('/stock/balances', { params }).then((r) => r.data),

  getLowStock: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<PaginatedResponse<StockBalance>>('/stock/low', { params }).then((r) => r.data),

  adjust: (balanceId: number, data: { direction: 'in' | 'out'; quantity: number; reason?: string }) =>
    apiClient.post<{ data: StockBalance }>(`/stock/${balanceId}/adjust`, data).then((r) => r.data.data),
};
