import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';

const settingItems: Array<{
  key: 'shop_open' | 'allow_cancellation' | 'allow_returns';
  label: string;
  description: string;
  onIcon: string;
  offIcon: string;
}> = [
  {
    key: 'shop_open',
    label: 'Do\'kon holati',
    description: 'Do\'kon ochiq yoki yopiq',
    onIcon: '🟢',
    offIcon: '🔴',
  },
  {
    key: 'allow_cancellation',
    label: 'Bekor qilish',
    description: 'Buyurtmalarni bekor qilishga ruxsat',
    onIcon: '✅',
    offIcon: '❌',
  },
  {
    key: 'allow_returns',
    label: 'Qaytarish',
    description: 'Buyurtmalarni qaytarishga ruxsat',
    onIcon: '✅',
    offIcon: '❌',
  },
];

export default function Settings() {
  const queryClient = useQueryClient();
  const haptic = useHaptic();

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
      <div className="p-4">
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
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
        Sozlamalar
      </h1>

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
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {item.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  {item.description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{isOn ? item.onIcon : item.offIcon}</span>
                <div
                  className="w-12 h-7 rounded-full relative transition-colors"
                  style={{ backgroundColor: isOn ? 'var(--mgr-success)' : 'var(--tg-theme-hint-color)' }}
                >
                  <div
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
                    style={{ transform: isOn ? 'translateX(22px)' : 'translateX(2px)' }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
