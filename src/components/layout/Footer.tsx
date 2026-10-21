import { Link, useParams } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';

export function Footer() {
  const { config, shopInfo } = useShopStore();
  const { identifier } = useParams<{ identifier: string }>();

  const footer = config?.theme?.footer || {};
  if (footer.enabled === false) return null;

  const bgColor = footer.bg_color || '#f8f9fa';
  const textColor = footer.text_color || '#6c757d';
  const base = `/${identifier}`;
  const contact = config?.contact || {};
  const basic = config?.basic || {};
  const social = contact.social_links || {};

  const socialIcons: Record<string, { icon: string; color: string }> = {
    facebook: { icon: '📘', color: '#1877f2' },
    instagram: { icon: '📸', color: '#e4405f' },
    twitter: { icon: '🐦', color: '#1da1f2' },
    tiktok: { icon: '🎵', color: '#000000' },
    youtube: { icon: '📺', color: '#ff0000' },
    whatsapp: { icon: '💬', color: '#25d366' },
  };

  return (
    <footer className="mt-16 border-t border-gray-200" style={{ background: bgColor, color: textColor }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-3">
              {basic.shop_name || shopInfo?.tenant_name}
            </h3>
            <p className="text-sm leading-relaxed">
              {basic.description || 'تسوق أفضل المنتجات بأسعار ممتازة'}
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-3">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to={`${base}`} className="hover:underline">الرئيسية</Link></li>
              <li><Link to={`${base}/products`} className="hover:underline">المنتجات</Link></li>
              <li><Link to={`${base}/account`} className="hover:underline">حسابي</Link></li>
              <li><Link to={`${base}/orders`} className="hover:underline">طلباتي</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-3">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              {contact.phone && <li>📞 {contact.phone}</li>}
              {contact.email && <li>📧 {contact.email}</li>}
              {contact.address && <li>📍 {contact.address}</li>}
            </ul>
            <div className="flex gap-2 mt-4">
              {Object.entries(socialIcons).map(([key, val]) => {
                const url = social[key];
                if (!url) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ background: val.color }}
                  >
                    {val.icon}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-300 text-center text-xs">
          {footer.text || `© ${new Date().getFullYear()} جميع الحقوق محفوظة`}
        </div>
      </div>
    </footer>
  );
}