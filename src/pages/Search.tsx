import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMaster } from '@/hooks/useMaster';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/types';

export function Search() {
  const master = useMaster();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!master || !query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await master!.get('/api/shop/search', { params: { q: query } });
        if (!cancelled) setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [master, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">
        نتائج البحث: "{query}"
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p>لا توجد نتائج لـ "{query}"</p>
        </div>
      ) : (
        <ProductGrid products={products} columns={4} />
      )}
    </div>
  );
}