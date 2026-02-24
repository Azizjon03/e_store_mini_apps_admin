import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '@/api/stock';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHaptic } from '@/hooks/useHaptic';

export default function StockBalances() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showLow, setShowLow] = useState(searchParams.get('filter') === 'low');
  const haptic = useHaptic();

  const { data, isLoading } = useQuery({
    queryKey: ['stock', showLow ? 'low' : 'all'],
    queryFn: () => showLow ? stockApi.getLowStock() : stockApi.getBalances(),
  });

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-2 px-4 py-3">
        <button
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: !showLow ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
            color: !showLow ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
          }}
          onClick={() => { haptic.selectionChanged(); setShowLow(false); }}
        >
          Barchasi
        </button>
        <button
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: showLow ? 'var(--mgr-danger)' : 'var(--tg-theme-secondary-bg-color)',
            color: showLow ? '#fff' : 'var(--tg-theme-hint-color)',
          }}
          onClick={() => { haptic.selectionChanged(); setShowLow(true); }}
        >
          Kam qolganlar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner size={28} /></div>
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          icon={showLow ? '✅' : '📦'}
          title={showLow ? 'Kam qolgan mahsulotlar yo\'q' : 'Omborda mahsulot yo\'q'}
        />
      ) : (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {data.data.map((balance) => (
            <div
              key={balance.id}
              className="rounded-xl p-3"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: balance.is_low_stock ? 'var(--mgr-danger)' : 'var(--mgr-success)' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {balance.product_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  Jami: {balance.quantity} · Band: {balance.reserved} · Mavjud: <strong>{balance.available}</strong>
                  {balance.is_low_stock && <span className="ml-1">(limit: {balance.low_stock_threshold})</span>}
                </div>
                <div className="flex gap-1">
                  <button
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: 'var(--mgr-success)', color: '#fff' }}
                    onClick={() => navigate(`/stock/${balance.id}/adjust?direction=in`)}
                  >
                    +Kirim
                  </button>
                  <button
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: 'var(--mgr-danger)', color: '#fff' }}
                    onClick={() => navigate(`/stock/${balance.id}/adjust?direction=out`)}
                  >
                    -Chiqim
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
