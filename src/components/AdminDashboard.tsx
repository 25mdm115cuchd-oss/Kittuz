import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Package, ShoppingCart, Users, DollarSign, 
  Plus, Edit2, Trash2, Tag, AlertTriangle, ArrowUpRight, Check, X, RefreshCw 
} from 'lucide-react';
import { Product, Order, Coupon, ProductCategory } from '../types';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  allProducts: Product[];
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  allProducts,
  onRefreshProducts
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'customers'>('analytics');
  
  // Analytics stats
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
    lowStockCount: number;
    lowStockProducts: Product[];
    categorySales: Record<string, number>;
  } | null>(null);

  // Orders list
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Add/Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>("Women's Clothing");
  const [prodPrice, setProdPrice] = useState(2999);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(4499);
  const [prodStock, setProdStock] = useState(25);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Add Coupon state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(999);

  // Status update on orders
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ordersRes, couponsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders?role=admin'),
        fetch('/api/coupons')
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const couponsData = await couponsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (couponsData.success) setCoupons(couponsData.data);
    } catch (e) {
      console.error('Failed to load admin telemetry', e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      originalPrice: Number(prodOriginalPrice),
      discountPercentage: Math.round(((prodOriginalPrice - prodPrice) / prodOriginalPrice) * 100),
      shortDescription: prodDescription.slice(0, 100),
      description: prodDescription,
      inStock: Number(prodStock),
      images: [
        prodImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200'
      ],
      colors: [{ name: 'Studio Rose', hex: '#E8B4B8' }],
      sizes: ['S', 'M', 'L'],
      specifications: {
        'Craft': 'Artisanal Studio',
        'Fabric': 'Premium Handloom',
        'Origin': 'India'
      }
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    onRefreshProducts();
    fetchAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from catalog?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    onRefreshProducts();
    fetchAdminData();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        trackingNumber: trackingNumber || `BLUEDART-${Math.floor(100000 + Math.random() * 900000)}`,
        courierPartner: 'Blue Dart Luxury Express'
      })
    });
    fetchAdminData();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCouponCode.toUpperCase(),
        description: `${newCouponDiscount}% off on orders above ₹${newCouponMin}`,
        discountType: 'percentage',
        discountValue: Number(newCouponDiscount),
        minOrderValue: Number(newCouponMin),
        expiresAt: '2026-12-31'
      })
    });
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    fetchAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Bar */}
      <div className="bg-[#241E1C] text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B01A46] flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold tracking-wide">
                KITTUZ Executive Console
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                RBAC: Super Admin
              </span>
            </div>
            <p className="text-xs text-[#D8CEBC] mt-0.5">
              Live Product Catalog, Orders, Courier Dispatches & Financial Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onExitAdmin}
            className="px-5 py-2.5 bg-[#B01A46] hover:bg-[#CE285A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Return to Store
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAE3DC] mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: 'Analytics & Revenue', icon: DollarSign },
          { id: 'products', label: `Products (${allProducts.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'customers', label: 'Customers', icon: Users }
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
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & METRICS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#7A6D65] tracking-wider">Total Gross Revenue</span>
              <p className="font-serif text-3xl font-extrabold text-[#241E1C] mt-2">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last month
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#7A6D65] tracking-wider">Total Orders</span>
              <p className="font-serif text-3xl font-extrabold text-[#241E1C] mt-2">
                {stats.totalOrders}
              </p>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> 98.2% fulfillment rate
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#7A6D65] tracking-wider">Average Order Value (AOV)</span>
              <p className="font-serif text-3xl font-extrabold text-[#B01A46] mt-2">
                ₹{stats.averageOrderValue.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-[#7A6D65] mt-2 block">Luxury lifestyle baseline</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#7A6D65] tracking-wider">Low Inventory Alerts</span>
              <p className="font-serif text-3xl font-extrabold text-amber-600 mt-2">
                {stats.lowStockCount} Items
              </p>
              <span className="text-[11px] text-amber-700 font-medium mt-2 block">Stock below 15 units</span>
            </div>
          </div>

          {/* Revenue & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Performance */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#241E1C] mb-4">
                Category Sales Distribution (INR)
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.categorySales).map(([cat, amount]) => {
                  const pct = Math.min(100, Math.round((amount / (stats.totalRevenue || 1)) * 100));
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-semibold text-[#241E1C] mb-1">
                        <span>{cat}</span>
                        <span>₹{amount.toLocaleString('en-IN')} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] border border-[#EAE3DC] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#B01A46] h-2 rounded-full"
                          style={{ width: `${Math.max(12, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Inventory Priority List */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-[#241E1C]">
                  Inventory Reorder Alerts
                </h3>
              </div>

              <div className="space-y-3">
                {stats.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DC] text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-12 object-cover rounded-lg bg-white"
                      />
                      <div>
                        <p className="font-semibold text-[#241E1C] line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-[#7A6D65]">{p.category}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-[10px]">
                      {p.inStock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#241E1C]">
                Product Catalog Management
              </h3>
              <p className="text-xs text-[#7A6D65]">
                Add, modify or adjust inventory for all live collections.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProdName('');
                setProdDescription('');
                setProdImage('');
                setIsProductModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#EAE3DC] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE3DC] uppercase tracking-wider text-[10px] font-bold text-[#7A6D65]">
                  <tr>
                    <th className="py-3 px-5">Product</th>
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5">Price (INR)</th>
                    <th className="py-3 px-5">Stock</th>
                    <th className="py-3 px-5">Rating</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8F5F2]">
                  {allProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg bg-[#FAF8F5] border border-[#EAE3DC]"
                        />
                        <div>
                          <p className="font-semibold text-xs text-[#241E1C] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-[#7A6D65]">{p.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-[#4A403A]">{p.category}</td>
                      <td className="py-3 px-5 font-bold text-[#241E1C]">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.inStock < 15 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.inStock} in studio
                        </span>
                      </td>
                      <td className="py-3 px-5">⭐ {p.rating} ({p.reviewCount})</td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProdName(p.name);
                              setProdCategory(p.category);
                              setProdPrice(p.price);
                              setProdOriginalPrice(p.originalPrice);
                              setProdStock(p.inStock);
                              setProdDescription(p.description);
                              setProdImage(p.images[0]);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-[#7A6D65] hover:text-[#241E1C] hover:bg-[#FAF8F5] rounded-lg"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#7A6D65] hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#241E1C]">
              Customer Orders & Dispatch Pipeline
            </h3>
            <p className="text-xs text-[#7A6D65]">
              Update shipment statuses, assign Blue Dart tracking, and authorize refunds.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAE3DC] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] border-b border-[#EAE3DC] uppercase tracking-wider text-[10px] font-bold text-[#7A6D65]">
                  <tr>
                    <th className="py-3 px-5">Order ID</th>
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-5">Items</th>
                    <th className="py-3 px-5">Total</th>
                    <th className="py-3 px-5">Payment</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8F5F2]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-5 font-mono font-bold text-[#241E1C]">{ord.orderNumber}</td>
                      <td className="py-3 px-5">
                        <p className="font-semibold text-[#241E1C]">{ord.customerName}</p>
                        <p className="text-[10px] text-[#7A6D65]">{ord.customerEmail}</p>
                        <p className="text-[10px] text-[#7A6D65]">{ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</p>
                      </td>
                      <td className="py-3 px-5 text-[#4A403A]">
                        {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-5 font-bold text-[#B01A46]">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-5 uppercase font-medium">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-5 font-semibold text-[#241E1C]">
                        {ord.status}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E2D8CF] rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#B01A46]"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS & DISCOUNTS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#241E1C]">
                Promotional Coupons & Festive Codes
              </h3>
              <p className="text-xs text-[#7A6D65]">
                Manage storewide promotions, welcome offers, and minimum purchase thresholds.
              </p>
            </div>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-5 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 bg-white rounded-3xl border border-[#EAE3DC] shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-base text-[#B01A46] bg-[#FFF2F5] px-3 py-1 rounded-lg border border-[#FCD2DC]">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#241E1C] mt-2">{c.description}</p>
                  <p className="text-[11px] text-[#7A6D65] mt-1">
                    Min Cart Order: <strong>₹{c.minOrderValue}</strong>
                  </p>
                </div>
                <p className="text-[10px] text-[#A89D96] mt-4 pt-2 border-t border-[#F8F5F2]">
                  Valid through {c.expiresAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#241E1C]">
              Customer Directory & VIP Profiles
            </h3>
            <p className="text-xs text-[#7A6D65]">
              Insights into returning patrons across major Indian metro centers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAE3DC] p-6 shadow-xs">
            <div className="space-y-3">
              {[
                { name: 'Ananya Deshmukh', city: 'Mumbai', orders: 3, spent: '₹14,944', email: 'ananya.d@example.com', badge: 'VIP Patrons' },
                { name: 'Pooja Kashyap', city: 'Bengaluru', orders: 2, spent: '₹8,398', email: 'pooja.k@example.com', badge: 'Loyal' },
                { name: 'Kritika Roy', city: 'Kolkata', orders: 2, spent: '₹6,498', email: 'kritika.r@example.com', badge: 'Loyal' },
                { name: 'Shalini Nambiar', city: 'Hyderabad', orders: 1, spent: '₹1,899', email: 'shalini.n@example.com', badge: 'New Customer' },
                { name: 'Rhea Sen', city: 'New Delhi', orders: 2, spent: '₹7,798', email: 'rhea.sen@example.com', badge: 'Loyal' }
              ].map((cust) => (
                <div key={cust.email} className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DC] text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#B01A46]/10 text-[#B01A46] font-bold flex items-center justify-center">
                      {cust.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#241E1C]">{cust.name}</p>
                      <p className="text-[10px] text-[#7A6D65]">{cust.email} · {cust.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#B01A46]">{cust.spent}</p>
                    <p className="text-[10px] text-[#7A6D65]">{cust.orders} Orders ({cust.badge})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-[#EAE3DC] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3DC]">
              <h3 className="font-serif text-lg font-bold text-[#241E1C]">
                {editingProduct ? 'Edit Lifestyle Product' : 'Add New Lifestyle Product'}
              </h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-[#7A6D65]" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Product Title</label>
              <input
                type="text"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
                >
                  <option value="Women's Clothing">Women's Clothing</option>
                  <option value="Handbags & Purses">Handbags & Purses</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Fashion Accessories">Fashion Accessories</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Watches">Watches</option>
                  <option value="Lifestyle Essentials">Lifestyle Essentials</option>
                  <option value="Gift Sets">Gift Sets</option>
                  <option value="Trending Products">Trending Products</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Discount Price (₹ INR)</label>
                <input
                  type="number"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Original MRP (₹ INR)</label>
                <input
                  type="number"
                  value={prodOriginalPrice}
                  onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Editorial Image URL</label>
              <input
                type="url"
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Description</label>
              <textarea
                rows={3}
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE3DC]">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 text-xs text-[#7A6D65]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCoupon} className="bg-[#FAF8F5] p-6 rounded-3xl max-w-md w-full border border-[#EAE3DC] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#241E1C]">
              Create New Promotional Coupon
            </h3>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                placeholder="e.g. DIWALI25"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl uppercase font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Discount %</label>
              <input
                type="number"
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7A6D65] block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-[#E2D8CF] rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="px-4 py-2 text-xs text-[#7A6D65]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Launch Coupon
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
