import { Link, useParams } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice } from '@/lib/utils';

export function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { config } = useShopStore();
  const { identifier } = useParams<{ identifier: string }>();
  const currency = config?.basic?.currency_symbol || 'ج.م';

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />
      <aside className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> سلة التسوق
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!items.length ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-bold">السلة فارغة</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.product.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm line-clamp-2">
                      {item.product.arabic_name || item.product.name}
                    </p>
                    <p className="text-blue-600 font-bold text-sm">
                      {formatPrice(item.product.price, currency)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded bg-white border border-gray-300 font-bold hover:bg-gray-100"
                      >−</button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded bg-white border border-gray-300 font-bold hover:bg-gray-100"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="mr-auto p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-extrabold">
              <span>المجموع:</span>
              <span className="text-blue-600">{formatPrice(getTotal(), currency)}</span>
            </div>
            <Link
              to={`/${identifier}/checkout`}
              onClick={closeCart}
              className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700"
            >
              إتمام الطلب
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}