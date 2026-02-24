import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { categoriesApi } from '@/api/categories';
import { brandsApi } from '@/api/brands';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { useHaptic } from '@/hooks/useHaptic';
import type { LocalizedField } from '@/types';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const haptic = useHaptic();

  const [name, setName] = useState<LocalizedField>({ uz: '' });
  const [description, setDescription] = useState<LocalizedField>({ uz: '' });
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<(File | string)[]>([]);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id!),
    enabled: isEdit,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => categoriesApi.getCategories({ status: 'active' }),
  });

  const { data: brands } = useQuery({
    queryKey: ['brands-list'],
    queryFn: () => brandsApi.getBrands({ status: 'active', per_page: 100 }),
  });

  useEffect(() => {
    if (product) {
      setName(product.name || { uz: '' });
      setDescription(product.description || { uz: '' });
      setPrice(String(product.price || ''));
      setComparePrice(String(product.compare_price || ''));
      setSku(product.sku || '');
      setCategoryId(product.category_id || '');
      setBrandId(product.brand_id || '');
      setStatus(product.status || 'active');
      setIsFeatured(product.is_featured || false);
      setImages(product.images || []);
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit ? productsApi.updateProduct(id!, formData) : productsApi.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      haptic.notification('success');
      showToast(isEdit ? 'Mahsulot yangilandi' : 'Mahsulot yaratildi', 'success');
      navigate('/products');
    },
    onError: () => {
      haptic.notification('error');
      showToast('Xatolik yuz berdi', 'error');
    },
  });

  const handleSubmit = () => {
    if (!name.uz.trim() || !price) {
      showToast('Nom va narx majburiy', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name[uz]', name.uz);
    if (name.ru) formData.append('name[ru]', name.ru);
    if (name.en) formData.append('name[en]', name.en);
    if (description.uz) formData.append('description[uz]', description.uz);
    formData.append('price', price);
    if (comparePrice) formData.append('compare_price', comparePrice);
    if (sku) formData.append('sku', sku);
    if (categoryId) formData.append('category_id', categoryId);
    if (brandId) formData.append('brand_id', brandId);
    formData.append('status', status);
    formData.append('is_featured', isFeatured ? '1' : '0');

    // Separate existing URLs and new File objects
    const existingImages: string[] = [];
    const newFiles: File[] = [];
    images.forEach((img) => {
      if (typeof img === 'string') existingImages.push(img);
      else newFiles.push(img);
    });

    existingImages.forEach((url, i) => formData.append(`existing_images[${i}]`, url));
    newFiles.forEach((file, i) => formData.append(`images[${i}]`, file));

    mutation.mutate(formData);
  };

  if (isEdit && productLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size={32} /></div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
        {isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
      </h1>

      <div className="flex flex-col gap-3">
        <InputField label="Nomi (UZ)" value={name.uz} onChange={(v) => setName({ ...name, uz: v })} required placeholder="Mahsulot nomi" />
        <InputField label="Nomi (RU)" value={name.ru || ''} onChange={(v) => setName({ ...name, ru: v })} placeholder="Название товара" />
        <InputField label="Tavsif (UZ)" value={description.uz || ''} onChange={(v) => setDescription({ ...description, uz: v })} multiline placeholder="Mahsulot tavsifi" />
        <InputField label="Narxi" value={price} onChange={setPrice} type="number" required placeholder="0" />
        <InputField label="Eski narxi" value={comparePrice} onChange={setComparePrice} type="number" placeholder="0" />
        <InputField label="SKU" value={sku} onChange={setSku} placeholder="Artikul" />

        <SelectField
          label="Kategoriya"
          value={categoryId}
          onChange={setCategoryId}
          options={(categories || []).map((c) => ({ value: c.id, label: c.name?.uz || c.slug }))}
        />

        <SelectField
          label="Brand"
          value={brandId}
          onChange={setBrandId}
          options={(brands?.data || []).map((b) => ({ value: b.id, label: b.name }))}
        />

        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'active', label: 'Faol' },
            { value: 'inactive', label: 'Nofaol' },
            { value: 'draft', label: 'Qoralama' },
          ]}
        />

        {/* Featured toggle */}
        <button
          type="button"
          className="flex items-center justify-between rounded-xl p-3"
          style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
          onClick={() => setIsFeatured(!isFeatured)}
        >
          <span className="text-sm" style={{ color: 'var(--tg-theme-text-color)' }}>Tavsiya etilgan</span>
          <div
            className="w-12 h-7 rounded-full relative transition-colors"
            style={{ backgroundColor: isFeatured ? 'var(--mgr-success, #34c759)' : 'var(--tg-theme-hint-color)' }}
          >
            <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
              style={{ transform: isFeatured ? 'translateX(22px)' : 'translateX(2px)' }} />
          </div>
        </button>

        <ImageUpload images={images} onChange={setImages} maxImages={10} />

        <button
          className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
          style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
        </button>

        {isEdit && (
          <button
            className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ color: 'var(--mgr-danger, #ff3b30)' }}
            onClick={() => {
              if (confirm('Mahsulotni o\'chirmoqchimisiz?')) {
                productsApi.deleteProduct(id!).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['products'] });
                  showToast('Mahsulot o\'chirildi', 'success');
                  navigate('/products');
                });
              }
            }}
          >
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
