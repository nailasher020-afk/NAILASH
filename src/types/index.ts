export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SizeStock {
  size: ClothingSize;
  stock: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image?: string;
  sizes: SizeStock[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images: string[];
  videoUrl?: string;
  colors: ColorVariant[];
  brand: string;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'published' | 'draft' | 'archived';
  lowStockThreshold: number;
  fabric?: string;
  careInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item id
  productId: string;
  productName: string;
  sku: string;
  image: string;
  colorName: string;
  colorHex: string;
  size: ClothingSize;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
}

export type PaymentMethod = 'jazzcash' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  colorName: string;
  size: ClothingSize;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string; // e.g. NL-2026-000123
  customer: CustomerAddress;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  jazzCashReference?: string;
  jazzCashPhone?: string;
  orderStatus: OrderStatus;
  paidAt?: string; // Date/time when payment was received & verified by admin
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'payment' | 'stock' | 'customer' | 'review';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  orderId?: string;
}

export interface StockHistoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: ClothingSize;
  change: number; // + or -
  reason: 'sale' | 'restock' | 'adjustment' | 'return' | 'cancellation';
  date: string;
  updatedBy: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage, e.g. 0 or 5
  freeShippingThreshold: number;
  defaultShippingFee: number;
  jazzCashMerchantNumber: string;
  jazzCashAccountTitle: string;
  bannerAnnouncement: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'store_manager' | 'inventory_manager';
  avatar?: string;
  lastLogin?: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}
