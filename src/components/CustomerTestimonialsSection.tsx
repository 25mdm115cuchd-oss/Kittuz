import React from 'react';
import { Star, Check, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    city: 'Mumbai',
    quote: 'The Blush Chanderi Silk Kurta Set is regal beyond words. The zari work is exceptionally fine and the sheer organza dupatta draped like a dream at our Diwali soirée.',
    product: 'Blush Chanderi Silk Anarkali Set',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Meera Iyer',
    city: 'Chennai',
    quote: 'I ordered the Le Marais Trapeze bag for my daily office meetings. The Italian vegan leather is buttery yet sturdy, easily accommodating my iPad and diary without losing shape.',
    product: 'Le Marais Trapeze Bag',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
  },
  {
    name: 'Kritika Roy',
    city: 'Kolkata',
    quote: 'Genuine baroque freshwater pearls with such iridescent lustre are rare to find at this honest price. The 18K gold clasp is completely hypoallergenic for sensitive skin.',
    product: 'Celeste 18K Pearl Choker',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300'
  }
];

export const CustomerTestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-2">
            The Women of KITTUZ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241E1C]">
            Cherished Experiences
          </h2>
          <p className="text-xs text-[#7A6D65] mt-2">
            Hear from discerning women across India who elevate their daily rituals with KITTUZ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 sm:p-8 bg-[#FAF8F5] rounded-3xl border border-[#EAE3DC] flex flex-col justify-between shadow-xs hover:border-[#D8CEBC] transition-all"
            >
              <div>
                <div className="flex text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#F8ADC0] mb-2 opacity-60" />
                <p className="font-serif text-sm sm:text-base text-[#241E1C] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#EAE3DC] flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E2D8CF]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-[#241E1C]">{t.name}</p>
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-[10px] text-[#7A6D65]">{t.city} · Verified Purchase</p>
                  <p className="text-[10px] text-[#B01A46] font-medium mt-0.5">{t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
