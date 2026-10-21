import { Link, useParams } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice } from '@/lib/utils';

export function Cart() {
  const { identifier } = useParams<{ identifier: string }>();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { config } = useShopStore();
  const currency = config?.basic?.currency_symbol || 'ج.م';

  if (!items.length) {
    return (
      <div className="text-center py-32">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold mb-2">السلة فارغة</h1>
        <p className="text-gray-600 mb-6">ابدأ التسوق الآن</p>
        <Link to={`/${identifier}/products`} className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">سلة التسوق</h1>

      <div className="space-y-3 mb-8">
        {items.map(item => (
          <div key={item.product.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.product.image_url ? (
                <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">{item.product.arabic_name || item.product.name}</h3>
              <p className="text-blue-600 font-extrabold">{formatPrice(item.product.price, currency)}</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 border rounded hover:bg-gray-50">−</button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50">+</button>
                <button onClick={() => removeItem(item.product.id)} className="mr-auto text-red-600 p-2 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="font-extrabold text-lg">
              {formatPrice(item.product.price * item.quantity, currency)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex justify-between mb-4 text-xl font-extrabold">
          <span>المجموع:</span>
          <span className="text-blue-600">{formatPrice(getTotal(), currency)}</span>
        </div>
        <Link to={`/${identifier}/checkout`} className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700">
          إتمام الطلب
        </Link>
      </div>
    </div>
  );
}