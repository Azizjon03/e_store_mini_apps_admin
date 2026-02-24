export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentVerifyStatus = 'pending' | 'verified' | 'rejected';

export interface ManagerOrder {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  payment_status: PaymentVerifyStatus;
  payment_status_label: string;
  total: number;
  items_count: number;
  user_name: string | null;
  user_phone: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface StatusTransition {
  value: string;
  label: string;
}

export interface ManagerOrderDetail extends Omit<ManagerOrder, 'items_count' | 'user_name' | 'user_phone'> {
  payment_method: string | null;
  payment_note: string | null;
  user: { name: string; phone: string } | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  customer_note: string | null;
  admin_note: string | null;
  cancel_reason: string | null;
  allowed_transitions: StatusTransition[];
  can_cancel: boolean;
  can_return: boolean;
  requires_payment_verify: boolean;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface StockBalance {
  id: number;
  warehouse_id: number;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  reserved: number;
  available: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
}

export interface CompanySettings {
  shop_open: boolean;
  allow_cancellation: boolean;
  allow_returns: boolean;
  manual_payment_verification: boolean;
}

export interface DashboardData {
  today_orders: number;
  pending_orders: number;
  today_revenue: number;
  low_stock_count: number;
  settings: CompanySettings;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

// --- Catalog Types ---

export interface LocalizedField {
  uz: string;
  ru?: string;
  en?: string;
}

export interface Product {
  id: string;
  name: LocalizedField;
  slug: string;
  description?: LocalizedField;
  sku?: string;
  barcode?: string;
  category_id?: string;
  category?: { id: string; name: LocalizedField; slug: string };
  brand_id?: string;
  brand?: { id: string; name: string; slug: string };
  price: number;
  compare_price?: number;
  cost_price?: number;
  currency: string;
  has_discount: boolean;
  discount_percentage: number;
  images: string[];
  thumbnail?: string;
  status: 'active' | 'inactive' | 'draft';
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: LocalizedField;
  slug: string;
  description?: LocalizedField;
  image?: string;
  icon?: string;
  parent_id?: string;
  parent?: Category;
  children?: Category[];
  children_recursive?: Category[];
  sort_order: number;
  status: 'active' | 'inactive';
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  status: 'active' | 'inactive';
  sort_order: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
}
