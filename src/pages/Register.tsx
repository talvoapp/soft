import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMaster } from '@/hooks/useMaster';

export function Register() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const master = useMaster();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!master) return;

    if (form.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      setLoading(true);
      const res = await master.post('/api/shop/customer/register', form);

      if (res.data.success) {
        toast.success('تم التسجيل! في انتظار موافقة الإدارة.');
        navigate(`/${identifier}/login`);
      } else {
        toast.error(res.data.message || 'فشل التسجيل');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center mb-6">إنشاء حساب جديد</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">الاسم *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">رقم الهاتف *</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">كلمة المرور *</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" required minLength={6} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700 disabled:bg-gray-300">
            {loading ? 'جاري التسجيل...' : 'تسجيل'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          لديك حساب؟{' '}
          <Link to={`/${identifier}/login`} className="text-blue-600 font-bold hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}