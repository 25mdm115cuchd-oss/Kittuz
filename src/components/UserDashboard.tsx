import React, { useState, useEffect } from 'react';
import { 
  User, Package, MapPin, Heart, Sparkles, LogOut, 
  Trash2, Plus, Edit2, Check, ArrowRight, Truck, RotateCcw, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Order, Product, Address } from '../types';

interface UserDashboardProps {
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenStyleFinder: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  allProducts,
  onSelectProduct,
  onOpenStyleFinder
}) => {
  const { user, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address Modal / Form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newAddressType, setNewAddressType] = useState<'home' | 'work'>('home');

  // Cancel / Return Modal state
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'return' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?userId=${user?.id || 'user-default-1'}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newStreet || !newCity || !newPincode) return;

    addAddress({
      fullName: newFullName,
      phone: newPhone,
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
      addressType: newAddressType,
      isDefault: user?.savedAddresses.length === 0
    });

    setShowAddAddress(false);
    setNewFullName('');
    setNewPhone('');
    setNewStreet('');
    setNewCity('');
    setNewPincode('');
  };

  const handleCancelOrder = async () => {
    if (!actionOrderId) return;
    try {
      const res = await fetch(`/api/orders/${actionOrderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: actionReason })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Order cancelled successfully.');
        fetchOrders();
        setTimeout(() => {
          setActionOrderId(null);
          setActionType(null);
          setActionReason('');
          setActionMessage('');
        }, 1500);
      } else {
        setActionMessage(data.error || 'Failed to cancel order.');
      }
    } catch {
      setActionMessage('Network error occurred.');
    }
  };

  const handleReturnOrder = async () => {
    if (!actionOrderId) return;
    try {
      const res = await fetch(`/api/orders/${actionOrderId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: actionReason })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Return request initiated. Courier pickup scheduled.');
        fetchOrders();
        setTimeout(() => {
          setActionOrderId(null);
          setActionType(null);
          setActionReason('');
          setActionMessage('');
        }, 1500);
      } else {
        setActionMessage(data.error || 'Failed to request return.');
      }
    } catch {
      setActionMessage('Network error occurred.');
    }
  };

  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  const handleMoveAllWishlistToCart = () => {
    for (const p of wishlistProducts) {
      addToCart(p, p.colors[0]?.name, p.sizes[0], 1);
    }
  };

  const ORDER_STATUS_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Profile Summary Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DC] shadow-xs mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={user?.fullName || 'Customer'}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#B01A46]/20 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-serif text-2xl font-bold text-[#241E1C]">
                {user?.fullName || 'Ananya Deshmukh'}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF2F5] text-[#B01A46] border border-[#FCD2DC]">
                KITTUZ Member
              </span>
            </div>
            <p className="text-xs text-[#7A6D65] mt-1">{user?.email || 'ananya.d@example.com'} · {user?.phone || '+91 98201 44521'}</p>
            <p className="text-[11px] text-[#A89D96] mt-0.5">Primary delivery hub: Bandra West, Mumbai, India</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStyleFinder}
            className="px-4 py-2 bg-[#FFF2F5] hover:bg-[#FCD2DC] text-[#B01A46] border border-[#F8ADC0] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retake Style Finder</span>
          </button>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl border border-[#EAE3DC] hover:bg-[#FAF8F5] text-[#7A6D65] hover:text-[#B01A46] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#EAE3DC] mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
          { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistIds.length },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user?.savedAddresses.length || 0 },
          { id: 'profile', label: 'Profile Settings', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#B01A46] text-[#B01A46]'
                  : 'border-transparent text-[#7A6D65] hover:text-[#241E1C]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-[#FFF2F5] text-[#B01A46]' : 'bg-[#F3EFEA] text-[#7A6D65]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="text-center py-12 text-xs text-[#7A6D65]">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#EAE3DC] p-8">
              <Package className="w-12 h-12 text-[#9E9086] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#241E1C]">No orders placed yet</h3>
              <p className="text-xs text-[#7A6D65] mt-1">Discover our latest festive silken arrivals and handcrafted jewellery.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const currentStepIdx = ORDER_STATUS_STEPS.indexOf(ord.status);
              const isCancelled = ord.status === 'Cancelled';
              const isReturnRequested = ord.status === 'Return Requested';

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-[#EAE3DC] overflow-hidden shadow-xs hover:border-[#D8CEBC] transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="bg-[#FAF8F5] p-5 border-b border-[#EAE3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#241E1C]">{ord.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-800'
                            : ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[#7A6D65]">Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-[#7A6D65]">Order Total</p>
                        <p className="font-bold text-sm text-[#B01A46]">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-white border border-[#EAE3DC] rounded-lg text-[11px] font-medium text-[#241E1C] hover:bg-[#FAF8F5]"
                      >
                        Invoice
                      </button>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {!isCancelled && (
                    <div className="px-5 py-4 bg-white border-b border-[#F8F5F2]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-semibold text-[#7A6D65] flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#B01A46]" />
                          <span>Courier: {ord.courierPartner || 'Blue Dart Luxury Express'} ({ord.trackingNumber || 'KTZ-TRK-98210'})</span>
                        </span>
                        <span className="text-[11px] font-medium text-emerald-700">
                          Estimated Delivery: {new Date(ord.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Timeline Steps */}
                      <div className="grid grid-cols-5 gap-1 pt-2">
                        {ORDER_STATUS_STEPS.map((st, sIdx) => {
                          const reached = currentStepIdx >= sIdx;
                          return (
                            <div key={st} className="text-center">
                              <div
                                className={`h-1.5 rounded-full mb-1.5 transition-colors ${
                                  reached ? 'bg-[#B01A46]' : 'bg-[#EAE3DC]'
                                }`}
                              />
                              <span className={`text-[10px] block truncate ${reached ? 'font-bold text-[#241E1C]' : 'text-[#A89D96]'}`}>
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="p-5 divide-y divide-[#F8F5F2]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-16 object-cover rounded-xl bg-[#FAF8F5] border border-[#EAE3DC]"
                          />
                          <div>
                            <p className="font-semibold text-xs text-[#241E1C]">{item.name}</p>
                            <p className="text-[11px] text-[#7A6D65]">
                              Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-xs text-[#241E1C]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions: Cancel / Return */}
                  <div className="p-4 bg-[#FFFDFB] border-t border-[#EAE3DC] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <p className="text-[#7A6D65] text-[11px]">
                      Destination: {ord.shippingAddress?.street}, {ord.shippingAddress?.city} ({ord.shippingAddress?.pincode})
                    </p>

                    <div className="flex items-center gap-2">
                      {ord.status === 'Placed' && (
                        <button
                          onClick={() => {
                            setActionOrderId(ord.id);
                            setActionType('cancel');
                          }}
                          className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium"
                        >
                          Cancel Order
                        </button>
                      )}

                      {ord.status === 'Delivered' && (
                        <button
                          onClick={() => {
                            setActionOrderId(ord.id);
                            setActionType('return');
                          }}
                          className="px-3 py-1.5 border border-[#B01A46] text-[#B01A46] hover:bg-[#FFF2F5] rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request 7-Day Return</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#241E1C]">
                Your Saved Wishlist
              </h3>
              <p className="text-xs text-[#7A6D65] mt-0.5">
                {wishlistProducts.length} items saved for your lifestyle collection
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <button
                onClick={handleMoveAllWishlistToCart}
                className="px-4 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs"
              >
                Move All to Bag
              </button>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#EAE3DC] p-8">
              <Heart className="w-12 h-12 text-[#9E9086] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#241E1C]">Your wishlist is empty</h3>
              <p className="text-xs text-[#7A6D65] mt-1">Click the heart icon on any product to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden group flex flex-col justify-between"
                >
                  <div
                    onClick={() => onSelectProduct(p)}
                    className="cursor-pointer relative aspect-[3/4] bg-[#F7F4F0] overflow-hidden"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#B01A46] shadow-sm hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[10px] uppercase text-[#7A6D65]">{p.category}</p>
                      <h4
                        onClick={() => onSelectProduct(p)}
                        className="font-serif text-sm font-semibold text-[#241E1C] truncate mt-0.5 cursor-pointer hover:text-[#B01A46]"
                      >
                        {p.name}
                      </h4>
                      <p className="text-sm font-bold text-[#241E1C] mt-2">
                        ₹{p.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(p, p.colors[0]?.name, p.sizes[0], 1)}
                      className="w-full mt-4 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#241E1C]">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-[#7A6D65]">
                Manage domestic addresses for fast, 1-click Indian checkouts.
              </p>
            </div>

            <button
              onClick={() => setShowAddAddress(true)}
              className="px-4 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form Modal */}
          {showAddAddress && (
            <form onSubmit={handleCreateAddress} className="p-6 bg-white rounded-3xl border border-[#B01A46] space-y-4 animate-in fade-in">
              <h4 className="font-serif text-base font-bold text-[#241E1C]">
                Add Destination Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7A6D65] block mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#7A6D65] block mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 text-xs text-[#7A6D65]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border transition-all ${
                  addr.isDefault
                    ? 'bg-white border-[#B01A46] ring-1 ring-[#B01A46]'
                    : 'bg-white border-[#EAE3DC]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#241E1C]">{addr.fullName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#7A6D65] border border-[#EAE3DC]">
                      {addr.addressType}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-[#9E9086] hover:text-rose-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#4A403A] leading-relaxed">
                  {addr.street} {addr.landmark ? `, ${addr.landmark}` : ''}
                </p>
                <p className="text-xs text-[#4A403A]">
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </p>
                <p className="text-xs text-[#7A6D65] mt-1">Phone: {addr.phone}</p>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="mt-3 text-xs text-[#B01A46] font-semibold hover:underline"
                  >
                    Set as default address
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3DC] space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#241E1C]">
            Profile Settings
          </h3>

          <div>
            <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Full Name</label>
            <input
              type="text"
              value={user?.fullName || ''}
              onChange={(e) => updateProfile({ fullName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 text-xs bg-[#F3EFEA] border border-[#E2D8CF] rounded-xl text-[#7A6D65]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Phone (+91)</label>
            <input
              type="tel"
              value={user?.phone || ''}
              onChange={(e) => updateProfile({ phone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-[#F8F5F2]">
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Profile auto-saved to secure local vault.
            </p>
          </div>
        </div>
      )}

      {/* Cancel / Return Modal */}
      {actionOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] p-6 rounded-3xl max-w-md w-full border border-[#EAE3DC] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#241E1C]">
              {actionType === 'cancel' ? 'Confirm Order Cancellation' : 'Request 7-Day Exchange or Return'}
            </h3>
            <p className="text-xs text-[#7A6D65]">
              {actionType === 'cancel'
                ? 'Are you sure you wish to cancel this order? Stock will be returned to studio immediately.'
                : 'Our concierge will arrange doorstep courier pickup within 48 business hours.'}
            </p>

            <textarea
              rows={3}
              placeholder="Reason for cancellation or return (e.g. size preference, changed mind)..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
            />

            {actionMessage && (
              <p className="text-xs text-[#B01A46] font-medium">{actionMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActionOrderId(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs text-[#7A6D65]"
              >
                Dismiss
              </button>
              <button
                onClick={actionType === 'cancel' ? handleCancelOrder : handleReturnOrder}
                className="px-5 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
