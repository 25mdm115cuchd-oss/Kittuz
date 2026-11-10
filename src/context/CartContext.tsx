import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  totalItemCount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kittuz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('kittuz_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kittuz_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('kittuz_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('kittuz_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string, quantity: number = 1) => {
    const color = selectedColor || (product.colors[0]?.name ?? 'Standard');
    const size = selectedSize || (product.sizes[0] ?? 'Standard');
    const itemId = `${product.id}-${color}-${size}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.inStock);
        return prev.map(item => item.id === itemId ? { ...item, quantity: nextQty } : item);
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: Math.min(quantity, product.inStock),
          selectedColor: color,
          selectedSize: size,
          maxStock: product.inStock
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.min(newQuantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Apply Coupon via backend validation
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.data.code,
          description: data.data.description,
          discountType: 'fixed',
          discountValue: data.data.discountAmount,
          minOrderValue: 0,
          expiresAt: '2026-12-31',
          isActive: true
        });
        return { success: true, message: `Coupon ${data.data.code} applied! Saved ₹${data.data.discountAmount}` };
      } else {
        return { success: false, message: data.error || 'Failed to apply coupon' };
      }
    } catch {
      return { success: false, message: 'Network error validating coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = 999;
  const shippingFee = subtotal === 0 ? 0 : (subtotal - discount >= freeShippingThreshold ? 0 : 99);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const tax = subtotal === 0 ? 0 : Math.round(Math.max(0, subtotal - discount) * 0.05); // 5% GST
  const total = Math.max(0, subtotal - discount) + shippingFee;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        totalItemCount,
        freeShippingThreshold,
        amountNeededForFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
