import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '@/api/brands';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHaptic } from '@/hooks/useHaptic';

export default function Brands() {
  const navigate = useNavigate();
  const haptic = useHaptic();

  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getBrands({ per_page: 100 }),
    retry: false,
  });

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>Brendlar</h1>
        <button
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={() => { haptic.impact('light'); navigate('/brands/new'); }}
        >
          + Qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Spinner size={32} /></div>
      ) : !data?.data?.length ? (
        <EmptyState title="Brendlar topilmadi" />
      ) : (
        <div className="flex flex-col gap-2 px-4 pb-4">
          {data.data.map((brand) => (
            <button
              key={brand.id}
              className="flex items-center gap-3 rounded-xl p-3 text-left"
              style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
              onClick={() => navigate(`/brands/${brand.id}/edit`)}
            >
              {brand.logo ? (
                <img src={brand.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-bg-color)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="7" cy="7" r="1" fill="var(--tg-theme-hint-color)" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>{brand.name}</p>
                {brand.products_count !== undefined && (
                  <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>{brand.products_count} mahsulot</p>
                )}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: brand.status === 'active' ? 'var(--mgr-success-light)' : 'var(--mgr-danger-light)',
                  color: brand.status === 'active' ? 'var(--mgr-success)' : 'var(--mgr-danger)',
                }}>
                {brand.status === 'active' ? 'Faol' : 'Nofaol'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
