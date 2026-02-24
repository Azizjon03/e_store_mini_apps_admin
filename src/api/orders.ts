import { apiClient } from './client';
import type { ManagerOrder, ManagerOrderDetail, PaginatedResponse } from '@/types';

export const ordersApi = {
  getOrders: (params?: { status?: string; page?: number; per_page?: number }) =>
    apiClient.get<PaginatedResponse<ManagerOrder>>('/orders', { params }).then((r) => r.data),

  getOrder: (id: number) =>
    apiClient.get<{ data: ManagerOrderDetail }>(`/orders/${id}`).then((r) => r.data.data),

  updateStatus: (id: number, status: string, adminNote?: string) =>
    apiClient.put<{ data: ManagerOrderDetail }>(`/orders/${id}/status`, { status, admin_note: adminNote }).then((r) => r.data.data),

  cancel: (id: number, reason: string) =>
    apiClient.post<{ data: ManagerOrderDetail }>(`/orders/${id}/cancel`, { reason }).then((r) => r.data.data),

  return_: (id: number, reason: string) =>
    apiClient.post<{ data: ManagerOrderDetail }>(`/orders/${id}/return`, { reason }).then((r) => r.data.data),

  verifyPayment: (id: number, action: 'verify' | 'reject', note?: string) =>
    apiClient.post<{ data: ManagerOrderDetail }>(`/orders/${id}/verify-payment`, { action, note }).then((r) => r.data.data),
};
