import { Link, useParams } from 'react-router-dom';
import type { Block, Product, Category } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useShopStore } from '@/store/shopStore';

interface Props {
  section: Block;
  products?: Product[];
  categories?: Category[];
}

// ✅ خرائط ثابتة لكي يكتشفها Tailwind
const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export function BlockRenderer({ section, products = [], categories = [] }: Props) {
  const { config } = useShopStore();
  const { identifier } = useParams<{ identifier: string }>();
  const c = section.config || {};
  const currency = config?.basic?.currency_symbol || 'ج.م';

  switch (section.type) {
    case 'hero':
    case 'hero_split':
      return (
        <section
          className="py-24 px-4"
          style={{
            background: c.bg_image
              ? `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url(${c.bg_image}) center/cover`
              : `linear-gradient(135deg, ${c.bg_color_1 || '#0d6efd'}, ${c.bg_color_2 || '#6f42c1'})`,
            color: c.text_color || '#fff',
            textAlign: (c.text_align as any) || 'center',
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {c.headline || 'مرحباً بكم'}
            </h1>
            {c.subheadline && (
              <p className="text-lg md:text-xl opacity-90 mb-8">{c.subheadline}</p>
            )}
            {c.button_text && (
              <Link
                to={c.button_url || `/${identifier}/products`}
                className="inline-block bg-white px-8 py-3 rounded-lg font-extrabold hover:shadow-xl transition-shadow"
                style={{ color: c.bg_color_1 || '#0d6efd' }}
              >
                {c.button_text}
              </Link>
            )}
          </div>
        </section>
      );

    case 'heading':
      return (
        <div className="container mx-auto px-4 py-4">
          <h2
            className="font-extrabold text-center"
            style={{
              color: c.color || '#1a1a2e',
              fontSize: c.font_size || '32px',
              textAlign: c.text_align || 'center',
            }}
          >
            {c.text || section.title}
          </h2>
        </div>
      );

    case 'text':
      return (
        <div className="container mx-auto px-4 py-4">
          <p
            className="text-base leading-relaxed"
            style={{ color: c.color || '#495057', textAlign: c.text_align || 'right' }}
          >
            {c.content}
          </p>
        </div>
      );

    case 'rich_text':
      return (
        <div
          className="container mx-auto px-4 py-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: c.html || '' }}
        />
      );

    case 'image':
      return (
        <div className="container mx-auto px-4 py-4">
          <div style={{ maxWidth: c.max_width || '800px', margin: '0 auto', textAlign: c.align || 'center' }}>
            {c.src ? (
              <img src={c.src} alt={c.alt || ''} className="w-full h-auto rounded-xl" />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-16 text-center text-gray-400">
                🖼️ لم يتم اختيار صورة
              </div>
            )}
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="text-center py-4" style={{ textAlign: c.align || 'center' }}>
          <Link
            to={c.url || '#'}
            className="inline-block px-8 py-3 rounded-lg font-extrabold bg-blue-600 text-white hover:bg-blue-700"
          >
            {c.text}
          </Link>
        </div>
      );

    case 'divider':
      return (
        <div className="container mx-auto px-4">
          <hr className="border-gray-200 my-6" />
        </div>
      );

    case 'spacer':
      return <div style={{ height: c.height || '50px' }} />;

    case 'list':
      return (
        <div className="container mx-auto px-4 py-4">
          <ul className="space-y-2 pr-6 list-disc" style={{ color: c.color || '#198754' }}>
            {(c.items || []).map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'quote':
      return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <blockquote className="bg-gray-50 border-r-4 border-blue-500 p-6 rounded-lg">
            <p className="text-lg italic text-gray-700 mb-3">"{c.quote}"</p>
            <cite className="text-sm text-gray-500">— {c.author}</cite>
          </blockquote>
        </div>
      );

    case 'alert': {
      const colors: any = {
        info: 'bg-blue-50 text-blue-800',
        success: 'bg-green-50 text-green-800',
        warning: 'bg-yellow-50 text-yellow-800',
        danger: 'bg-red-50 text-red-800',
      };
      return (
        <div className="container mx-auto px-4 py-4">
          <div className={`p-4 rounded-lg font-medium ${colors[c.type] || colors.info}`}>
            {c.text}
          </div>
        </div>
      );
    }

    case 'product_grid':
    case 'featured_products':
    case 'best_sellers':
    case 'new_arrivals':
    case 'sale_products':
    case 'top_rated':
    case 'product_carousel': {
      const limit = c.limit || 8;
      const cols = c.columns || 4;
      let filtered = products;
      if (section.type === 'sale_products' || c.source === 'featured') {
        filtered = products.filter(p => p.has_offer);
      }
      return (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {(c.title || section.title) && (
              <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-gray-900">
                {c.title || section.title}
              </h2>
            )}
            <ProductGrid products={filtered.slice(0, limit)} columns={cols} />
          </div>
        </section>
      );
    }

    case 'featured_product': {
      const p = products[0];
      if (!p) return null;
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl text-gray-300">📦</span>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-extrabold mb-4">{p.arabic_name || p.name}</h2>
                <p className="text-gray-600 mb-6">{p.description}</p>
                <p className="text-3xl font-extrabold text-blue-600 mb-6">
                  {p.price.toFixed(2)} {currency}
                </p>
                <Link
                  to={`/${identifier}/product/${p.id}`}
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700"
                >
                  عرض المنتج
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'categories_grid':
    case 'categories': {
      const cols = c.columns || 4;
      const items = categories.length
        ? categories
        : [
            { name: 'إلكترونيات', icon: '📱' },
            { name: 'ملابس', icon: '👕' },
            { name: 'منزل', icon: '🏠' },
            { name: 'رياضة', icon: '⚽' },
          ];
      const gridClass = GRID_COLS[cols] || GRID_COLS[4];
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-gray-900">
              {c.title || section.title || 'تسوق حسب الأقسام'}
            </h2>
            <div className={`grid grid-cols-2 ${gridClass} gap-4`}>
              {items.slice(0, 8).map((cat: any, i: number) => (
                <Link
                  key={i}
                  to={`/${identifier}/products?category=${cat.id ?? ''}`}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="text-4xl mb-3">{cat.icon || '📁'}</div>
                  <div className="font-bold text-sm">{cat.arabic_name || cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'banner':
      return (
        <div className="container mx-auto px-4 py-8">
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: `linear-gradient(135deg, ${c.bg_color || '#fd7e14'}, #0d6efd)`,
              color: c.text_color || '#fff',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{c.text}</h2>
            {c.subtext && <p className="text-lg opacity-90 mb-6">{c.subtext}</p>}
            {c.button_text && (
              <Link
                to={`/${identifier}/products`}
                className="inline-block bg-white px-8 py-3 rounded-lg font-extrabold"
                style={{ color: c.bg_color || '#fd7e14' }}
              >
                {c.button_text}
              </Link>
            )}
          </div>
        </div>
      );

    case 'promo_strip':
      return (
        <div
          className="py-3 px-4 text-center font-bold text-sm"
          style={{ background: c.bg_color || '#dc3545', color: c.text_color || '#fff' }}
        >
          {c.icon} {c.text}
        </div>
      );

    case 'countdown':
      return (
        <div className="container mx-auto px-4 py-8">
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: c.bg_color || '#dc3545', color: c.text_color || '#fff' }}
          >
            <h3 className="text-2xl font-extrabold mb-6">{c.title}</h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {['يوم', 'ساعة', 'دقيقة', 'ثانية'].map((label, i) => (
                <div key={i} className="bg-white/20 rounded-xl px-6 py-4 min-w-[80px]">
                  <div className="text-3xl font-extrabold">00</div>
                  <div className="text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'newsletter':
      return (
        <div className="container mx-auto px-4 py-8">
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: c.bg_color || '#0d6efd', color: c.text_color || '#fff' }}
          >
            <h3 className="text-2xl font-extrabold mb-3">{c.title}</h3>
            <p className="opacity-90 mb-6">{c.description}</p>
            <form className="max-w-lg mx-auto flex gap-2 flex-wrap" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 min-w-[200px] px-4 py-3 rounded-lg text-gray-900"
              />
              <button
                className="px-6 py-3 bg-white rounded-lg font-extrabold"
                style={{ color: c.bg_color || '#0d6efd' }}
              >
                {c.button_text || 'اشترك'}
              </button>
            </form>
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="text-2xl mb-4">{'⭐'.repeat(c.rating || 5)}</div>
            <p className="text-lg italic text-gray-700 mb-4">"{c.quote}"</p>
            <div className="font-extrabold">{c.author}</div>
            <div className="text-sm text-gray-500 mt-1">{c.role}</div>
          </div>
        </div>
      );

    case 'testimonials_grid': {
      const cols = c.columns || 3;
      const items = [
        { quote: 'خدمة ممتازة!', author: 'أحمد محمد', role: 'عميل' },
        { quote: 'توصيل سريع', author: 'سارة علي', role: 'عميلة' },
        { quote: 'منتجات رائعة', author: 'محمد حسن', role: 'عميل دائم' },
      ];
      const gridClass = GRID_COLS[cols] || GRID_COLS[3];
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-center mb-8">
              {c.title || 'آراء العملاء'}
            </h2>
            <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
              {items.map((t, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-yellow-500 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                  <div className="font-extrabold">{t.author}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'faq':
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-center mb-8">
              {c.title || 'الأسئلة الشائعة'}
            </h2>
            <div className="space-y-3">
              {(c.items || []).map((item: any, i: number) => (
                <details key={i} className="bg-white rounded-xl p-4 cursor-pointer group">
                  <summary className="font-bold text-gray-900">❓ {item.q}</summary>
                  <p className="mt-3 text-gray-600 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case 'social_links': {
      const icons: Record<string, string> = {
        facebook: '📘', instagram: '📸', twitter: '🐦',
        tiktok: '🎵', youtube: '📺', whatsapp: '💬',
      };
      return (
        <div className="py-6 text-center">
          {Object.entries(icons).map(([key, icon]) => {
            const url = c[key];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block m-2 text-2xl hover:scale-110 transition-transform"
              >
                {icon}
              </a>
            );
          })}
        </div>
      );
    }

    case 'contact_form':
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-extrabold text-center mb-6">
              {c.title || 'تواصل معنا'}
            </h2>
            <form className="bg-white rounded-xl p-6 space-y-3" onSubmit={e => e.preventDefault()}>
              <input placeholder="الاسم" className="input-field" />
              <input placeholder="البريد الإلكتروني" type="email" className="input-field" />
              <input placeholder="الهاتف" type="tel" className="input-field" />
              <textarea placeholder="الرسالة" rows={4} className="input-field" />
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700">
                {c.button_text || 'إرسال'}
              </button>
            </form>
          </div>
        </section>
      );

    case 'cta_section':
      return (
        <section
          className="py-16 text-center px-4"
          style={{ background: c.bg_color || '#0d6efd', color: c.text_color || '#fff' }}
        >
          <h2 className="text-4xl font-extrabold mb-3">{c.title}</h2>
          {c.subtitle && <p className="text-lg opacity-90 mb-6">{c.subtitle}</p>}
          {c.button_text && (
            <Link
              to={`/${identifier}/products`}
              className="inline-block bg-white px-8 py-3 rounded-lg font-extrabold"
              style={{ color: c.bg_color || '#0d6efd' }}
            >
              {c.button_text}
            </Link>
          )}
        </section>
      );

    case 'stats':
      return (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-around gap-8">
            {(c.items || []).map((item: any, i: number) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-extrabold text-blue-600">{item.value}</div>
                <div className="text-sm text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'icon':
      return (
        <div className="text-center py-4">
          <span style={{ fontSize: c.size || '48px', color: c.color || '#ffc107' }}>
            {c.icon}
          </span>
        </div>
      );

    case 'icon_box':
      return (
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
            <div className="text-5xl mb-3">{c.icon}</div>
            <h3 className="font-extrabold text-lg mb-2">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.description}</p>
          </div>
        </div>
      );

    case 'video':
      if (!c.url) return null;
      return (
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src={c.url}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      );

    case 'custom_html':
      return (
        <div
          className="container mx-auto px-4 py-4"
          dangerouslySetInnerHTML={{ __html: c.html || '' }}
        />
      );

    case 'columns_2':
    case 'columns_3':
    case 'columns_4': {
      const n = section.type === 'columns_2' ? 2 : section.type === 'columns_3' ? 3 : 4;
      const gridClass = GRID_COLS[n] || GRID_COLS[4];
      return (
        <div className="container mx-auto px-4 py-4">
          <div className={`grid grid-cols-1 ${gridClass} gap-4`}>
            {Array.from({ length: n }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400"
              >
                عمود {i + 1}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'container':
      return (
        <div className="container mx-auto px-4 py-4 bg-gray-50 rounded-lg min-h-[100px] flex items-center justify-center text-gray-400">
          📦 حاوية فارغة
        </div>
      );

    default:
      return null;
  }
}