import React from 'react';
import { Instagram, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface InstagramShoppableSectionProps {
  onSelectProductById: (productId: string) => void;
}

const INSTA_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    handle: '@kittuz.lifestyle',
    tag: 'Shop The Look',
    productId: 'ktz-c-02'
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    handle: '@ananya_style',
    tag: 'Trapeze Tote',
    productId: 'ktz-h-01'
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    handle: '@meera.iyer',
    tag: 'Baroque Pearls',
    productId: 'ktz-j-01'
  },
  {
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    handle: '@pooja_sanctuary',
    tag: 'Amber Candle',
    productId: 'ktz-l-01'
  }
];

export const InstagramShoppableSection: React.FC<InstagramShoppableSectionProps> = ({
  onSelectProductById
}) => {
  return (
    <section className="py-16 md:py-20 bg-[#FAF8F5] border-b border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE3DC] gap-4">
          <div>
            <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-1">
              Social Community
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
              #MyKittuzStyle
            </h2>
          </div>
          <a
            href="#instagram"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#241E1C] hover:text-[#B01A46] transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#B01A46]" />
            <span>Follow @kittuz.lifestyle on Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {INSTA_POSTS.map((post, idx) => (
            <div
              key={idx}
              onClick={() => onSelectProductById(post.productId)}
              className="group cursor-pointer relative aspect-square rounded-3xl overflow-hidden shadow-xs border border-[#EAE3DC] bg-white"
            >
              <img
                src={post.image}
                alt="Instagram Look"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center">
                <ShoppingBag className="w-6 h-6 mb-2 text-[#F8ADC0]" />
                <p className="text-xs font-bold tracking-wider uppercase">{post.tag}</p>
                <p className="text-[10px] text-[#D8CEBC] mt-0.5">{post.handle}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
