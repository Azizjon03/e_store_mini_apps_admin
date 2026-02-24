import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/api/dashboard';
import { ordersApi } from '@/api/orders';
import { formatPrice, formatDateTime } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data: dashboard, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getInit,
    retry: false,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => ordersApi.getOrders({ per_page: 5 }),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
          E-Store Manager
        </h1>
        <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
          API bilan bog'lanib bo'lmadi. Telegram Mini App orqali kiring.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-theme-text-color)' }}>
        Salom, {user?.first_name || 'Manager'}!
      </h1>
      <p className="text-sm mb-4" style={{ color: 'var(--tg-theme-hint-color)' }}>
        Bugungi ko'rsatkichlar
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          label="Bugungi buyurtmalar"
          value={String(dashboard?.today_orders ?? 0)}
          icon="📦"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          label="Kutilmoqda"
          value={String(dashboard?.pending_orders ?? 0)}
          icon="⏳"
          onClick={() => navigate('/orders?status=pending')}
        />
        <StatCard
          label="Bugungi daromad"
          value={formatPrice(dashboard?.today_revenue ?? 0)}
          icon="💰"
        />
        <StatCard
          label="Kam qolgan"
          value={`${dashboard?.low_stock_count ?? 0} ta`}
          icon="📉"
          onClick={() => navigate('/stock?filter=low')}
        />
      </div>

      {/* Recent Orders */}
      {recentOrders && recentOrders.data.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--tg-theme-text-color)' }}>
              Oxirgi buyurtmalar
            </h2>
            <button
              className="text-xs font-medium"
              style={{ color: 'var(--tg-theme-link-color)' }}
              onClick={() => navigate('/orders')}
            >
              Barchasi
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentOrders.data.map((order) => (
              <button
                key={order.id}
                className="w-full text-left rounded-xl p-3"
                style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                    #{order.order_number}
                  </span>
                  <StatusBadge status={order.status} label={order.status_label} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {order.user_name || 'Noma\'lum'} · {formatDateTime(order.created_at)}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, onClick }: { label: string; value: string; icon: string; onClick?: () => void }) {
  return (
    <button
      className="rounded-xl p-3 text-left"
      style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>{label}</span>
      </div>
      <span className="text-base font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
        {value}
      </span>
    </button>
  );
}
