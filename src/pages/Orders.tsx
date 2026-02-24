import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { formatPrice, formatDateTime } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useHaptic } from '@/hooks/useHaptic';

const statusTabs = [
  { key: '', label: 'Barchasi' },
  { key: 'pending', label: 'Kutilmoqda' },
  { key: 'confirmed', label: 'Tasdiqlangan' },
  { key: 'processing', label: 'Tayyorlanmoqda' },
  { key: 'shipped', label: 'Yo\'lda' },
];

export default function Orders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  const [activeTab, setActiveTab] = useState(initialStatus);
  const haptic = useHaptic();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', activeTab],
    queryFn: () => ordersApi.getOrders({
      status: activeTab || 'pending,confirmed,processing,shipped',
    }),
  });

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: activeTab === tab.key
                ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
              color: activeTab === tab.key
                ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
            }}
            onClick={() => {
              haptic.selectionChanged();
              setActiveTab(tab.key);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size={28} />
        </div>
      ) : !data || data.data.length === 0 ? (
        <EmptyState icon="📋" title="Buyurtmalar yo'q" description="Hozircha bu statusdagi buyurtmalar yo'q" />
      ) : (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {data.data.map((order) => (
            <button
              key={order.id}
              className="w-full text-left rounded-xl p-3"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold" style={{ color: 'var(--tg-theme-text-color)' }}>
                  #{order.order_number}
                </span>
                <StatusBadge status={order.status} label={order.status_label} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {order.user_name || 'Noma\'lum'}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {order.items_count} ta mahsulot · {formatDateTime(order.created_at)}
                  </span>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
