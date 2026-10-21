import { useEffect, useState } from 'react';
import { useShopStore } from '@/store/shopStore';
import { useMaster } from '@/hooks/useMaster';
import { BlockRenderer } from '@/components/BlockRenderer';
import type { Product, Category } from '@/types';

export function Home() {
  const { config } = useShopStore();
  const master = useMaster();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!master) return;

    let cancelled = false;

    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          master!.get('/api/shop/products', { params: { per_page: 32 } }),
          master!.get('/api/shop/categories'),
        ]);
        if (cancelled) return;
        setProducts(prodRes.data.products || []);
        setCategories(catRes.data.custom_categories || []);
      } catch (err) {
        console.error('Home load failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [master]);

  const layout = config?.homepage_layout || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!layout.length) {
    return (
      <div className="text-center py-32 text-gray-500">
        <p className="text-4xl mb-4">🏪</p>
        <p className="text-lg">المتجر قيد التجهيز</p>
      </div>
    );
  }

  return (
    <>
      {layout
        .filter(s => s.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(section => (
          <BlockRenderer
            key={section.id}
            section={section}
            products={products}
            categories={categories}
          />
        ))}
    </>
  );
}