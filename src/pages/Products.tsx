import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMaster } from '@/hooks/useMaster';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/types';

export function Products() {
  const master = useMaster();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    if (!master) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const params: any = { page, per_page: 24 };
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;

        const res = await master!.get('/api/shop/products', { params });
        if (cancelled) return;
        setProducts(res.data.products || []);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [master, search, categoryId, page]);

  const goToPage = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-2">
        {search ? `نتائج البحث: "${search}"` : 'كل المنتجات'}
      </h1>

      {total > 0 && (
        <p className="text-sm text-gray-500 mb-6">
          {total} منتج
        </p>
      )}

      {search && (
        <button
          onClick={() => setSearchParams({})}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ✕ إلغاء البحث
        </button>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <ProductGrid products={products} columns={4} />

          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                السابق
              </button>

              <span className="font-bold text-gray-700">
                صفحة {page} من {pages}
              </span>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === pages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}