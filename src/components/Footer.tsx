import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { ProductCategory } from '../types';
import { LegalPageType } from './LegalPagesModal';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenLegalPage: (page: LegalPageType) => void;
  onNavigate: (view: 'home' | 'shop' | 'dashboard' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenLegalPage,
  onNavigate
}) => {
  return (
    <footer className="bg-[#241E1C] text-[#FAF8F5] pt-16 pb-12 border-t border-[#3A322F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#3A322F]">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] uppercase block text-white">
                K I T T U Z
              </span>
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#D8CEBC] block font-medium mt-1">
                Your Style. Your Lifestyle.
              </span>
            </div>
            
            <p className="text-xs text-[#D8CEBC] leading-relaxed max-w-sm">
              India’s premier women’s luxury lifestyle destination. Handcrafted Chanderi silks, 18K gold vermeil jewellery, structured Italian vegan leather, and mindful sanctuary essentials.
            </p>

            <div className="space-y-1.5 text-xs text-[#D8CEBC] pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F8ADC0]" />
                <span>Atelier: Bandra West, Mumbai, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F8ADC0]" />
                <span>care@kittuz.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F8ADC0]" />
                <span>+91 98201 44521 (Mon-Sat 10AM-7PM)</span>
              </p>
            </div>
          </div>

          {/* Shop Categories Column */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F8ADC0]">
              Collections
            </p>
            <ul className="space-y-2 text-xs text-[#D8CEBC]">
              {[
                "Women's Clothing",
                "Handbags & Purses",
                "Jewellery",
                "Fashion Accessories",
                "Beauty & Personal Care",
                "Footwear",
                "Watches",
                "Gift Sets"
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat as ProductCategory);
                      onNavigate('shop');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F8ADC0]">
              Client Services
            </p>
            <ul className="space-y-2 text-xs text-[#D8CEBC]">
              <li>
                <button onClick={() => onOpenLegalPage('shipping')} className="hover:text-white transition-colors">
                  Pan-India Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('returns')} className="hover:text-white transition-colors">
                  7-Day Return & Exchange
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('cancellation')} className="hover:text-white transition-colors">
                  Order Cancellation Workflow
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('faqs')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Order Tracking & Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('contact')} className="hover:text-white transition-colors">
                  Concierge Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F8ADC0]">
              The Atelier
            </p>
            <ul className="space-y-2 text-xs text-[#D8CEBC]">
              <li>
                <button onClick={() => onOpenLegalPage('about')} className="hover:text-white transition-colors">
                  About KITTUZ
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalPage('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors font-semibold text-[#F8ADC0]">
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Payment Rails & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A89D96]">
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[11px] font-semibold text-[#D8CEBC]">Secured by:</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] text-white font-mono">Razorpay</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] text-white font-mono">UPI / GPay / PhonePe</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] text-white font-mono">Visa / Mastercard</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] text-white font-mono">Cash on Delivery</span>
          </div>

          <div className="text-center md:text-right">
            <p>© 2026 KITTUZ Luxury Lifestyle Private Limited. All rights reserved.</p>
            <p className="text-[10px] text-[#88786F] mt-0.5 flex items-center justify-center md:justify-end gap-1">
              <span>Handcrafted with</span>
              <Heart className="w-3 h-3 text-[#CE285A] fill-current" />
              <span>in Mumbai, India</span>
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};
