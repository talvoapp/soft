import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useShopStore } from '@/store/shopStore';
import { useMaster } from '@/hooks/useMaster';
import { formatPrice } from '@/lib/utils';

export function Checkout() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const master = useMaster();
  const { config } = useShopStore();
  const customer = useAuthStore(s => s.customer);
  const { items, getTotal, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: '',
    notes: '',
  });

  const currency = config?.basic?.currency_symbol || 'ج.م';
  const orders = config?.orders;
  const total = getTotal();
  const shipping = orders?.free_shipping_threshold && total >= orders.free_shipping_threshold
    ? 0
    : (orders?.shipping_fees || 0);
  const grandTotal = total + shipping;

  if (!items.length) {
    navigate(`/${identifier}/cart`);
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!master) return;

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('الاسم والهاتف مطلوبان');
      return;
    }

    try {
      setLoading(true);
      const res = await master.post('/api/shop/orders', {
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        customer: form,
        payment_method: 'cash',
        notes: form.notes,
      });

      if (res.data.success) {
        clearCart();
        toast.success('تم استلام طلبك بنجاح!');
        navigate(`/${identifier}/orders/${res.data.order.order_number}`);
      } else {
        toast.error(res.data.message || 'فشل الطلب');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل إنشاء الطلب';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">إتمام الطلب</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={submit} className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block font-bold text-sm mb-2">الاسم *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-2">الهاتف *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-2">العنوان</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-2">ملاحظات</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
          </button>
        </form>

        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h2 className="font-extrabold text-lg mb-4">ملخص الطلب</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span>المنتجات:</span><span>{formatPrice(total, currency)}</span></div>
            <div className="flex justify-between"><span>الشحن:</span><span>{shipping ? formatPrice(shipping, currency) : 'مجاني'}</span></div>
          </div>
          <div className="pt-4 border-t border-gray-300 flex justify-between font-extrabold text-lg">
            <span>الإجمالي:</span>
            <span className="text-blue-600">{formatPrice(grandTotal, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}