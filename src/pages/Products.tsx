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
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
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
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)', color: 'var(--tg-theme-text-color)', border: 'none', outline: 'none' }}
        />
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
        <EmptyState icon="📦" title="Mahsulotlar topilmadi" description="Yangi mahsulot qo'shish uchun tugmani bosing" />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          {data.data.map((product) => (
            <button
              key={product.id}
              className="rounded-xl overflow-hidden text-left"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              {product.thumbnail ? (
                <img src={product.thumbnail} alt="" className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>
                  <span className="text-3xl">📷</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {product.name?.uz || 'Nomsiz'}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: product.status === 'active' ? 'rgba(52,199,89,0.15)' : product.status === 'draft' ? 'rgba(255,149,0,0.15)' : 'rgba(255,59,48,0.15)',
                      color: product.status === 'active' ? '#34c759' : product.status === 'draft' ? '#ff9500' : '#ff3b30',
                    }}>
                    {product.status === 'active' ? 'Faol' : product.status === 'draft' ? 'Qoralama' : 'Nofaol'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
