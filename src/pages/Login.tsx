import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMaster } from '@/hooks/useMaster';
import { useAuthStore } from '@/store/authStore';
import { useShopStore } from '@/store/shopStore';

export function Login() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const master = useMaster();
  const setAuth = useAuthStore(s => s.setAuth);
  const { config } = useShopStore();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: '', password: '' });

  const systemConfig = config?.theme?.system_pages?.login || {};
  const showHeader = systemConfig.show_header !== false;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!master) return;

    try {
      setLoading(true);
      const res = await master.post('/api/shop/customer/login', form);

      if (res.data.success) {
        setAuth(res.data.token, res.data.customer);
        toast.success(`أهلاً ${res.data.customer.name}`);
        navigate(`/${identifier}/account`);
      } else {
        toast.error(res.data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err: any) {
      if (err.response?.data?.pending_approval) {
        toast.error('حسابك قيد المراجعة. سيتم تفعيله قريباً.');
      } else if (err.response?.data?.suspended) {
        toast.error('حسابك موقوف. تواصل مع الإدارة.');
      } else {
        toast.error(err.response?.data?.message || 'فشل تسجيل الدخول');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center mb-6">تسجيل الدخول</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">كلمة المرور</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ليس لديك حساب؟{' '}
          <Link to={`/${identifier}/register`} className="text-blue-600 font-bold hover:underline">
            سجل الآن
          </Link>
        </p>
      </div>
    </div>
  );
}