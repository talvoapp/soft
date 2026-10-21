import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

const GRID_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: number;
}) {
  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-2">📦</p>
        <p>لا توجد منتجات</p>
      </div>
    );
  }

  const colClass = GRID_COLS[columns] || 'md:grid-cols-4';

  return (
    <div className={`grid grid-cols-2 ${colClass} gap-4`}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}