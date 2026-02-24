import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { initTelegram, getTelegramUser, getStartParam } from '@/lib/telegram';
import { useAuthStore } from '@/store/authStore';
import { useBackButton } from '@/hooks/useBackButton';
import { TabBar } from '@/components/layout/TabBar';

export function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    initTelegram();
    const user = getTelegramUser();
    if (user) {
      setUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
      });
    }

    const startParam = getStartParam();
    if (startParam?.startsWith('order_')) {
      const orderId = startParam.replace('order_', '');
      navigate(`/orders/${orderId}`, { replace: true });
    } else if (startParam === 'stock') {
      navigate('/stock', { replace: true });
    }
  }, []);

  useBackButton();

  return (
    <div className="min-h-screen" style={{ paddingBottom: 72 }}>
      <Outlet />
      <TabBar />
    </div>
  );
}
