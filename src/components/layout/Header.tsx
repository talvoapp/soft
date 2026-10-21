import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useShopStore } from '@/store/shopStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const { shopInfo, config } = useShopStore();
  const itemCount = useCartStore(s => s.getItemCount());
  const openCart = useCartStore(s => s.openCart);
  const customer = useAuthStore(s => s.customer);
  const navigate = useNavigate();
  const { identifier } = useParams<{ identifier: string }>();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const header = config?.theme?.header || {};
  const enabled = header.enabled !== false;
  const bgColor = header.bg_color || '#1a1a2e';
  const textColor = header.text_color || '#ffffff';
  const logoText = header.logo_text || shopInfo?.tenant_arabic_name || shopInfo?.tenant_name || 'المتجر';
  const logoImage = header.logo_image || '';

  const base = `/${identifier}`;

  const defaultLinks = [
    { text: 'الرئيسية', url: `${base}` },
    { text: 'المنتجات', url: `${base}/products` },
  ];
  const links = header.links?.length ? header.links : defaultLinks;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`${base}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  if (!enabled) return null;

  return (
    <header className="sticky top-0 z-40 shadow-md" style={{ background: bgColor, color: textColor }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Menu */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to={base} className="flex items-center gap-2">
              {logoImage ? (
                <img src={logoImage} alt={logoText} className="max-h-10" />
              ) : (
                <span className="text-xl font-extrabold">🏪 {logoText}</span>
              )}
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((link: any, i: number) => (
              <Link
                key={i}
                to={link.url?.startsWith('/') ? link.url : `${base}/${link.url || ''}`}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={onSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="px-3 py-1.5 rounded text-gray-900 text-sm w-40 sm:w-64 focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded hover:bg-white/10">
                <Search className="w-5 h-5" />
              </button>
            )}

            <Link to={customer ? `${base}/account` : `${base}/login`} className="p-2 rounded hover:bg-white/10">
              <User className="w-5 h-5" />
            </Link>

            <button onClick={openCart} className="relative p-2 rounded hover:bg-white/10">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20 space-y-2">
            {links.map((link: any, i: number) => (
              <Link
                key={i}
                to={link.url?.startsWith('/') ? link.url : `${base}/${link.url || ''}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 rounded hover:bg-white/10 text-sm font-medium"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}