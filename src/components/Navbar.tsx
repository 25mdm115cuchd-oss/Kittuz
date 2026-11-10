import React, { useState, useEffect } from 'react';
import { 
  Search, Heart, ShoppingBag, User, Menu, X, Sparkles, 
  ChevronDown, ArrowRight, ShieldCheck, Truck, RotateCcw 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCategory } from '../types';

interface NavbarProps {
  onSelectCategory: (category: ProductCategory | 'All') => void;
  selectedCategory: ProductCategory | 'All';
  onOpenStyleFinder: () => void;
  onOpenSearch: (query: string) => void;
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin' | 'about' | 'contact') => void;
  currentView: string;
}

const ANNOUNCEMENTS = [
  "✨ Festive Curation: Complimentary Express Delivery Across India on Orders Above ₹999",
  "🌸 Use Code KITTUZ15 for 15% Off Your First Luxury Lifestyle Selection",
  "🌿 Handcrafted with Love: 100% Artisanal Mulberry Silks & 18K Gold Vermeil",
  "📦 Same-Day Dispatch & 7-Day Hassle-Free Boutique Returns"
];

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  "Women's Clothing",
  "Handbags & Purses",
  "Jewellery",
  "Fashion Accessories",
  "Beauty & Personal Care",
  "Footwear",
  "Watches",
  "Lifestyle Essentials",
  "Gift Sets",
  "Trending Products"
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  selectedCategory,
  onOpenStyleFinder,
  onOpenSearch,
  onNavigate,
  currentView
}) => {
  const { totalItemCount, setIsCartOpen, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, toggleAdminRole, logout } = useAuth();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenSearch(searchQuery.trim());
      setIsSearchOpen(false);
      onNavigate('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3DC] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#241E1C] text-[#FAF8F5] text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center font-medium tracking-wide truncate">
            {ANNOUNCEMENTS[announcementIdx]}
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#D8CEBC]">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#F8ADC0]" /> Pan-India Shipping
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-[#F8ADC0]" /> 7-Day Returns
            </span>
            <span>·</span>
            <span className="text-[#FAF8F5] font-semibold">🇮🇳 INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#241E1C] hover:text-[#B01A46] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="text-center sm:text-left">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#241E1C] uppercase block transition-transform hover:scale-[1.01]">
                K I T T U Z
              </span>
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#7A6D65] block font-medium -mt-0.5">
                Your Style. Your Lifestyle.
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search jewellery, silk anarkalis, leather totes, candles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E2D8CF] rounded-full focus:outline-none focus:ring-1 focus:ring-[#B01A46] focus:border-[#B01A46] transition-all placeholder:text-[#9E9086]"
              />
              <Search className="w-4 h-4 text-[#9E9086] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-[#241E1C] text-white px-2.5 py-1 rounded-full hover:bg-[#B01A46] transition-colors"
                >
                  Search
                </button>
              )}
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Style Finder Button */}
            <button
              onClick={onOpenStyleFinder}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FDE8ED] text-[#B01A46] hover:bg-[#FCD2DC] transition-all border border-[#F8ADC0]"
              title="Find your curated aesthetic"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#CE285A]" />
              <span>Style Finder</span>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 md:hidden text-[#241E1C] hover:text-[#B01A46]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="relative p-2 text-[#241E1C] hover:text-[#B01A46] transition-colors"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#B01A46] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 text-[#241E1C] hover:text-[#B01A46] transition-colors"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#B01A46] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-[#241E1C]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#F3EFEA] transition-colors focus:outline-none"
                aria-label="User account"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-[#E2D8CF]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#EAE3DC] flex items-center justify-center text-[#241E1C]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#7A6D65] hidden sm:block" />
              </button>

              {/* Account Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#EAE3DC] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-[#F3EFEA]">
                    <p className="font-semibold text-sm text-[#241E1C] truncate">{user?.fullName || 'KITTUZ Guest'}</p>
                    <p className="text-[#88786F] truncate">{user?.email || 'Sign in to access orders'}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'}`}>
                        {isAdmin ? '👑 Admin Mode' : 'Customer Account'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-[#241E1C] flex items-center justify-between"
                    >
                      <span>My Profile & Orders</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#9E9086]" />
                    </button>
                    <button
                      onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-[#241E1C] flex items-center justify-between"
                    >
                      <span>Saved Addresses</span>
                    </button>
                    <button
                      onClick={() => { onOpenStyleFinder(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-[#B01A46] font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Retake Style Finder</span>
                    </button>
                  </div>

                  <div className="border-t border-[#F3EFEA] pt-1 pb-1">
                    <button
                      onClick={() => { onNavigate('admin'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] font-semibold text-[#8B1E3F] flex items-center justify-between"
                    >
                      <span>Admin Management Console</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E3F]" />
                    </button>
                    <button
                      onClick={() => { toggleAdminRole(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#FAF8F5] text-[11px] text-[#7A6D65]"
                    >
                      Switch to {isAdmin ? 'Customer View' : 'Admin View'}
                    </button>
                  </div>

                  <div className="border-t border-[#F3EFEA] pt-1">
                    {user ? (
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FDE8ED] text-[#B01A46] font-medium"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FDE8ED] text-[#B01A46] font-medium"
                      >
                        Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="py-2.5 pb-4 md:hidden border-t border-[#EAE3DC]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search jewellery, bags, dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 text-xs bg-white border border-[#E2D8CF] rounded-full focus:outline-none focus:ring-1 focus:ring-[#B01A46]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#9E9086] absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] bg-[#241E1C] text-white px-2.5 py-1 rounded-full"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-[#EAE3DC] bg-[#FFFDFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-medium tracking-wider uppercase text-[#4A403A] py-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat && currentView === 'shop';
              return (
                <li key={cat} className="flex-shrink-0">
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('shop');
                    }}
                    className={`transition-colors py-1 hover:text-[#B01A46] relative ${
                      isActive ? 'text-[#B01A46] font-bold' : ''
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B01A46] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] w-4/5 max-w-sm h-full overflow-y-auto p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DC]">
                <span className="font-serif text-lg font-bold tracking-widest text-[#241E1C]">
                  SHOP BY CATEGORY
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-[#7A6D65]" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-medium flex items-center justify-between ${
                      selectedCategory === cat ? 'bg-[#FDE8ED] text-[#B01A46] font-bold' : 'text-[#4A403A] hover:bg-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#EAE3DC] space-y-2">
                <button
                  onClick={() => {
                    onOpenStyleFinder();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FDE8ED] text-[#B01A46] rounded-lg text-xs font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-[#CE285A]" />
                  <span>KITTUZ Style Finder</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-[#241E1C] hover:bg-white rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-[#7A6D65]" />
                  <span>My Profile & Order Tracking</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-[#8B1E3F] hover:bg-white rounded-lg flex items-center gap-2 font-semibold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3DC] text-[11px] text-[#7A6D65]">
              <p className="font-semibold text-[#241E1C]">Customer Concierge</p>
              <p>Email: care@kittuz.in</p>
              <p>Mon - Sat (10 AM - 7 PM IST)</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
