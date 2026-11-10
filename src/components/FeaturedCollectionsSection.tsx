import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedCollectionsSectionProps {
  onSelectCollection: (collection: "Festive Radiance" | "Monochrome Chic" | "Pastel Reverie" | "Workplace Grace") => void;
}

const COLLECTIONS = [
  {
    title: "Festive Radiance" as const,
    tagline: "Regal Chanderi zari silks & 18K baroque pearls",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
    badge: "Festive Season Edit"
  },
  {
    title: "Workplace Grace" as const,
    tagline: "Sculpted Mulberry silk midis & Italian vegan leather totes",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=900",
    badge: "Executive Poise"
  },
  {
    title: "Pastel Reverie" as const,
    tagline: "Pure Belgian linen co-ords, scarves & soft hues",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900",
    badge: "Resort & Brunch"
  },
  {
    title: "Monochrome Chic" as const,
    tagline: "Midnight obsidian velvet dresses & mother-of-pearl timepieces",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=900",
    badge: "Evening Allure"
  }
];

export const FeaturedCollectionsSection: React.FC<FeaturedCollectionsSectionProps> = ({
  onSelectCollection
}) => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] border-b border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-2">
            Seasonal Editorials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241E1C]">
            Featured Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D65] mt-2">
            Discover four distinct stylistic narratives, each curated with harmonizing garments, accessories, and fragrant notes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.title}
              onClick={() => onSelectCollection(col.title)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[3/4] shadow-md border border-[#EAE3DC] hover:border-[#B01A46] transition-all duration-500"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#241E1C] px-3 py-1 rounded-full shadow-xs">
                  {col.badge}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {col.title}
                </h3>
                <p className="text-xs text-[#EAE3DC] mt-1 line-clamp-2 opacity-90">
                  {col.tagline}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#F8ADC0] transition-colors">
                  <span>Explore Edit</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
