import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMaster } from '@/hooks/useMaster';

interface CategoryItem {
  id?: number;
  name: string;
  arabic_name?: string;
  icon?: string;
}

export function Categories() {
  const { identifier } = useParams<{ identifier: string }>();
  const master = useMaster();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!master) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await master.get('/api/shop/categories');
        if (cancelled) return;
        const custom = res.data.custom_categories || [];
        const system = res.data.system_categories || [];
        const merged: CategoryItem[] = [
          ...custom.map((c: any) => ({ ...c, icon: c.icon || '📁' })),
          ...system.map((c: any) => ({
            id: c.id,
            name: c.name,
            arabic_name: c.arabic_name,
            icon: '📁',
          })),
        ];
        setCategories(merged);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [master]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-32 text-gray-500">
        <p className="text-4xl mb-4">📂</p>
        <p className="text-lg">لا توجد أقسام</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">الأقسام</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.id ?? i}
            to={`/${identifier}/products?category=${cat.id ?? ''}`}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-500 transition-all"
          >
            <div className="text-5xl mb-3">{cat.icon || '📁'}</div>
            <div className="font-bold text-gray-900">{cat.arabic_name || cat.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}