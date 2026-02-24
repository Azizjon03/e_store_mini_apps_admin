import { useEffect, type ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl slide-up"
        style={{
          backgroundColor: 'var(--tg-theme-bg-color)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--tg-theme-hint-color)', opacity: 0.3 }} />
        </div>
        <h3
          className="text-base font-semibold px-4 pb-3"
          style={{ color: 'var(--tg-theme-text-color)' }}
        >
          {title}
        </h3>
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
