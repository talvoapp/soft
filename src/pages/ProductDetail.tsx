import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useMaster } from '@/hooks/useMaster';
import { useCartStore } from '@/store/cartStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductDetail() {
  const { productId, identifier } = useParams<{ productId: string; identifier: string }>();
  const master = useMaster();
  const { config } = useShopStore();
  const addItem = useCartStore(s => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!master || !productId) return;

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await master!.get(`/api/shop/products/${productId}`);
        if (!cancelled) setProduct(res.data.product);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [master, productId]);

  const currency = config?.basic?.currency_symbol || 'ج.م';

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-lg">المنتج غير موجود</p>
        <Link to={`/${identifier}/products`} className="text-blue-600 hover:underline mt-4 inline-block">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to={`/${identifier}/products`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowRight className="w-4 h-4" /> العودة للمنتجات
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.arabic_name || product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-32 h-32 text-gray-300" />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-extrabold mb-4">{product.arabic_name || product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-blue-600">
              {formatPrice(product.price, currency)}
            </span>
            {product.show_original && product.base_price > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.base_price, currency)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-bold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
              {product.in_stock ? `✅ متوفر (${product.quantity})` : '❌ غير متوفر'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <label className="font-bold text-sm">الكمية:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-100 font-bold">−</button>
              <span className="px-4 py-2 font-bold min-w-[40px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-gray-100 font-bold">+</button>
            </div>
          </div>

          <button
            onClick={() => { addItem(product, quantity); setQuantity(1); }}
            disabled={!product.in_stock}
            className={`w-full py-4 rounded-lg font-extrabold flex items-center justify-center gap-2 transition-all ${
              product.in_stock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.in_stock ? 'أضف للسلة' : 'غير متوفر'}
          </button>
        </div>
      </div>
    </div>
  );
}