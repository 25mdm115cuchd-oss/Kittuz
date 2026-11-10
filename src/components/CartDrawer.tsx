import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreProducts
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountNeededForFreeShipping
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput.trim();
    if (!code) return;
    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');

    const res = await applyCoupon(code);
    setIsApplying(false);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const progressPercent = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E2D8CF]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#EAE3DC] bg-white flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#241E1C] tracking-wide">
                YOUR SHOPPING BAG
              </h2>
              <p className="text-xs text-[#7A6D65] mt-0.5">
                {cart.length === 0 ? 'Bag is empty' : `${cart.reduce((a, b) => a + b.quantity, 0)} items selected`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7A6D65] hover:text-[#241E1C] rounded-full hover:bg-[#FAF8F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FFF2F5] border-b border-[#FCD2DC] px-5 py-3">
            {amountNeededForFreeShipping > 0 ? (
              <div>
                <p className="text-xs font-medium text-[#7C1836] flex items-center justify-between">
                  <span>Add <strong className="font-bold">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="underline font-semibold">FREE Express Shipping</span></span>
                  <span className="text-[11px] font-bold">{progressPercent}%</span>
                </p>
                <div className="w-full bg-[#F8ADC0]/40 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#CE285A] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-semibold text-[#166534] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You’ve unlocked <strong>FREE Pan-India Express Delivery</strong>.</span>
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#7A6D65] mb-4">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#241E1C]">Your Bag is Empty</h3>
                <p className="text-xs text-[#7A6D65] max-w-xs mt-1 mb-6">
                  Explore our handcrafted silks, 18K gold jewellery, and signature Italian leather bags.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreProducts();
                  }}
                  className="px-6 py-2.5 bg-[#241E1C] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-[#B01A46] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#EAE3DC] shadow-xs relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-[#F8F5F2] flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start pr-6">
                        <h4 className="text-xs font-semibold text-[#241E1C] line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      
                      {/* Variant Specs */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A6D65]">
                        {item.selectedColor && (
                          <span className="inline-block bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE3DC]">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && item.selectedSize !== 'Standard' && (
                          <span className="inline-block bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE3DC]">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#241E1C]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-[#A89D96] line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F8F5F2]">
                      <div className="flex items-center border border-[#EAE3DC] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#B01A46] text-[#7A6D65] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#241E1C]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#B01A46] text-[#7A6D65] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#9E9086] hover:text-[#B01A46] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Calculation */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#EAE3DC] space-y-4 shadow-lg">
              
              {/* Coupon Section */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#FFF2F5] border border-[#FCD2DC] rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-[#B01A46] font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} applied (Saved ₹{discount.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#7A6D65] hover:text-[#241E1C] underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon (e.g. KITTUZ15)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B01A46]"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={isApplying || !couponInput.trim()}
                        className="px-4 py-1.5 bg-[#241E1C] text-white text-xs font-semibold rounded-lg hover:bg-[#B01A46] disabled:opacity-50 transition-colors"
                      >
                        {isApplying ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick suggestion tags */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-[#7A6D65]">Popular:</span>
                      {['KITTUZ15', 'FIRST10', 'FREESHIP'].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleApplyCoupon(c)}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#F3EFEA] hover:bg-[#FDE8ED] hover:text-[#B01A46] font-mono transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 mt-1.5">{couponSuccess}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#7A6D65] border-t border-[#F8F5F2] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#241E1C] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#B01A46]">
                    <span>Coupon Savings</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST Included)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#241E1C] pt-2 border-t border-[#EAE3DC]">
                  <span>Total Payable</span>
                  <span className="text-[#B01A46] text-base">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-[#241E1C] hover:bg-[#B01A46] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C7E74]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Encrypted & Secure Indian Gateway (Razorpay & UPI)</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
