import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockApi } from '@/api/stock';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useMainButton } from '@/hooks/useMainButton';
import { useHaptic } from '@/hooks/useHaptic';

export default function StockAdjust() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const direction = (searchParams.get('direction') || 'in') as 'in' | 'out';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const { data: balances } = useQuery({
    queryKey: ['stock', 'all'],
    queryFn: () => stockApi.getBalances({ per_page: 100 }),
  });

  const balance = balances?.data.find((b) => b.id === Number(id));

  const mutation = useMutation({
    mutationFn: () =>
      stockApi.adjust(Number(id), {
        direction,
        quantity: parseInt(quantity),
        reason: reason.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      haptic.notification('success');
      showToast(`${direction === 'in' ? 'Kirim' : 'Chiqim'}: ${quantity} dona saqlandi`, 'success');
      navigate(-1);
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const canSubmit = parseInt(quantity) > 0 && !mutation.isPending;

  useMainButton({
    text: 'Saqlash',
    isVisible: true,
    isActive: canSubmit,
    isLoading: mutation.isPending,
    onClick: () => canSubmit && mutation.mutate(),
  });

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-theme-text-color)' }}>
        {direction === 'in' ? 'Kirim' : 'Chiqim'}
      </h1>

      {balance && (
        <div
          className="rounded-xl p-3 mb-4"
          style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
        >
          <p className="text-sm font-medium">{balance.product_id}</p>
          <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Mavjud: {balance.available} dona
          </p>
        </div>
      )}

      {!balance && !balances ? (
        <div className="flex items-center justify-center py-8"><Spinner /></div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
              Miqdor
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              className="w-full rounded-lg p-3 text-base"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
              }}
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
              Sabab (ixtiyoriy)
            </label>
            <textarea
              className="w-full rounded-lg p-3 text-sm resize-none"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
              }}
              rows={2}
              placeholder="Masalan: Yangi partiya keldi"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
