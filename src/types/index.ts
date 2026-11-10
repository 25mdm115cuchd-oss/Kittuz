export type ProductCategory =
  | "Women's Clothing"
  | "Handbags & Purses"
  | "Jewellery"
  | "Fashion Accessories"
  | "Beauty & Personal Care"
  | "Footwear"
  | "Watches"
  | "Lifestyle Essentials"
  | "Gift Sets"
  | "Trending Products";

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  size?: string;
  sku: string;
  inStock: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatar?: string;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number; // in INR
  originalPrice: number; // MRP in INR
  discountPercentage: number;
  description: string;
  shortDescription: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  specifications: Record<string, string>;
  inStock: number;
  isTrending?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  featuredCollection?: "Festive Radiance" | "Monochrome Chic" | "Pastel Reverie" | "Workplace Grace";
  tags: string[];
  frequentlyBoughtWith?: string[]; // IDs of complementary products
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  maxStock: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work';
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., KTZ-2026-8492
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: Address;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'razorpay' | 'cod' | 'upi';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  courierPartner?: string;
  cancelReason?: string;
  returnReason?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
  createdAt: string;
}

export interface StyleQuizResult {
  stylePersona: string;
  styleDescription: string;
  colorPalette: string[];
  recommendedCategories: ProductCategory[];
  preferredBudget: string;
  recommendedProductIds: string[];
  outfitRecommendation: {
    title: string;
    description: string;
    productIds: string[];
  };
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  suggestedActions?: string[];
}
