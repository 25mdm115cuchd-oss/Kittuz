import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Truck, CreditCard, 
  MapPin, Phone, Mail, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, subtotal, discount, shippingFee, tax, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  // Customer & Shipping Form
  const [fullName, setFullName] = useState(user?.fullName || 'Ananya Deshmukh');
  const [email, setEmail] = useState(user?.email || 'ananya.d@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 44521');
  const [street, setStreet] = useState(user?.savedAddresses[0]?.street || 'Flat 402, Sea Pearl Residences, Bandra West');
  const [landmark, setLandmark] = useState(user?.savedAddresses[0]?.landmark || 'Near Carter Road Promenade');
  const [city, setCity] = useState(user?.savedAddresses[0]?.city || 'Mumbai');
  const [state, setState] = useState(user?.savedAddresses[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.savedAddresses[0]?.pincode || '400050');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const calculatedShipping = shippingMethod === 'express' ? 149 : shippingFee;
  const grandTotal = total + (shippingMethod === 'express' && shippingFee === 0 ? 149 : 0) + (paymentMethod === 'cod' ? 49 : 0);

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName,
      phone,
      street,
      landmark,
      city,
      state,
      pincode,
      addressType: 'home'
    };

    try {
      // 1. Create order on secure backend (verifies prices, coupons, inventory)
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          shippingAddress,
          shippingMethod,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          customerDetails: {
            userId: user?.id || 'user-default-1',
            name: fullName,
            email,
            phone
          }
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      const createdOrder: Order = data.data.order;

      // 2. Handle Payment Method
      if (paymentMethod === 'cod') {
        // Cash on delivery: complete order
        setConfirmedOrder(createdOrder);
        setStep('success');
        clearCart();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onOrderSuccess(createdOrder);
        setIsProcessing(false);
        return;
      }

      // Online Payment via Razorpay
      const razorpayOptions = {
        key: data.data.razorpayKeyId,
        amount: data.data.amountInPaise,
        currency: data.data.currency,
        name: 'KITTUZ Luxury Lifestyle',
        description: `Order ${createdOrder.orderNumber}`,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200',
        order_id: data.data.razorpayOrderId,
        prefill: {
          name: fullName,
          email,
          contact: phone
        },
        theme: {
          color: '#B01A46'
        },
        handler: async function (paymentResponse: any) {
          // 3. Server-side payment signature verification
          const verifyRes = await fetch('/api/orders/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: createdOrder.id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setConfirmedOrder(verifyData.data);
            setStep('success');
            clearCart();
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
            onOrderSuccess(verifyData.data);
          } else {
            setErrorMessage('Payment verification failed. Please contact customer concierge.');
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMessage('Payment window was closed. Your order remains pending.');
          }
        }
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(razorpayOptions);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          setErrorMessage(`Payment failed: ${resp.error.description || 'Transaction declined'}`);
        });
        rzp.open();
      } else {
        // Fallback simulator for preview environments without live Razorpay script execution
        setTimeout(async () => {
          const verifyRes = await fetch('/api/orders/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: createdOrder.id,
              razorpayPaymentId: `pay_rzp_mock_${Date.now()}`
            })
          });
          const verifyData = await verifyRes.json();
          setConfirmedOrder(verifyData.data);
          setStep('success');
          clearCart();
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          onOrderSuccess(verifyData.data);
          setIsProcessing(false);
        }, 1200);
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Error occurred while processing checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EAE3DC] relative my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE3DC]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="font-serif text-lg font-bold text-[#241E1C]">
              KITTUZ SECURE CHECKOUT
            </h2>
          </div>
          {step !== 'success' && (
            <button onClick={onClose} className="p-2 text-[#7A6D65] hover:text-[#241E1C]">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Details & Address */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#241E1C] mb-1">
                  1. Contact & Delivery Address
                </h3>
                <p className="text-xs text-[#7A6D65]">
                  Please enter your delivery destination within India.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">Mobile (+91)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">Email Address (for order tracking)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">Street Address, Apartment, Suite</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">Landmark (optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">PIN Code (6 digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A403A] block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:ring-1 focus:ring-[#B01A46]"
                  />
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="pt-4 border-t border-[#EAE3DC]">
                <h4 className="text-xs font-bold text-[#241E1C] uppercase tracking-wider mb-3">
                  Shipping Option
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                        : 'bg-white border-[#EAE3DC]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#B01A46] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs text-[#241E1C]">Standard Express (3-5 Days)</p>
                      <p className="text-[11px] text-[#7A6D65] mt-0.5">
                        {subtotal >= 999 ? 'FREE (Threshold Reached)' : '₹99 (Free over ₹999)'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      shippingMethod === 'express'
                        ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                        : 'bg-white border-[#EAE3DC]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-[#B01A46] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs text-[#241E1C]">Priority Air Dispatch (1-2 Days)</p>
                      <p className="text-[11px] text-[#7A6D65] mt-0.5">₹149 · Blue Dart Luxury Air</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  disabled={!fullName || !phone || !street || !pincode || !city}
                  className="px-6 py-3 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#241E1C] mb-1">
                  2. Select Payment Method
                </h3>
                <p className="text-xs text-[#7A6D65]">
                  Encrypted transactions powered by verified Indian banking rails.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                      : 'bg-white border-[#EAE3DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE3DC] flex items-center justify-center text-[#B01A46]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#241E1C]">
                        Razorpay Secure (UPI, GPay, PhonePe, Cards, NetBanking)
                      </p>
                      <p className="text-[11px] text-[#7A6D65]">
                        Instant verification & instant order dispatch
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Recommended
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                      : 'bg-white border-[#EAE3DC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE3DC] flex items-center justify-center text-[#241E1C]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#241E1C]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-[#7A6D65]">
                        Pay cash or UPI to courier upon doorstep arrival (+₹49 handling fee)
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3DC] space-y-2 text-xs">
                <div className="flex justify-between text-[#7A6D65]">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-[#241E1C]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#B01A46]">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7A6D65]">
                  <span>Shipping ({shippingMethod})</span>
                  <span>{calculatedShipping === 0 ? 'FREE' : `₹${calculatedShipping}`}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-[#7A6D65]">
                    <span>COD Convenience Fee</span>
                    <span>₹49</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7A6D65]">
                  <span>Taxes (5% GST included)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#241E1C] pt-2 border-t border-[#EAE3DC]">
                  <span>Final Payable</span>
                  <span className="text-[#B01A46]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs text-[#7A6D65] hover:text-[#241E1C]"
                >
                  Back to Address
                </button>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Secure Payment...</span>
                  ) : (
                    <>
                      <span>PAY ₹{grandTotal.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation / Success */}
          {step === 'success' && confirmedOrder && (
            <div className="text-center py-6 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
                  Payment Verified · Order Confirmed
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#241E1C]">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-[#7A6D65] max-w-md mx-auto mt-1">
                  Your luxury lifestyle selection has been received. Our studio team is preparing your package with complimentary satin ribbon and signature packaging.
                </p>
              </div>

              {/* Order Reference Box */}
              <div className="p-5 bg-white rounded-2xl border border-[#EAE3DC] max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#F8F5F2] pb-2">
                  <span className="text-[#7A6D65]">Order Number</span>
                  <span className="font-mono font-bold text-[#241E1C]">{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F5F2] pb-2">
                  <span className="text-[#7A6D65]">Total Paid</span>
                  <span className="font-bold text-[#B01A46]">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F5F2] pb-2">
                  <span className="text-[#7A6D65]">Payment Method</span>
                  <span className="uppercase font-semibold">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F5F2] pb-2">
                  <span className="text-[#7A6D65]">Courier Partner</span>
                  <span className="font-semibold">{confirmedOrder.courierPartner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6D65]">Estimated Arrival</span>
                  <span className="font-semibold text-emerald-700">
                    {new Date(confirmedOrder.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2.5 bg-white border border-[#EAE3DC] text-[#241E1C] rounded-xl text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
                >
                  Print / Save Invoice
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  Back to Boutique
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
