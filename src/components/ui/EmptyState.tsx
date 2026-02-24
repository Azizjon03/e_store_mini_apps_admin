interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-4xl mb-3">{icon}</span>
      <h3
        className="text-base font-medium mb-1"
        style={{ color: 'var(--tg-theme-text-color)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-center" style={{ color: 'var(--tg-theme-hint-color)' }}>
          {description}
        </p>
      )}
    </div>
  );
}
