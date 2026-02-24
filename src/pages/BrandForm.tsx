import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi } from '@/api/brands';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';
import { useRef } from 'react';

export default function BrandForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const haptic = useHaptic();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('active');
  const [logo, setLogo] = useState<File | string | null>(null);

  const { data: brand, isLoading } = useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandsApi.getBrand(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (brand) {
      setName(brand.name || '');
      setDescription(brand.description || '');
      setWebsite(brand.website || '');
      setStatus(brand.status || 'active');
      if (brand.logo) setLogo(brand.logo);
    }
  }, [brand]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? brandsApi.updateBrand(id!, formData) : brandsApi.createBrand(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      haptic.notification('success');
      showToast(isEdit ? 'Brand yangilandi' : 'Brand yaratildi', 'success');
      navigate('/brands');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      showToast('Nom majburiy', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    if (description) formData.append('description', description);
    if (website) formData.append('website', website);
    formData.append('status', status);
    if (logo instanceof File) formData.append('logo', logo);
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={32} /></div>;
  }

  const logoPreview = logo instanceof File ? URL.createObjectURL(logo) : typeof logo === 'string' ? logo : null;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
        {isEdit ? 'Brendni tahrirlash' : 'Yangi brend'}
      </h1>
      <div className="flex flex-col gap-3">
        {/* Logo */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--tg-theme-hint-color)' }}>Logo</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed"
              style={{ borderColor: 'var(--tg-theme-hint-color)' }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🏷️</span>
              )}
            </button>
            {logo && (
              <button type="button" className="text-xs" style={{ color: 'var(--mgr-danger, #ff3b30)' }}
                onClick={() => setLogo(null)}>
                O'chirish
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) setLogo(e.target.files[0]); }} />
        </div>

        <InputField label="Nomi" value={name} onChange={setName} required placeholder="Brand nomi" />
        <InputField label="Tavsif" value={description} onChange={setDescription} multiline placeholder="Brand haqida" />
        <InputField label="Veb-sayt" value={website} onChange={setWebsite} type="url" placeholder="https://..." />
        <SelectField label="Status" value={status} onChange={setStatus}
          options={[{ value: 'active', label: 'Faol' }, { value: 'inactive', label: 'Nofaol' }]} />

        <button className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
        </button>

        {isEdit && (
          <button className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ color: 'var(--mgr-danger, #ff3b30)' }}
            onClick={() => {
              if (confirm('Brendni o\'chirmoqchimisiz?')) {
                brandsApi.deleteBrand(id!).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['brands'] });
                  showToast('Brand o\'chirildi', 'success');
                  navigate('/brands');
                });
              }
            }}>
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
