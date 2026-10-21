import { useMemo } from 'react';
import { createMasterClient } from '@/lib/masterApi';
import { useShopStore } from '@/store/shopStore';
import { useAuthStore } from '@/store/authStore';

export function useMaster() {
  const shopInfo = useShopStore(s => s.shopInfo);
  const token = useAuthStore(s => s.token);

  return useMemo(() => {
    if (!shopInfo?.shop_url) return null;
    return createMasterClient(shopInfo.shop_url, token);
  }, [shopInfo?.shop_url, token]);
}