import { Outlet, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useShopBootstrap } from '@/hooks/useShopBootstrap';
import { useShopStore } from '@/store/shopStore';
import { useCartStore } from '@/store/cartStore';

export function Layout() {
  const { identifier } = useParams<{ identifier: string }>();
  const { shopInfo, config, loading, error } = useShopStore();
  const setTenant = useCartStore(s => s.setTenant);

  useShopBootstrap(identifier);

  // ✅ عزل السلة per tenant
  useEffect(() => {
    if (identifier) setTenant(identifier);
  }, [identifier, setTenant]);

  // ✅ SEO
  const seoTitle = config?.seo?.title
    || config?.basic?.shop_name
    || shopInfo?.tenant_name
    || 'المتجر';

  const seoDesc = config?.seo?.description
    || config?.basic?.description
    || '';

  const seoKeywords = config?.seo?.keywords || '';

  const seoImage = config?.basic?.cover || '';

  // ✅ Custom CSS
  useEffect(() => {
    const css = config?.theme?.custom_css;
    if (!css) return;

    const style = document.createElement('style');
    style.id = 'talvo-custom-css';
    style.innerHTML = css;
    document.head.appendChild(style);

    return () => {
      document.getElementById('talvo-custom-css')?.remove();
    };
  }, [config?.theme?.custom_css]);

  if (loading || !shopInfo || !config) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {seoImage && <meta property="og:image" content={seoImage} />}
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartSidebar />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </div>
    </>
  );
}