import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';
import { useAuthStore } from '@/store/authStore';

const settingItems: Array<{
  key: 'shop_open' | 'allow_cancellation' | 'allow_returns';
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    key: 'shop_open',
    label: 'Do\'kon holati',
    description: 'Do\'kon ochiq yoki yopiq',
    icon: <ShopIcon />,
  },
  {
    key: 'allow_cancellation',
    label: 'Bekor qilish',
    description: 'Buyurtmalarni bekor qilishga ruxsat',
    icon: <CancelIcon />,
  },
  {
    key: 'allow_returns',
    label: 'Qaytarish',
    description: 'Buyurtmalarni qaytarishga ruxsat',
    icon: <ReturnIcon />,
  },
];

export default function Settings() {
  const queryClient = useQueryClient();
  const haptic = useHaptic();
  const user = useAuthStore((s) => s.user);

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getSettings,
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: (key: 'shop_open' | 'allow_cancellation' | 'allow_returns') =>
      settingsApi.toggleSetting(key),
    onMutate: async (key) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const prev = queryClient.getQueryData<typeof settings>(['settings']);
      if (prev) {
        queryClient.setQueryData(['settings'], { ...prev, [key]: !prev[key] });
      }
      return { prev };
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(['settings'], newSettings);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      haptic.notification('success');
      showToast('Sozlama yangilandi', 'success');
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(['settings'], context.prev);
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="px-4 pt-3">
        <h1 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
          Sozlamalar
        </h1>
        <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
          Ma'lumotlarni yuklashda xatolik yuz berdi. Telegram Mini App orqali kiring.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Profile Header */}
      <div className="flex items-center gap-3 mb-6 rounded-xl p-4" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
        >
          {(user?.first_name?.[0] || 'M').toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold truncate" style={{ color: 'var(--tg-theme-text-color)' }}>
            {user?.first_name || 'Manager'} {user?.last_name || ''}
          </span>
          <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Administrator
          </span>
        </div>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
        Sozlamalar
      </h2>

      <div className="flex flex-col gap-2">
        {settingItems.map((item) => {
          const isOn = settings[item.key];
          return (
            <button
              key={item.key}
              className="flex items-center justify-between rounded-xl p-4"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
              onClick={() => toggleMutation.mutate(item.key)}
              disabled={toggleMutation.isPending}
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {item.label}
                  </span>
                  <span className="text-xs mt-0.5" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {item.description}
                  </span>
                </div>
              </div>
              <div
                className="w-12.5 h-7.5 rounded-full relative transition-colors shrink-0 ml-3"
                style={{ backgroundColor: isOn ? 'var(--mgr-success)' : 'var(--tg-theme-hint-color)' }}
              >
                <div
                  className="absolute top-0.75 w-6 h-6 rounded-full bg-white shadow transition-transform"
                  style={{ transform: isOn ? 'translateX(22px)' : 'translateX(3px)' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l1.5-5h15L21 9M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V13h6v8" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" />
      <path d="M15 9l-6 6M9 9l6 6" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 14l-4-4 4-4" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10h11a4 4 0 010 8h-3" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
