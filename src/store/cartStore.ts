import { create } from 'zustand';
import type { Product, CartItem } from '@/types';

const DEFAULT_KEY = 'talvo_cart_default';

function loadCart(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(key: string, items: CartItem[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  storageKey: string;
  setTenant: (identifier: string) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(DEFAULT_KEY),
  isOpen: false,
  storageKey: DEFAULT_KEY,

  setTenant: (identifier) => {
    const key = `talvo_cart_${identifier}`;
    if (get().storageKey === key) return;
    set({
      storageKey: key,
      items: loadCart(key),
      isOpen: false,
    });
  },

  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    saveCart(get().storageKey, items);
    set({ items, isOpen: true });
  },

  removeItem: (productId) => {
    const items = get().items.filter(i => i.product.id !== productId);
    saveCart(get().storageKey, items);
    set({ items });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) return get().removeItem(productId);
    const items = get().items.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    saveCart(get().storageKey, items);
    set({ items });
  },

  clearCart: () => {
    try {
      localStorage.removeItem(get().storageKey);
    } catch {}
    set({ items: [] });
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));