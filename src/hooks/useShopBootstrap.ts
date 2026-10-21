import { useEffect } from 'react';
import { resolveShop } from '@/lib/cloudApi';
import { createMasterClient } from '@/lib/masterApi';
import { useShopStore } from '@/store/shopStore';
import type { ShopConfig } from '@/types';

export function useShopBootstrap(identifier: string | undefined) {
  const {
    setShop,
    setLoading,
    setError,
    shopInfo,
    identifier: currentId,
  } = useShopStore();

  useEffect(() => {
    // ✅ تحقق من وجود identifier
    if (!identifier) {
      setError('معرف المتجر غير موجود');
      return;
    }

    // ✅ تجنب إعادة التحميل لنفس المتجر
    if (shopInfo && currentId === identifier) return;

    // ✅ type narrowing — الآن TypeScript يعرف أن identifier = string
    const shopId: string = identifier;

    let cancelled = false;

    async function boot() {
      try {
        setLoading(true);
        setError(null);

        // 1. Resolve shop URL from cloud
        const info = await resolveShop(shopId);

        if (!info?.shop_url) {
          throw new Error('رابط المتجر غير متوفر');
        }

        // 2. Fetch full shop config from master
        const master = createMasterClient(info.shop_url);
        const configRes = await master.get('/api/shop/config');

        if (!configRes.data?.success) {
          throw new Error('فشل تحميل إعدادات المتجر');
        }

        // 3. Extract config (with fallbacks)
        const config: ShopConfig = {
          basic: configRes.data.basic || {},
          contact: configRes.data.contact || {},
          theme: configRes.data.theme || {},
          display: configRes.data.display || {},
          orders: configRes.data.orders || {},
          customers: configRes.data.customers || {},
          seo: configRes.data.seo || {},
          pages: configRes.data.pages || [],
          categories: configRes.data.categories || [],
          homepage_layout: configRes.data.homepage_layout || [],
        };

        if (!cancelled) {
          setShop(shopId, info, config);
        }
      } catch (err: any) {
        if (cancelled) return;

        const status = err.response?.status;
        let msg = 'فشل الاتصال بالخادم';

        if (status === 403) msg = 'المتجر غير مفعّل حالياً';
        else if (status === 404) msg = 'المتجر غير موجود';
        else if (status === 503) msg = 'المتجر جاهز قريباً';
        else if (status === 500) msg = 'خطأ في الخادم، حاول لاحقاً';
        else if (err.message) msg = err.message;

        setError(msg);
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, [identifier, shopInfo, currentId, setShop, setLoading, setError]);
}