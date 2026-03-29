import type { ReactNode } from 'react';
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
      <div className="px-4 pt-3">
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
    <div className="px-4 pt-3 pb-4">
      <h1 className="text-lg font-bold mb-0.5" style={{ color: 'var(--tg-theme-text-color)' }}>
        Salom, {user?.first_name || 'Manager'}!
      </h1>
      <p className="text-sm mb-4" style={{ color: 'var(--tg-theme-hint-color)' }}>
        Bugungi ko'rsatkichlar
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard
          label="Bugungi buyurtmalar"
          value={String(dashboard?.today_orders ?? 0)}
          icon={<OrdersStatIcon />}
          bgToken="--mgr-accent-light"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          label="Kutilmoqda"
          value={String(dashboard?.pending_orders ?? 0)}
          icon={<PendingStatIcon />}
          bgToken="--mgr-warning-light"
          onClick={() => navigate('/orders?status=pending')}
        />
        <StatCard
          label="Bugungi daromad"
          value={formatPrice(dashboard?.today_revenue ?? 0)}
          icon={<RevenueStatIcon />}
          bgToken="--mgr-success-light"
        />
        <StatCard
          label="Kam qolgan"
          value={`${dashboard?.low_stock_count ?? 0} ta`}
          icon={<LowStockStatIcon />}
          bgToken="--mgr-danger-light"
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
                className="w-full text-left rounded-xl p-3.5"
                style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-center justify-between mb-1.5">
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

function StatCard({ label, value, icon, bgToken, onClick }: { label: string; value: string; icon: ReactNode; bgToken: string; onClick?: () => void }) {
  return (
    <button
      className="rounded-xl p-3.5 text-left"
      style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `var(${bgToken})` }}>
          {icon}
        </div>
      </div>
      <span className="text-xs block mb-0.5" style={{ color: 'var(--tg-theme-hint-color)' }}>{label}</span>
      <span className="text-base font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
        {value}
      </span>
    </button>
  );
}

function OrdersStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 7H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1z" stroke="var(--mgr-accent)" strokeWidth="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="var(--mgr-accent)" strokeWidth="2" />
    </svg>
  );
}

function PendingStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="var(--mgr-warning)" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="var(--mgr-warning)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RevenueStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="var(--mgr-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LowStockStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="var(--mgr-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
