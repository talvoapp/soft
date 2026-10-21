import { useEffect } from 'react';
import { resolveShop } from '@/lib/cloudApi';
import { createMasterClient } from '@/lib/masterApi';
import { useShopStore } from '@/store/shopStore';

export function useShopBootstrap(identifier: string | undefined) {
  const { setShop, setLoading, setError, shopInfo, identifier: currentId } = useShopStore();

  useEffect(() => {
    if (!identifier) {
      setError('معرف المتجر غير موجود');
      return;
    }

    if (shopInfo && currentId === identifier) return;

    let cancelled = false;

    async function boot() {
      try {
        setLoading(true);
        setError(null);

        // 1. Resolve shop via cloud
        const info = await resolveShop(identifier);

        // 2. Fetch shop config from master
        const master = createMasterClient(info.shop_url);
        const configRes = await master.get('/api/shop/config');

        if (!configRes.data?.success) {
          throw new Error('فشل تحميل إعدادات المتجر');
        }

        if (!cancelled) {
          setShop(identifier, info, configRes.data);
        }
      } catch (err: any) {
        if (cancelled) return;
        const status = err.response?.status;
        let msg = 'فشل الاتصال بالخادم';
        if (status === 403) msg = 'المتجر غير مفعّل حالياً';
        else if (status === 404) msg = 'المتجر غير موجود';
        else if (status === 503) msg = 'المتجر جاهز قريباً';
        else if (err.message) msg = err.message;
        setError(msg);
      }
    }

    boot();
    return () => { cancelled = true; };
  }, [identifier, shopInfo, currentId, setShop, setLoading, setError]);
}