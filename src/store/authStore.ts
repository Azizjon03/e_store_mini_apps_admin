import { create } from 'zustand';
import type { TelegramUser } from '@/types';

interface AuthState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  setUser: (user: TelegramUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
