import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES_METADATA } from '../data/products';
import { ProductCategory } from '../types';

interface ShopByCategorySectionProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const ShopByCategorySection: React.FC<ShopByCategorySectionProps> = ({
  onSelectCategory
}) => {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#F8F5F2] gap-4">
          <div>
            <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-1">
              Curated Universes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs text-[#7A6D65] max-w-sm">
            From handloom silks to 18K vermeil jewellery, explore tailored lifestyle essentials crafted for contemporary living.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES_METADATA.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name as ProductCategory)}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3DC] hover:border-[#B01A46] transition-all duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="aspect-[4/5] w-full overflow-hidden relative bg-[#F3EFEA]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#F3EFEA] line-clamp-1 mt-0.5 opacity-90">
                    {cat.tagline}
                  </p>
                </div>
              </div>

              {/* Bottom Link indicator */}
              <div className="py-2.5 px-3 bg-white flex items-center justify-between text-[11px] font-semibold text-[#241E1C] group-hover:text-[#B01A46] transition-colors">
                <span>Explore Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
