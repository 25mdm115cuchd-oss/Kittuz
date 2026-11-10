import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreCollection: () => void;
  onOpenStyleFinder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopNow,
  onExploreCollection,
  onOpenStyleFinder
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2F5] border border-[#FCD2DC] text-[#B01A46] text-xs font-semibold tracking-wider uppercase animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-[#CE285A]" />
              <span>THE AUTUMN-WINTER 2026 EDITORIAL</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#241E1C] tracking-tight leading-[1.08]">
              Elevate Your <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#B01A46]">Everyday.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A4F48] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover the little things that make every day extraordinary. Artisanal Chanderi silks, 18K gold vermeil baroque pearls, and architectural leather totes crafted for mindful luxury.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-[#241E1C] hover:bg-[#B01A46] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCollection}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F3EFEA] text-[#241E1C] border border-[#D8CEBC] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xs"
              >
                EXPLORE COLLECTION
              </button>
            </div>

            {/* Trust Pill Highlights */}
            <div className="pt-6 border-t border-[#EAE3DC] grid grid-cols-3 gap-4 text-[11px] text-[#7A6D65] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Truck className="w-4 h-4 text-[#B01A46] flex-shrink-0" />
                <span>Pan-India Free Shipping &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <RotateCcw className="w-4 h-4 text-[#B01A46] flex-shrink-0" />
                <span>7-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-[#B01A46] flex-shrink-0" />
                <span>100% Genuine Certified</span>
              </div>
            </div>

          </div>

          {/* Editorial Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Editorial Hero Image */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                  alt="KITTUZ Premium Lifestyle Model"
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Floating Stylist Badge */}
                <div
                  onClick={onOpenStyleFinder}
                  className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE3DC] shadow-lg cursor-pointer hover:border-[#B01A46] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FFF2F5] text-[#B01A46] flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-xs text-[#241E1C]">
                          KITTUZ Style Finder
                        </p>
                        <p className="text-[10px] text-[#7A6D65]">
                          Discover your personalized look in 60 seconds
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B01A46] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Decorative Accent Card */}
              <div className="hidden sm:block absolute -top-4 -right-4 p-4 bg-white rounded-2xl shadow-xl border border-[#EAE3DC] max-w-[170px] text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B01A46]">Handcrafted</p>
                <p className="font-serif text-sm font-bold text-[#241E1C] mt-0.5">18K Gold Vermeil</p>
                <p className="text-[10px] text-[#7A6D65] mt-0.5">Baroque freshwater pearls</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
