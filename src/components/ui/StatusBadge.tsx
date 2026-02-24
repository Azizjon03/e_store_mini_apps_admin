import type { OrderStatus, PaymentVerifyStatus } from '@/types';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  processing: { bg: '#e0e7ff', text: '#3730a3' },
  shipped: { bg: '#fce7f3', text: '#9d174d' },
  delivered: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
  refunded: { bg: '#f3e8ff', text: '#6b21a8' },
  verified: { bg: '#d1fae5', text: '#065f46' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
};

interface StatusBadgeProps {
  status: OrderStatus | PaymentVerifyStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = statusColors[status] || { bg: '#f3f4f6', text: '#374151' };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}
