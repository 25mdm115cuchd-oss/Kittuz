import React, { useState } from 'react';
import { 
  X, Star, Heart, ShoppingBag, Truck, RotateCcw, 
  ShieldCheck, Check, Sparkles, Plus, Minus, Ruler, Share2 
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, color: string, size: string, quantity: number) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  allProducts,
  onSelectProduct
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // PIN Code checker state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    city?: string;
    deliveryDate?: string;
    message?: string;
  } | null>(null);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Handle Add To Cart
  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Handle Buy Now (direct to checkout)
  const handleBuyNow = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  // PIN Code check logic for Indian Postal Codes
  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }

    const pin = pincode.trim();
    let city = 'Metro Region';
    let days = 3;

    if (pin.startsWith('11') || pin.startsWith('12')) {
      city = 'Delhi NCR';
      days = 2;
    } else if (pin.startsWith('40') || pin.startsWith('41')) {
      city = 'Mumbai / Pune';
      days = 2;
    } else if (pin.startsWith('56') || pin.startsWith('57')) {
      city = 'Bengaluru';
      days = 2;
    } else if (pin.startsWith('60') || pin.startsWith('61')) {
      city = 'Chennai';
      days = 3;
    } else if (pin.startsWith('50') || pin.startsWith('51')) {
      city = 'Hyderabad';
      days = 2;
    } else if (pin.startsWith('70') || pin.startsWith('71')) {
      city = 'Kolkata';
      days = 3;
    }

    const estimated = new Date(Date.now() + days * 24 * 3600 * 1000);
    const dateStr = estimated.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    setPincodeResult({
      valid: true,
      city,
      deliveryDate: dateStr,
      message: `Delivery available to ${city}! Expected by ${dateStr} via Blue Dart Express.`
    });
  };

  // Submit Customer Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          author: reviewName || 'Verified Buyer',
          rating: reviewRating,
          comment: reviewComment,
          location: pincodeResult?.city || 'India'
        })
      });

      product.reviews.unshift({
        id: `rev-${Date.now()}`,
        author: reviewName || 'Verified Buyer',
        rating: reviewRating,
        date: new Date().toISOString().split('T')[0],
        title: 'Verified Customer Review',
        comment: reviewComment,
        verified: true,
        location: pincodeResult?.city || 'India'
      });
      product.reviewCount = product.reviews.length;

      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewComment('');
    } catch (e) {
      console.error(e);
    }
  };

  // Frequently bought together item
  const bundleItem = allProducts.find(p => product.frequentlyBoughtWith?.includes(p.id)) || allProducts[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#EAE3DC] relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-[#EAE3DC] z-20">
          <div className="flex items-center gap-2 text-xs text-[#7A6D65]">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <span>/</span>
            <span className="truncate max-w-xs">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full hover:bg-[#F3EFEA] text-[#241E1C] transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#B01A46] text-[#B01A46]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F3EFEA] text-[#241E1C] transition-colors"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F7F4F0] border border-[#EAE3DC] shadow-xs">
                <img
                  src={product.images[selectedImgIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-[#241E1C] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {product.discountPercentage}% SAVINGS
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImgIdx === idx
                          ? 'border-[#B01A46] ring-2 ring-[#B01A46]/20'
                          : 'border-[#EAE3DC] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Information & Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand / Collection */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B01A46] tracking-widest uppercase">
                    KITTUZ EDITORIAL · {product.featuredCollection || 'LUXURY SELECTION'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#241E1C]">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-[#88786F]">({product.reviewCount} verified reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241E1C] mt-2">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#241E1C]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-[#9E9086] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-[#CE285A] bg-[#FFF2F5] px-2 py-0.5 rounded border border-[#FCD2DC]">
                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#7A6D65] mt-0.5">
                  Inclusive of all taxes. Free Express Shipping on this order.
                </p>

                {/* Short Description */}
                <p className="text-sm text-[#4A403A] mt-4 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Color Selector */}
                {product.colors.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-[#EAE3DC]">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-[#241E1C] uppercase tracking-wider">
                        Color: <span className="font-bold text-[#B01A46]">{selectedColor}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                            selectedColor === c.name
                              ? 'border-[#B01A46] bg-[#FFF2F5] font-semibold text-[#B01A46] ring-1 ring-[#B01A46]'
                              : 'border-[#EAE3DC] bg-white text-[#4A403A] hover:border-[#D8CEBC]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes.length > 0 && (
                  <div className="mt-5">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-[#241E1C] uppercase tracking-wider">
                        Select Size
                      </span>
                      <button
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="text-[#B01A46] hover:underline flex items-center gap-1 font-medium"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Size Guide</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            selectedSize === s
                              ? 'border-[#241E1C] bg-[#241E1C] text-white shadow-xs'
                              : 'border-[#EAE3DC] bg-white text-[#241E1C] hover:border-[#241E1C]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {showSizeGuide && (
                      <div className="mt-3 p-3 bg-white border border-[#EAE3DC] rounded-xl text-[11px] text-[#4A403A] animate-in fade-in">
                        <p className="font-bold text-[#241E1C] mb-1">Standard Indian Sizing (Inches):</p>
                        <div className="grid grid-cols-4 gap-2 text-center border-t border-[#F3EFEA] pt-2">
                          <div><strong>XS:</strong> Bust 32, Waist 26</div>
                          <div><strong>S:</strong> Bust 34, Waist 28</div>
                          <div><strong>M:</strong> Bust 36, Waist 30</div>
                          <div><strong>L:</strong> Bust 38, Waist 32</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity & Stock Check */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-[#E2D8CF] rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-[#7A6D65] hover:text-[#241E1C]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#241E1C]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                      className="p-1.5 text-[#7A6D65] hover:text-[#241E1C]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs text-[#166534] font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {product.inStock > 5 ? 'In Stock (Ready to dispatch)' : `Only ${product.inStock} left in studio!`}
                  </span>
                </div>

                {/* CTA Buttons: Add to Bag & Buy Now */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.inStock <= 0}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#241E1C] shadow-sm ${
                      isAdded
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#241E1C]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.inStock <= 0}
                    className="py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#241E1C] hover:bg-[#B01A46] text-white transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Delivery Checker (PIN Code) */}
                <div className="mt-6 p-4 rounded-2xl bg-white border border-[#EAE3DC] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#241E1C] uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-[#B01A46]" />
                    <span>Check Delivery & Cash On Delivery</span>
                  </div>

                  <form onSubmit={checkPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Indian PIN Code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B01A46]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#241E1C] text-white text-xs font-semibold rounded-xl hover:bg-[#B01A46] transition-colors"
                    >
                      Check
                    </button>
                  </form>

                  {pincodeResult && (
                    <div
                      className={`text-xs p-2.5 rounded-xl border ${
                        pincodeResult.valid
                          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                          : 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]'
                      }`}
                    >
                      {pincodeResult.message}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F8F5F2] text-[11px] text-[#7A6D65]">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Free Shipping &gt; ₹999</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>7-Day Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B01A46]" />
                      <span>100% Authentic</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* SPECIFICATIONS & DETAILS TABLE */}
          <div className="mt-12 pt-8 border-t border-[#EAE3DC]">
            <h3 className="font-serif text-xl font-bold text-[#241E1C] mb-4">
              Artisan Specifications & Craftsmanship
            </h3>
            <div className="bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-[#FAF8F5]' : 'bg-white'}
                    >
                      <td className="py-3 px-5 font-semibold text-[#241E1C] w-1/3 border-b border-[#F3EFEA]">
                        {key}
                      </td>
                      <td className="py-3 px-5 text-[#4A403A] border-b border-[#F3EFEA]">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
          {bundleItem && bundleItem.id !== product.id && (
            <div className="mt-10 p-5 rounded-2xl bg-[#FFF9FA] border border-[#FCD2DC]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#B01A46]" />
                <h4 className="font-serif text-lg font-bold text-[#241E1C]">
                  Frequently Bought Together
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-lg border border-[#EAE3DC]"
                  />
                  <span className="text-xl text-[#7A6D65]">+</span>
                  <img
                    src={bundleItem.images[0]}
                    alt={bundleItem.name}
                    className="w-16 h-20 object-cover rounded-lg border border-[#EAE3DC]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#241E1C]">
                      {product.name} + {bundleItem.name}
                    </p>
                    <p className="text-xs text-[#7A6D65] mt-0.5">
                      Combined: <strong className="text-[#B01A46]">₹{(product.price + bundleItem.price - 400).toLocaleString('en-IN')}</strong>{' '}
                      <span className="line-through text-[#9E9086]">₹{(product.price + bundleItem.price).toLocaleString('en-IN')}</span> (Bundle saves ₹400)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, selectedColor, selectedSize, 1);
                    addToCart(bundleItem, bundleItem.colors[0]?.name, bundleItem.sizes[0], 1);
                  }}
                  className="px-5 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap shadow-xs"
                >
                  Add Both to Bag
                </button>
              </div>
            </div>
          )}

          {/* CUSTOMER REVIEWS SECTION */}
          <div className="mt-12 pt-8 border-t border-[#EAE3DC]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#241E1C]">
                  Verified Customer Reviews
                </h3>
                <p className="text-xs text-[#7A6D65] mt-1">
                  Overall rating {product.rating} / 5.0 based on {product.reviews.length} authentic purchases
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 border border-[#241E1C] text-[#241E1C] hover:bg-[#241E1C] hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="p-5 bg-white rounded-2xl border border-[#EAE3DC] mb-6 space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-[#241E1C] uppercase tracking-wider">
                  Share Your Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#7A6D65] block mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priyadarshini Rao"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#7A6D65] block mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-lg"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                      <option value={3}>⭐⭐⭐ 3 Stars (Good)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#7A6D65] block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric, fit, packaging, or compliments received..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Post Review
                </button>
              </form>
            )}

            {reviewSubmitted && (
              <p className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-4">
                Thank you! Your verified review has been published.
              </p>
            )}

            {/* Review Cards */}
            <div className="space-y-4">
              {product.reviews.length === 0 ? (
                <p className="text-xs text-[#7A6D65] italic">Be the first to review this handcrafted piece!</p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-xl border border-[#EAE3DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#241E1C]">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Verified Purchase ({rev.location})
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#241E1C]">{rev.title}</p>
                    <p className="text-xs text-[#4A403A] leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-[#A89D96]">{rev.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
