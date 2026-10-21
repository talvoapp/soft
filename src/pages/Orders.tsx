import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMaster } from '@/hooks/useMaster';
import { useAuthStore } from '@/store/authStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import type { Order } from '@/types';

export function Orders() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const master = useMaster();
  const token = useAuthStore(s => s.token);
  const { config } = useShopStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const currency = config?.basic?.currency_symbol || 'ج.م';

  useEffect(() => {
    if (!master || !token) {
      navigate(`/${identifier}/login`);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await master!.get('/api/shop/customer/orders');
        if (!cancelled && res.data.success) setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [master, token, identifier, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-32">
        <p className="text-4xl mb-4">📦</p>
        <h1 className="text-2xl font-extrabold mb-2">لا توجد طلبات</h1>
        <Link to={`/${identifier}/products`} className="text-blue-600 hover:underline">
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">طلباتي</h1>
      <div className="space-y-3">
        {orders.map(order => (
          <Link
            key={order.id}
            to={`/${identifier}/orders/${order.order_number}`}
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-extrabold">{order.order_number}</div>
                <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">{order.items_count || 0} منتجات</span>
              <span className="text-lg font-extrabold text-blue-600">
                {formatPrice(order.total, currency)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}