import { Suspense, type ReactNode } from 'react';
import { Spinner } from './Spinner';

export function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size={32} />
        </div>
      }
    >
      <div className="fade-in">{children}</div>
    </Suspense>
  );
}
