import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ShopByCategorySection } from './components/ShopByCategorySection';
import { ProductCard } from './components/ProductCard';
import { FeaturedCollectionsSection } from './components/FeaturedCollectionsSection';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { CustomerTestimonialsSection } from './components/CustomerTestimonialsSection';
import { InstagramShoppableSection } from './components/InstagramShoppableSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { KittuzAI } from './components/KittuzAI';
import { StyleFinderModal } from './components/StyleFinderModal';
import { CheckoutModal } from './components/CheckoutModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalPagesModal, LegalPageType } from './components/LegalPagesModal';
import { ShopCatalogView } from './components/ShopCatalogView';
import { Product, ProductCategory, Order } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, Truck } from 'lucide-react';

const KITTUZAppContent: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'dashboard' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStyleFinderOpen, setIsStyleFinderOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPageType | null>(null);

  // Fetch latest products from API
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (e) {
      console.warn('Using local catalog fallback', e);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Filter shortcuts
  const trendingProducts = products.filter(p => p.isTrending);
  const bestsellers = products.filter(p => p.isBestseller);
  const newArrivals = products.filter(p => p.isNewArrival);

  const handleSelectCategory = (cat: ProductCategory | 'All') => {
    setSelectedCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCollection = (col: "Festive Radiance" | "Monochrome Chic" | "Pastel Reverie" | "Workplace Grace") => {
    setSelectedCategory('All');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product, color: string, size: string, quantity: number) => {
    addToCart(product, color, size, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    console.log('Order completed:', order.orderNumber);
    refreshProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#241E1C]">
      
      {/* Primary Navigation Bar */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        onOpenStyleFinder={() => setIsStyleFinderOpen(true)}
        onOpenSearch={handleSearch}
        onNavigate={(view) => {
          if (view === 'about') {
            setLegalPage('about');
          } else if (view === 'contact') {
            setLegalPage('contact');
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        currentView={currentView}
      />

      {/* Main Content Router */}
      <div className="flex-1">
        
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <main>
            {/* 1. Large Editorial Hero Banner */}
            <HeroSection
              onShopNow={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCollection={() => {
                setSelectedCategory("Women's Clothing");
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenStyleFinder={() => setIsStyleFinderOpen(true)}
            />

            {/* 2. Shop by Category Section */}
            <ShopByCategorySection
              onSelectCategory={(cat) => handleSelectCategory(cat)}
            />

            {/* 3. Trending Now Grid */}
            <section className="py-16 md:py-20 bg-[#FAF8F5] border-b border-[#EAE3DC]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE3DC] gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-1">
                      Cult Favorites
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
                      Trending Now
                    </h2>
                  </div>
                  <button
                    onClick={() => handleSelectCategory('Trending Products')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#241E1C] hover:text-[#B01A46] transition-colors"
                  >
                    <span>View All Trending</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trendingProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Featured Collections Narrative */}
            <FeaturedCollectionsSection
              onSelectCollection={handleSelectCollection}
            />

            {/* 5. Limited-Time Flash Sale Banner with Countdown */}
            <FlashSaleBanner
              onShopSale={() => {
                setSelectedCategory('All');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6. Bestselling Products */}
            <section className="py-16 md:py-20 bg-white border-b border-[#EAE3DC]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#F8F5F2] gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-1">
                      Most Loved By Discerning Patrons
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
                      Bestselling Masterpieces
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentView('shop');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#241E1C] hover:text-[#B01A46] transition-colors"
                  >
                    <span>Browse All Bestsellers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestsellers.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 7. Full-Width Editorial Storytelling Quote */}
            <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE3DC] text-center px-4">
              <div className="max-w-3xl mx-auto space-y-4">
                <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block">
                  The Art of Mindful Elegance
                </span>
                <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#241E1C] leading-snug italic">
                  "True style is not about having everything, but cherishing the few exquisite pieces that bring harmony, dignity, and beauty to your everyday rhythm."
                </blockquote>
                <p className="text-xs text-[#7A6D65] uppercase tracking-widest pt-2">
                  — KITTUZ Atelier Design Philosophy
                </p>
              </div>
            </section>

            {/* 8. Verified Customer Testimonials */}
            <CustomerTestimonialsSection />

            {/* 9. Shoppable Instagram Gallery */}
            <InstagramShoppableSection
              onSelectProductById={(id) => {
                const prod = products.find(p => p.id === id);
                if (prod) setSelectedProduct(prod);
              }}
            />

            {/* 10. Newsletter Subscription */}
            <NewsletterSection />
          </main>
        )}

        {/* VIEW 2: SHOP / CATALOG */}
        {currentView === 'shop' && (
          <ShopCatalogView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickView={(p) => setSelectedProduct(p)}
          />
        )}

        {/* VIEW 3: USER DASHBOARD */}
        {currentView === 'dashboard' && (
          <UserDashboard
            allProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenStyleFinder={() => setIsStyleFinderOpen(true)}
          />
        )}

        {/* VIEW 4: ADMIN CONSOLE */}
        {currentView === 'admin' && (
          <AdminDashboard
            onExitAdmin={() => setCurrentView('home')}
            allProducts={products}
            onRefreshProducts={refreshProducts}
          />
        )}

      </div>

      {/* Global Luxury Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenLegalPage={(page) => setLegalPage(page)}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreProducts={() => {
          setSelectedCategory('All');
          setCurrentView('shop');
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* KITTUZ AI Assistant Floating Stylist */}
      <KittuzAI
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* KITTUZ Style Finder Quiz Modal */}
      <StyleFinderModal
        isOpen={isStyleFinderOpen}
        onClose={() => setIsStyleFinderOpen(false)}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Checkout Modal with Razorpay & Address Verification */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Legal & Trust Policies Modal */}
      <LegalPagesModal
        pageType={legalPage}
        onClose={() => setLegalPage(null)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <KITTUZAppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
