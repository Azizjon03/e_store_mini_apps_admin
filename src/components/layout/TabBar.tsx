import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { Badge } from '@/components/ui/Badge';
import { useHaptic } from '@/hooks/useHaptic';

const tabs: Array<{
  path: string;
  label: string;
  icon: (props: { color: string }) => ReactNode;
  badgeKey?: 'pending_orders' | 'low_stock_count';
}> = [
  { path: '/', label: 'Asosiy', icon: DashboardIcon },
  { path: '/orders', label: 'Buyurtma', icon: OrdersIcon, badgeKey: 'pending_orders' },
  { path: '/products', label: 'Katalog', icon: CatalogIcon },
  { path: '/stock', label: 'Ombor', icon: StockIcon, badgeKey: 'low_stock_count' },
  { path: '/settings', label: 'Sozlama', icon: SettingsIcon },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptic();

  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getInit,
    staleTime: 30 * 1000,
  });

  const isTabActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // Katalog tab: products, categories, brands
    if (path === '/products') {
      return location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/categories') ||
        location.pathname.startsWith('/brands');
    }
    return location.pathname.startsWith(path);
  };

  // Hide on detail/form pages
  const hidePatterns = ['/orders/', '/adjust', '/new', '/edit'];
  if (hidePatterns.some((p) => location.pathname.includes(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color)',
        borderTop: '0.5px solid var(--tg-theme-hint-color, rgba(0,0,0,0.1))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => {
        const active = isTabActive(tab.path);
        const color = active
          ? 'var(--tg-theme-button-color, #2481cc)'
          : 'var(--tg-theme-hint-color, #999)';
        const badgeCount = tab.badgeKey && data ? data[tab.badgeKey] : 0;

        return (
          <button
            key={tab.path}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative"
            style={{ minHeight: 56 }}
            onClick={() => {
              haptic.selectionChanged();
              navigate(tab.path);
            }}
          >
            <div className="relative">
              <tab.icon color={color} />
              {badgeCount > 0 && <Badge count={badgeCount} />}
            </div>
            <span className="text-[10px]" style={{ color }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DashboardIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function OrdersIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="1.8" />
      <path d="M9 12h6M9 16h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StockIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 7H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1z" stroke={color} strokeWidth="1.8" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth="1.8" />
      <path d="M12 11v4M10 13h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CatalogIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 14v6M14 17h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}
