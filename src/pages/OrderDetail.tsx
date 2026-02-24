import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { formatPrice } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  const [cancelSheet, setCancelSheet] = useState(false);
  const [returnSheet, setReturnSheet] = useState(false);
  const [reason, setReason] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(Number(id)),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['order', id] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => ordersApi.updateStatus(Number(id), status),
    onSuccess: () => {
      invalidate();
      haptic.notification('success');
      showToast('Status o\'zgartirildi', 'success');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => ordersApi.cancel(Number(id), reason),
    onSuccess: () => {
      invalidate();
      setCancelSheet(false);
      setReason('');
      haptic.notification('success');
      showToast('Buyurtma bekor qilindi', 'success');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const returnMutation = useMutation({
    mutationFn: (reason: string) => ordersApi.return_(Number(id), reason),
    onSuccess: () => {
      invalidate();
      setReturnSheet(false);
      setReason('');
      haptic.notification('success');
      showToast('Buyurtma qaytarildi', 'success');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (action: 'verify' | 'reject') => ordersApi.verifyPayment(Number(id), action),
    onSuccess: (_, action) => {
      invalidate();
      haptic.notification('success');
      showToast(action === 'verify' ? 'To\'lov tasdiqlandi' : 'To\'lov rad etildi', 'success');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
          #{order.order_number}
        </h1>
        <StatusBadge status={order.status} label={order.status_label} />
      </div>

      {/* Customer */}
      {order.user && (
        <Section title="Mijoz">
          <p className="text-sm font-medium">{order.user.name}</p>
          <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>{order.user.phone}</p>
          {order.customer_note && (
            <p className="text-xs mt-1 italic" style={{ color: 'var(--tg-theme-hint-color)' }}>"{order.customer_note}"</p>
          )}
        </Section>
      )}

      {/* Items */}
      <Section title="Mahsulotlar">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-1.5">
            <div>
              <span className="text-sm">{item.product_name}</span>
              <span className="text-xs ml-1" style={{ color: 'var(--tg-theme-hint-color)' }}>x{item.quantity}</span>
            </div>
            <span className="text-sm font-medium">{formatPrice(item.total)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--tg-theme-hint-color)', opacity: 0.2 }}>
          {order.discount_amount > 0 && <PriceLine label="Chegirma" value={`-${formatPrice(order.discount_amount)}`} />}
          {order.delivery_fee > 0 && <PriceLine label="Yetkazish" value={formatPrice(order.delivery_fee)} />}
          <div className="flex justify-between mt-1">
            <span className="text-sm font-bold">Jami</span>
            <span className="text-sm font-bold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </Section>

      {/* Payment */}
      <Section title="To'lov">
        <div className="flex items-center justify-between">
          <span className="text-sm">{order.payment_method || 'Ko\'rsatilmagan'}</span>
          <StatusBadge status={order.payment_status} label={order.payment_status_label} />
        </div>
        {order.payment_note && (
          <p className="text-xs mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>Izoh: {order.payment_note}</p>
        )}
      </Section>

      {/* Status actions */}
      {order.allowed_transitions.length > 0 && (
        <Section title="Statusni o'zgartirish">
          <div className="flex flex-wrap gap-2">
            {order.allowed_transitions
              .filter((t) => t.value !== 'cancelled' && t.value !== 'refunded')
              .map((transition) => (
                <button
                  key={transition.value}
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: 'var(--tg-theme-button-color)',
                    color: 'var(--tg-theme-button-text-color)',
                  }}
                  onClick={() => statusMutation.mutate({ status: transition.value })}
                  disabled={statusMutation.isPending}
                >
                  {transition.label}
                </button>
              ))}
          </div>
        </Section>
      )}

      {/* Cancel / Return / Payment buttons */}
      <div className="flex flex-col gap-2 mt-4">
        {order.requires_payment_verify && (
          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--mgr-success)', color: '#fff' }}
              onClick={() => paymentMutation.mutate('verify')}
              disabled={paymentMutation.isPending}
            >
              To'lovni tasdiqlash
            </button>
            <button
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--mgr-danger)', color: '#fff' }}
              onClick={() => paymentMutation.mutate('reject')}
              disabled={paymentMutation.isPending}
            >
              Rad etish
            </button>
          </div>
        )}

        {order.can_cancel && (
          <button
            className="w-full px-3 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--mgr-danger)', color: '#fff' }}
            onClick={() => setCancelSheet(true)}
          >
            Bekor qilish
          </button>
        )}

        {order.can_return && (
          <button
            className="w-full px-3 py-2.5 rounded-lg text-sm font-medium border"
            style={{
              borderColor: 'var(--mgr-warning)',
              color: 'var(--mgr-warning)',
              backgroundColor: 'transparent',
            }}
            onClick={() => setReturnSheet(true)}
          >
            Qaytarish
          </button>
        )}
      </div>

      {/* Cancel BottomSheet */}
      <BottomSheet isOpen={cancelSheet} onClose={() => setCancelSheet(false)} title="Bekor qilish sababi">
        <textarea
          className="w-full rounded-lg p-3 text-sm resize-none"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            border: 'none',
            outline: 'none',
          }}
          rows={3}
          placeholder="Sabab yozing..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button
          className="w-full mt-3 px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--mgr-danger)', color: '#fff' }}
          onClick={() => reason.trim() && cancelMutation.mutate(reason.trim())}
          disabled={!reason.trim() || cancelMutation.isPending}
        >
          {cancelMutation.isPending ? 'Kutilmoqda...' : 'Bekor qilish'}
        </button>
      </BottomSheet>

      {/* Return BottomSheet */}
      <BottomSheet isOpen={returnSheet} onClose={() => setReturnSheet(false)} title="Qaytarish sababi">
        <textarea
          className="w-full rounded-lg p-3 text-sm resize-none"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            border: 'none',
            outline: 'none',
          }}
          rows={3}
          placeholder="Sabab yozing..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button
          className="w-full mt-3 px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--mgr-warning)', color: '#fff' }}
          onClick={() => reason.trim() && returnMutation.mutate(reason.trim())}
          disabled={!reason.trim() || returnMutation.isPending}
        >
          {returnMutation.isPending ? 'Kutilmoqda...' : 'Qaytarish'}
        </button>
      </BottomSheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
        {title}
      </h3>
      <div
        className="rounded-xl p-3"
        style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
      >
        {children}
      </div>
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-xs" style={{ color: 'var(--tg-theme-hint-color)' }}>{label}</span>
      <span className="text-xs">{value}</span>
    </div>
  );
}
