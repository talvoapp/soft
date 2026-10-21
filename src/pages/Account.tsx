import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LogOut, User, Package, MapPin, Lock, Edit2, Save, X, Plus, Trash2,
} from 'lucide-react';
import { useMaster } from '@/hooks/useMaster';
import { useAuthStore } from '@/store/authStore';
import { useShopStore } from '@/store/shopStore';
import { formatPrice } from '@/lib/utils';

interface Address {
  id: string;
  label: string;
  address: string;
  phone: string;
  is_default: boolean;
}

export function Account() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const master = useMaster();
  const { token, customer, setAuth, logout } = useAuthStore();
  const { config } = useShopStore();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // تعديل الملف
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', address: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  // كلمة المرور
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // العناوين
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState({
    label: '',
    address: '',
    phone: '',
  });
  const [addressOpen, setAddressOpen] = useState(false);

  const currency = config?.basic?.currency_symbol || 'ج.م';

  useEffect(() => {
    if (!master || !token) {
      navigate(`/${identifier}/login`);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [profileRes, addrRes] = await Promise.all([
          master!.get('/api/shop/customer/profile'),
          master!
            .get('/api/shop/customer/addresses')
            .catch(() => ({ data: { addresses: [] } })),
        ]);

        if (cancelled) return;

        if (profileRes.data.success) {
          setProfile(profileRes.data);
          setAuth(token!, profileRes.data.customer);
          setEditForm({
            name: profileRes.data.customer.name || '',
            email: profileRes.data.customer.email || '',
            address: profileRes.data.customer.address || '',
          });
        }
        setAddresses(addrRes.data.addresses || []);
      } catch (err: any) {
        if (err.response?.status === 401) {
          logout();
          navigate(`/${identifier}/login`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [master, token, identifier, navigate, setAuth, logout]);

  const handleSaveProfile = async () => {
    if (!master) return;
    try {
      setSavingEdit(true);
      await master.put('/api/shop/customer/profile', editForm);
      toast.success('تم حفظ البيانات');
      setEditing(false);

      const res = await master.get('/api/shop/customer/profile');
      if (res.data.success) {
        setProfile(res.data);
        setAuth(token!, res.data.customer);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleChangePassword = async () => {
    if (!master) return;

    if (passwordForm.new_password !== passwordForm.confirm) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error('كلمة المرور 6 أحرف على الأقل');
      return;
    }

    try {
      setChangingPassword(true);
      await master.put('/api/shop/customer/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success('تم تغيير كلمة المرور');
      setPasswordOpen(false);
      setPasswordForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل التغيير');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddAddress = async () => {
    if (!master) return;
    if (!addressForm.address.trim()) {
      toast.error('العنوان مطلوب');
      return;
    }
    try {
      const res = await master.post('/api/shop/customer/addresses', addressForm);
      setAddresses([...addresses, res.data.address]);
      setAddressForm({ label: '', address: '', phone: '' });
      setAddressOpen(false);
      toast.success('تم إضافة العنوان');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل الإضافة');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!master) return;
    if (!window.confirm('حذف هذا العنوان؟')) return;

    try {
      await master.delete(`/api/shop/customer/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('تم الحذف');
    } catch {
      toast.error('فشل الحذف');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const c = profile?.customer || customer;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{c?.name}</h1>
            <p className="opacity-90 text-sm">{c?.phone}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-blue-600">
            {c?.bonus_points || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">نقاط البونص</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-green-600">
            {formatPrice(c?.bonus_balance || 0, currency)}
          </div>
          <div className="text-xs text-gray-500 mt-1">رصيد البونص</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-purple-600">
            {formatPrice(c?.total_purchases || 0, currency)}
          </div>
          <div className="text-xs text-gray-500 mt-1">إجمالي المشتريات</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-amber-600">
            {c?.purchase_count || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">عدد الطلبات</div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white border rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg">بياناتي</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-blue-600 text-sm font-bold"
            >
              <Edit2 className="w-4 h-4" /> تعديل
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={savingEdit}
                className="flex items-center gap-1 text-green-600 text-sm font-bold disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> حفظ
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-gray-600 text-sm font-bold"
              >
                <X className="w-4 h-4" /> إلغاء
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">الاسم:</span>
              <span className="font-bold">{c?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الهاتف:</span>
              <span className="font-bold">{c?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">البريد:</span>
              <span className="font-bold">{c?.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الرصيد:</span>
              <span className="font-bold text-blue-600">
                {formatPrice(c?.balance || 0, currency)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1">الاسم</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">البريد</label>
              <input
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">العنوان</label>
              <input
                type="text"
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="bg-white border rounded-xl p-6 mb-4">
        <button
          onClick={() => setPasswordOpen(!passwordOpen)}
          className="flex items-center justify-between w-full"
        >
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <Lock className="w-5 h-5" /> تغيير كلمة المرور
          </h2>
          <span className="text-gray-400">{passwordOpen ? '−' : '+'}</span>
        </button>

        {passwordOpen && (
          <div className="space-y-3 mt-4">
            <input
              type="password"
              placeholder="كلمة المرور الحالية"
              value={passwordForm.current_password}
              onChange={e =>
                setPasswordForm({ ...passwordForm, current_password: e.target.value })
              }
              className="input-field"
            />
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={passwordForm.new_password}
              onChange={e =>
                setPasswordForm({ ...passwordForm, new_password: e.target.value })
              }
              className="input-field"
            />
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={passwordForm.confirm}
              onChange={e =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
              className="input-field"
            />
            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {changingPassword ? 'جاري...' : 'تغيير'}
            </button>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-white border rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" /> عناويني
          </h2>
          <button
            onClick={() => setAddressOpen(!addressOpen)}
            className="flex items-center gap-1 text-blue-600 text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> إضافة
          </button>
        </div>

        {addressOpen && (
          <div className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="الاسم (المنزل، العمل...)"
              value={addressForm.label}
              onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="العنوان"
              value={addressForm.address}
              onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="الهاتف"
              value={addressForm.phone}
              onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddAddress}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                حفظ
              </button>
              <button
                onClick={() => setAddressOpen(false)}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            لا توجد عناوين محفوظة
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{addr.label}</div>
                  <div className="text-xs text-gray-600">{addr.address}</div>
                  {addr.phone && (
                    <div className="text-xs text-gray-500">{addr.phone}</div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={`/${identifier}/orders`}
          className="bg-white border rounded-xl p-4 text-center hover:border-blue-500 transition-colors"
        >
          <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="font-bold text-sm">طلباتي</div>
        </Link>

        <button
          onClick={() => {
            logout();
            navigate(`/${identifier}`);
          }}
          className="bg-white border rounded-xl p-4 text-center hover:border-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <div className="font-bold text-sm">تسجيل خروج</div>
        </button>
      </div>
    </div>
  );
}