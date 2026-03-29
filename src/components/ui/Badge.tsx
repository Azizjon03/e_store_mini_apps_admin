interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="absolute -top-1 -right-2 min-w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold px-1 badge-bounce"
      style={{
        backgroundColor: 'var(--mgr-danger)',
        color: 'var(--tg-theme-button-text-color)',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
