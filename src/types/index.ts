// ═══════════════════════════════════════════════════════════════════
// ✅ Core Types
// ═══════════════════════════════════════════════════════════════════

export interface ShopInfo {
  tenant_id: number;
  tenant_name: string;
  tenant_arabic_name: string;
  shop_slug: string | null;
  shop_url: string;
  shop_enabled: boolean;
  currency: string;
  timezone: string;
  logo_path: string | null;
}

export interface Product {
  id: number;
  product_id: string;
  name: string;
  arabic_name?: string;
  description?: string;
  image_url?: string;
  thumbnail?: string;
  category_id?: number;
  category_name?: string;
  unit?: string;
  in_stock: boolean;
  quantity: number;
  price: number;
  base_price: number;
  has_custom_price: boolean;
  show_original: boolean;
  warning?: string | null;
  price_public: number;
  price_retail: number;
  price_wholesale: number;
  has_offer: boolean;
  offer_price?: number | null;
  tax_rate: number;
}

export interface Category {
  id?: number;
  name: string;
  arabic_name?: string;
  icon?: string;
  parent_id?: number;
  is_system?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  balance: number;
  bonus_points: number;
  bonus_balance?: number;
  total_purchases?: number;
  purchase_count?: number;
  tier?: string;
}

// ═══════════════════════════════════════════════════════════════════
// ✅ ShopConfig — كل الحقول اختيارية
// ═══════════════════════════════════════════════════════════════════

export interface ShopBasicInfo {
  shop_name?: string;
  arabic_name?: string;
  description?: string;
  logo?: string;
  cover?: string;
  favicon?: string;
  currency?: string;
  currency_symbol?: string;
  language?: string;
  timezone?: string;
}

export interface ShopContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  social_links?: Record<string, string>;
}

export interface ShopThemeConfig {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  layout?: Record<string, string>;
  header?: Record<string, any>;
  footer?: Record<string, any>;
  custom_css?: string;
  custom_js?: string;
  system_pages?: Record<string, any>;
}

export interface ShopDisplayConfig {
  products_per_page?: number;
  show_out_of_stock?: boolean;
  show_product_rating?: boolean;
  show_wishlist?: boolean;
  enable_search?: boolean;
  enable_filters?: boolean;
}

export interface ShopOrdersConfig {
  min_order_amount?: number;
  allow_guest_checkout?: boolean;
  shipping_fees?: number;
  free_shipping_threshold?: number;
  cash_on_delivery?: boolean;
  online_payment?: boolean;
}

export interface ShopCustomersConfig {
  allow_registration?: boolean;
  enable_profiles?: boolean;
  require_phone_verification?: boolean;
  require_email_verification?: boolean;
}

export interface ShopSeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
}

// ⚠️ كل الحقول اختيارية — الـ API قد يرجع بعضها فقط
export interface ShopConfig {
  basic?: ShopBasicInfo;
  contact?: ShopContactInfo;
  theme?: ShopThemeConfig;
  display?: ShopDisplayConfig;
  orders?: ShopOrdersConfig;
  customers?: ShopCustomersConfig;
  seo?: ShopSeoConfig;
  pages?: CustomPage[];
  categories?: any[];
  homepage_layout?: Block[];
}

// ═══════════════════════════════════════════════════════════════════
// ✅ Block / CustomPage / Order
// ═══════════════════════════════════════════════════════════════════

export interface Block {
  id: string;
  type: string;
  title?: string;
  config: Record<string, any>;
  visible?: boolean;
  order?: number;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  blocks?: Block[];
  is_published: boolean;
  in_menu?: boolean;
  parent_id?: string | null;
  order?: number;
  featured_image?: string;
  description?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label?: string;
  subtotal: number;
  shipping?: number;
  total: number;
  items_count?: number;
  created_at: string;
  delivered_at?: string;
  items?: any[];
  payment_method?: string;
  payment_status?: string;
}