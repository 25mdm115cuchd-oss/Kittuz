import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ShopCatalogViewProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

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

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onSelectProduct,
  onQuickView
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Price
    list = list.filter(p => p.price <= maxPrice);

    // Stock
    if (onlyInStock) {
      list = list.filter(p => p.inStock > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else {
      // featured / popularity
      list.sort((a, b) => (b.isBestseller || b.isTrending ? 1 : 0) - (a.isBestseller || a.isTrending ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, maxPrice, onlyInStock, sortBy]);

  const resetAllFilters = () => {
    onSelectCategory('All');
    onClearSearch();
    setMaxPrice(8000);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header Breadcrumb & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#7A6D65] uppercase tracking-wider mb-2">
          <span>Home</span>
          <span>/</span>
          <span>Boutique Catalog</span>
          <span>/</span>
          <span className="text-[#B01A46] font-semibold">{selectedCategory}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
              {selectedCategory === 'All' ? 'Complete Lifestyle Catalog' : selectedCategory}
            </h1>
            <p className="text-xs text-[#7A6D65] mt-1">
              Showing {filteredProducts.length} curated handcrafted designs
            </p>
          </div>

          {/* Sort Selector & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="lg:hidden px-4 py-2 bg-white border border-[#E2D8CF] rounded-xl text-xs font-semibold text-[#241E1C] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-[#E2D8CF] rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7A6D65]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-transparent font-semibold text-[#241E1C] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' || searchQuery || maxPrice < 8000 || onlyInStock) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#F8F5F2]">
            <span className="text-xs text-[#7A6D65]">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-[#EAE3DC] rounded-full text-[#241E1C]">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onSelectCategory('All')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-[#EAE3DC] rounded-full text-[#241E1C]">
                Search: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={onClearSearch} />
              </span>
            )}
            {maxPrice < 8000 && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-[#EAE3DC] rounded-full text-[#241E1C]">
                Max: ₹{maxPrice.toLocaleString('en-IN')}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(8000)} />
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-[#EAE3DC] rounded-full text-[#241E1C]">
                In Stock Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyInStock(false)} />
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#B01A46] font-semibold hover:underline ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-[#EAE3DC] shadow-xs space-y-6 sticky top-28">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#241E1C] mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === cat
                        ? 'bg-[#FFF2F5] text-[#B01A46] font-bold'
                        : 'text-[#4A403A] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'All' ? (
                      <span className="text-[10px] text-[#A89D96]">{products.length}</span>
                    ) : (
                      <span className="text-[10px] text-[#A89D96]">
                        {products.filter(p => p.category === cat).length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="pt-5 border-t border-[#F8F5F2]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-serif text-base font-bold text-[#241E1C]">
                Max Price
              </h3>
              <span className="text-xs font-bold text-[#B01A46]">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={8000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Filter by maximum price"
              className="w-full accent-[#B01A46] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9E9086] mt-1">
              <span>₹1,000</span>
              <span>₹8,000+</span>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-5 border-t border-[#F8F5F2]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#241E1C] font-semibold">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#B01A46] focus:ring-[#B01A46] accent-[#B01A46]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE3DC] p-12 text-center space-y-4">
              <p className="font-serif text-2xl font-bold text-[#241E1C]">
                No matching lifestyle pieces found
              </p>
              <p className="text-xs text-[#7A6D65] max-w-sm mx-auto">
                Try loosening your filters, adjusting the maximum price slider, or resetting your category query.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex justify-end">
          <div className="bg-[#FAF8F5] w-4/5 max-w-sm h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#EAE3DC]">
                <h3 className="font-serif text-lg font-bold text-[#241E1C]">Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X className="w-5 h-5 text-[#7A6D65]" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#241E1C] uppercase tracking-wider mb-2">Category</h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs ${
                          selectedCategory === cat ? 'bg-[#FFF2F5] text-[#B01A46] font-bold' : 'text-[#4A403A]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE3DC]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold">Max Price</span>
                    <span className="text-[#B01A46] font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={8000}
                    step={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    aria-label="Filter by maximum price"
                    className="w-full accent-[#B01A46]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3 bg-[#241E1C] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
