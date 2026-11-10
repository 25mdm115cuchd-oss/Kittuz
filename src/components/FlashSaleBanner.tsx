import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Clock, Zap } from 'lucide-react';

interface FlashSaleBannerProps {
  onShopSale: () => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ onShopSale }) => {
  // 14 hours countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-[#241E1C] via-[#351E25] to-[#241E1C] text-white overflow-hidden relative border-y border-[#EAE3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B01A46]/30 border border-[#F8ADC0]/40 text-[#F8ADC0] text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>LIMITED-TIME FESTIVE SOIRÉE PRIVILEGE</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              Enjoy Complimentary 15% Savings Across All Collections
            </h3>
            <p className="text-xs sm:text-sm text-[#D8CEBC] max-w-xl">
              Use code <strong className="text-white underline font-mono tracking-wider">KITTUZ15</strong> at checkout. Includes complimentary luxury ribbon gift boxing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Countdown Boxes */}
            <div className="flex items-center gap-3 font-mono text-center">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[64px]">
                <span className="block text-xl sm:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#D8CEBC]">Hours</span>
              </div>
              <span className="text-xl font-bold text-[#F8ADC0]">:</span>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[64px]">
                <span className="block text-xl sm:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#D8CEBC]">Mins</span>
              </div>
              <span className="text-xl font-bold text-[#F8ADC0]">:</span>
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[64px]">
                <span className="block text-xl sm:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#D8CEBC]">Secs</span>
              </div>
            </div>

            <button
              onClick={onShopSale}
              className="px-6 py-3.5 bg-[#B01A46] hover:bg-[#CE285A] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
            >
              <span>CLAIM OFFER</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
