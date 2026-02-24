import { apiClient } from './client';
import type { DashboardData } from '@/types';

export const dashboardApi = {
  getInit: () =>
    apiClient.get<{ data: DashboardData }>('/init').then((r) => r.data.data),
};
