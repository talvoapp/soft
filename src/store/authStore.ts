import { create } from 'zustand';
import type { Customer } from '@/types';

const TOKEN_KEY = 'talvo_token';
const CUSTOMER_KEY = 'talvo_customer';

function loadCustomer(): Customer | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

interface AuthState {
  token: string | null;
  customer: Customer | null;
  setAuth: (token: string, customer: Customer) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  customer: loadCustomer(),

  setAuth: (token, customer) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    set({ token, customer });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
    set({ token: null, customer: null });
  },

  isAuthenticated: () => !!get().token,
}));