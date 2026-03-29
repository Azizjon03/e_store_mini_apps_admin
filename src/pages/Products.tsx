import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { formatPrice } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHaptic } from '@/hooks/useHaptic';

const statusTabs = [
  { key: '', label: 'Barchasi' },
  { key: 'active', label: 'Faol' },
  { key: 'inactive', label: 'Nofaol' },
  { key: 'draft', label: 'Qoralama' },
];

const productStatusStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'var(--mgr-success-light)', text: 'var(--mgr-success)', label: 'Faol' },
  draft: { bg: 'var(--mgr-warning-light)', text: 'var(--mgr-warning)', label: 'Qoralama' },
  inactive: { bg: 'var(--mgr-danger-light)', text: 'var(--mgr-danger)', label: 'Nofaol' },
};

export default function Products() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const haptic = useHaptic();

  const { data, isLoading } = useQuery({
    queryKey: ['products', status, search],
    queryFn: () => productsApi.getProducts({ status: status || undefined, q: search || undefined, per_page: 50 }),
    retry: false,
  });

  return (
    <div>
      {/* Header with add button */}
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>Mahsulotlar</h1>
        <button
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={() => { haptic.impact('light'); navigate('/products/new'); }}
        >
          + Qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="11" cy="11" r="7" stroke="var(--tg-theme-hint-color)" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="var(--tg-theme-hint-color)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: status === tab.key ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
              color: status === tab.key ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-hint-color)',
            }}
            onClick={() => { haptic.selectionChanged(); setStatus(tab.key); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Spinner size={32} /></div>
      ) : !data?.data?.length ? (
        <EmptyState title="Mahsulotlar topilmadi" description="Yangi mahsulot qo'shish uchun tugmani bosing" />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
          {data.data.map((product) => {
            const statusStyle = productStatusStyles[product.status] || productStatusStyles.inactive;
            return (
              <button
                key={product.id}
                className="rounded-xl overflow-hidden text-left"
                style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                {product.thumbnail ? (
                  <img src={product.thumbnail} alt="" className="w-full aspect-4/3 object-cover" />
                ) : (
                  <div className="w-full aspect-4/3 flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--tg-theme-hint-color)" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="var(--tg-theme-hint-color)" />
                      <path d="M21 15l-5-5L5 21" stroke="var(--tg-theme-hint-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium leading-tight line-clamp-2 mb-1.5" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {product.name?.uz || 'Nomsiz'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
