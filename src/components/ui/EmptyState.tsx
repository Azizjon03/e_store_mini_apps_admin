interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 7H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1z" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" />
          <path d="M12 11v4M10 13h4" stroke="var(--tg-theme-hint-color)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h3
        className="text-base font-medium mb-1"
        style={{ color: 'var(--tg-theme-text-color)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-center max-w-[240px]" style={{ color: 'var(--tg-theme-hint-color)' }}>
          {description}
        </p>
      )}
    </div>
  );
}
