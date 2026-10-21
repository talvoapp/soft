import { create } from 'zustand';
import type { ShopInfo, ShopConfig } from '@/types';

interface ShopState {
  identifier: string | null;
  shopInfo: ShopInfo | null;
  config: ShopConfig | null;
  loading: boolean;
  error: string | null;
  setShop: (identifier: string, info: ShopInfo, config: ShopConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  identifier: null,
  shopInfo: null,
  config: null,
  loading: true,
  error: null,
  setShop: (identifier, shopInfo, config) =>
    set({ identifier, shopInfo, config, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));