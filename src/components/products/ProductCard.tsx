import { Link, useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { identifier } = useParams<{ identifier: string }>();
  const { config } = useShopStore();
  const addItem = useCartStore(s => s.addItem);

  const currency = config?.basic?.currency_symbol || 'ج.م';
  const displayPrice = product.price;
  const hasDiscount = product.show_original && product.base_price > product.price;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
      <Link to={`/${identifier}/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.arabic_name || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <span className="text-6xl text-gray-300">📦</span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/${identifier}/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm hover:text-blue-600">
            {product.arabic_name || product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-extrabold text-blue-600">
            {formatPrice(displayPrice, currency)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.base_price, currency)}
            </span>
          )}
        </div>

        {product.warning && (
          <p className="text-xs text-amber-600 mb-2">{product.warning}</p>
        )}

        <button
          onClick={() => addItem(product)}
          disabled={!product.in_stock}
          className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            product.in_stock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.in_stock ? 'أضف للسلة' : 'غير متوفر'}
        </button>
      </div>
    </div>
  );
}