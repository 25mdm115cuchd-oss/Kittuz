import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, product.sizes[0]);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl border border-[#EAE3DC] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#D8CEBC] relative"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F4F0]">
        <img
          src={isHovered ? secondaryImage : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#241E1C] hover:text-[#B01A46] shadow-sm transition-all hover:scale-110 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'fill-[#B01A46] text-[#B01A46]' : 'text-[#4A403A]'
            }`}
          />
        </button>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-[#241E1C] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-xs">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Quick Actions Overlay (Desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={product.inStock <= 0}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#241E1C] hover:bg-[#B01A46] text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.inStock > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
              </>
            )}
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 bg-white text-[#241E1C] hover:text-[#B01A46] rounded-xl shadow-md transition-colors"
              title="Quick view details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-[11px] text-[#7A6D65] uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            {product.featuredCollection && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#B01A46] font-medium">{product.featuredCollection}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base font-semibold text-[#241E1C] line-clamp-1 group-hover:text-[#B01A46] transition-colors">
            {product.name}
          </h3>

          {/* Color Swatch Dots */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-2 ring-[#B01A46] ring-offset-1 scale-110'
                      : 'border-[#D8CEBC]'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="text-[10px] text-[#9E9086] ml-1">
                {product.colors.length} shades
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Rating Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-[#F8F5F2] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#241E1C]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#A89D96] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold text-[#4A403A]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[#A89D96] font-normal text-[11px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
