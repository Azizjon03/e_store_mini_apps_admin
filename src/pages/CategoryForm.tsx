import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [parentId, setParentId] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState('active');
  const [sortOrder, setSortOrder] = useState('0');

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getCategory(id!),
    enabled: isEdit,
  });

  const { data: allCategories } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => categoriesApi.getCategories(),
  });

  useEffect(() => {
    if (category) {
      setNameUz(category.name?.uz || '');
      setNameRu(category.name?.ru || '');
      setParentId(category.parent_id || '');
      setIcon(category.icon || '');
      setStatus(category.status || 'active');
      setSortOrder(String(category.sort_order || 0));
    }
  }, [category]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? categoriesApi.updateCategory(id!, formData) : categoriesApi.createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      haptic.notification('success');
      showToast(isEdit ? 'Kategoriya yangilandi' : 'Kategoriya yaratildi', 'success');
      navigate('/categories');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const handleSubmit = () => {
    if (!nameUz.trim()) {
      showToast('Nom majburiy', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('name[uz]', nameUz);
    if (nameRu) formData.append('name[ru]', nameRu);
    if (parentId) formData.append('parent_id', parentId);
    if (icon) formData.append('icon', icon);
    formData.append('status', status);
    formData.append('sort_order', sortOrder);
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={32} /></div>;
  }

  // Filter out current category from parent options
  const parentOptions = (allCategories || [])
    .filter((c) => c.id !== id)
    .map((c) => ({ value: c.id, label: c.name?.uz || c.slug }));

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
        {isEdit ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
      </h1>
      <div className="flex flex-col gap-3">
        <InputField label="Nomi (UZ)" value={nameUz} onChange={setNameUz} required placeholder="Kategoriya nomi" />
        <InputField label="Nomi (RU)" value={nameRu} onChange={setNameRu} placeholder="Название категории" />
        <SelectField label="Ota kategoriya" value={parentId} onChange={setParentId} options={parentOptions} placeholder="Asosiy (root)" />
        <InputField label="Ikonka (emoji)" value={icon} onChange={setIcon} placeholder="📁" />
        <SelectField label="Status" value={status} onChange={setStatus}
          options={[{ value: 'active', label: 'Faol' }, { value: 'inactive', label: 'Nofaol' }]} />
        <InputField label="Tartib raqami" value={sortOrder} onChange={setSortOrder} type="number" />

        <button className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
        </button>

        {isEdit && (
          <button className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ color: 'var(--mgr-danger, #ff3b30)' }}
            onClick={() => {
              if (confirm('Kategoriyani o\'chirmoqchimisiz?')) {
                categoriesApi.deleteCategory(id!).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['categories'] });
                  showToast('Kategoriya o\'chirildi', 'success');
                  navigate('/categories');
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
