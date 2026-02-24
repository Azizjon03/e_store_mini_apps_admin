import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: Toast['type']) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'info') => {
    const id = Date.now().toString();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function showToast(message: string, type: Toast['type'] = 'info') {
  useToastStore.getState().add(message, type);
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col gap-2 p-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-slide-down rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
          style={{
            backgroundColor:
              toast.type === 'success' ? 'var(--mgr-success)'
              : toast.type === 'error' ? 'var(--mgr-danger)'
              : 'var(--tg-theme-button-color)',
            color: '#fff',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
