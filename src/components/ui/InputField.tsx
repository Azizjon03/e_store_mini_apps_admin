interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function InputField({ label, value, onChange, type = 'text', placeholder, required, multiline, rows = 3 }: InputFieldProps) {
  const style = {
    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
    color: 'var(--tg-theme-text-color)',
    border: 'none',
    outline: 'none',
  };

  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
        {label}{required && ' *'}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-lg px-3 py-2.5 text-sm resize-none"
          style={style}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg px-3 py-2.5 text-sm"
          style={style}
        />
      )}
    </div>
  );
}
