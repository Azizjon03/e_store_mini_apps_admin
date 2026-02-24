import { useRef } from 'react';

interface ImageUploadProps {
  images: (File | string)[];
  onChange: (images: (File | string)[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUpload({ images, onChange, maxImages = 10, label = 'Rasmlar' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxImages - images.length;
    if (remaining <= 0) return;
    onChange([...images, ...files.slice(0, remaining)]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const getPreviewUrl = (img: File | string): string => {
    if (typeof img === 'string') return img;
    return URL.createObjectURL(img);
  };

  return (
    <div>
      <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--tg-theme-hint-color)' }}>
        {label} ({images.length}/{maxImages})
      </label>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={getPreviewUrl(img)}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              ×
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ borderColor: 'var(--tg-theme-hint-color)', color: 'var(--tg-theme-hint-color)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAdd}
      />
    </div>
  );
}
