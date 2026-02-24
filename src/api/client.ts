import axios from 'axios';

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData;
  if (initData) {
    config.headers.Authorization = `tma ${initData}`;
  }

  const devCompanyId = import.meta.env.VITE_DEV_COMPANY_ID;
  if (devCompanyId) {
    config.headers['X-Company-Id'] = devCompanyId;
  }

  return config;
});

export { apiClient };
