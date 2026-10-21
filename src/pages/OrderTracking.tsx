import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMaster } from '@/hooks/useMaster';
import { useShopStore } from '@/store/shopStore';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import type { Order } from '@/types';

export function OrderTracking() {
  const { identifier, orderNumber } = useParams<{ identifier: string; orderNumber: string }>();
  const master = useMaster();
  const { config } = useShopStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const currency = config?.basic?.currency_symbol || 'ج.م';

  useEffect(() => {
    if (!master || !orderNumber) return;

    let cancelled = false;
    async function load() {
      try {
        const res = await master!.get(`/api/shop/orders/${orderNumber}`);
        if (!cancelled && res.data.success) setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [master, orderNumber]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-32">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-lg">الطلب غير موجود</p>
        <Link to={`/${identifier}/orders`} className="text-blue-600 hover:underline mt-4 inline-block">
          طلباتي
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/${identifier}/orders`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← العودة لطلباتي
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">{order.order_number}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">المنتجات</div>
            <div className="font-extrabold">{formatPrice(order.subtotal, currency)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">الشحن</div>
            <div className="font-extrabold">{order.shipping ? formatPrice(order.shipping, currency) : 'مجاني'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 col-span-2">
            <div className="text-xs text-gray-500">الإجمالي</div>
            <div className="text-xl font-extrabold text-blue-600">{formatPrice(order.total, currency)}</div>
          </div>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-extrabold text-lg mb-4">المنتجات</h2>
          <div className="space-y-3">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.product_image ? (
                    <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{item.product_arabic_name || item.product_name}</div>
                  <div className="text-sm text-gray-500">الكمية: {item.quantity}</div>
                </div>
                <div className="font-extrabold">{formatPrice(item.total, currency)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}