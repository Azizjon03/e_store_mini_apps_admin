import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useHaptic } from '@/hooks/useHaptic';
import type { Category } from '@/types';

export default function Categories() {
  const navigate = useNavigate();
  const haptic = useHaptic();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => categoriesApi.getCategoryTree(),
    retry: false,
  });

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>Kategoriyalar</h1>
        <button
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={() => { haptic.impact('light'); navigate('/categories/new'); }}
        >
          + Qo'shish
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Spinner size={32} /></div>
      ) : !categories?.length ? (
        <EmptyState title="Kategoriyalar topilmadi" />
      ) : (
        <div className="px-4 pb-4">
          {categories.map((cat) => (
            <CategoryTreeItem key={cat.id} category={cat} level={0} onEdit={(id) => navigate(`/categories/${id}/edit`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTreeItem({ category, level, onEdit }: { category: Category; level: number; onEdit: (id: string) => void }) {
  return (
    <>
      <button
        className="w-full text-left flex items-center gap-2 py-2.5 rounded-lg"
        style={{ paddingLeft: level * 20 + 8 }}
        onClick={() => onEdit(category.id)}
      >
        <span className="text-base">{category.icon || (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}</span>
        <div className="flex-1">
          <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
            {category.name?.uz || category.slug}
          </span>
          {category.products_count !== undefined && (
            <span className="text-xs ml-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
              ({category.products_count})
            </span>
          )}
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: category.status === 'active' ? 'var(--mgr-success-light)' : 'var(--mgr-danger-light)',
            color: category.status === 'active' ? 'var(--mgr-success)' : 'var(--mgr-danger)',
          }}>
          {category.status === 'active' ? 'Faol' : 'Nofaol'}
        </span>
      </button>
      {category.children_recursive?.map((child) => (
        <CategoryTreeItem key={child.id} category={child} level={level + 1} onEdit={onEdit} />
      ))}
    </>
  );
}
