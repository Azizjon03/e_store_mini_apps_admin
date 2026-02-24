interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1 badge-bounce"
      style={{
        backgroundColor: 'var(--mgr-danger)',
        color: '#fff',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
