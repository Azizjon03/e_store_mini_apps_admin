import { apiClient } from './client';
import type { CompanySettings } from '@/types';

export const settingsApi = {
  getSettings: () =>
    apiClient.get<{ data: CompanySettings }>('/settings').then((r) => r.data.data),

  toggleSetting: (key: 'shop_open' | 'allow_cancellation' | 'allow_returns') =>
    apiClient.post<{ data: CompanySettings }>(`/settings/${key}/toggle`).then((r) => r.data.data),
};
