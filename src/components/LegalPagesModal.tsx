import React from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export type LegalPageType =
  | 'about'
  | 'contact'
  | 'faqs'
  | 'privacy'
  | 'terms'
  | 'shipping'
  | 'returns'
  | 'cancellation';

interface LegalPagesModalProps {
  pageType: LegalPageType | null;
  onClose: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({ pageType, onClose }) => {
  if (!pageType) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EAE3DC] relative my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE3DC]">
          <h2 className="font-serif text-xl font-bold text-[#241E1C]">
            {pageType === 'about' && 'About KITTUZ'}
            {pageType === 'contact' && 'Concierge & Contact Us'}
            {pageType === 'faqs' && 'Frequently Asked Questions'}
            {pageType === 'privacy' && 'Privacy Policy'}
            {pageType === 'terms' && 'Terms & Conditions'}
            {pageType === 'shipping' && 'Pan-India Shipping Policy'}
            {pageType === 'returns' && '7-Day Return & Refund Policy'}
            {pageType === 'cancellation' && 'Order Cancellation Policy'}
          </h2>
          <button onClick={onClose} className="p-2 text-[#7A6D65] hover:text-[#241E1C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 text-xs leading-relaxed text-[#4A403A] space-y-4">
          
          {pageType === 'about' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#B01A46] tracking-widest uppercase block">
                Your Style. Your Lifestyle.
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                Elevating Everyday Poise for the Modern Indian Woman
              </h3>
              <p>
                Founded with a reverence for timeless craftsmanship and quiet luxury, <strong>KITTUZ</strong> was conceived to bring effortless elegance to modern Indian living. We believe that true luxury lies in the touch of authentic Mulberry silk, the enduring luster of 18K gold vermeil, the sculpted structure of vegan leather, and the mindful tranquility of a hand-poured soy candle.
              </p>
              <p>
                Based in Mumbai, each collection is curated with zero compromises on quality, ethical sustainability, and artisan pride. We bridge heirloom Indian textile traditions with contemporary global silhouettes, designed for women who navigate boardrooms, festive gatherings, and sunlit weekend brunches with effortless grace.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EAE3DC] text-center">
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3DC]">
                  <p className="font-serif text-xl font-bold text-[#241E1C]">100%</p>
                  <p className="text-[10px] text-[#7A6D65] uppercase mt-1">Artisanal Integrity</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3DC]">
                  <p className="font-serif text-xl font-bold text-[#241E1C]">7-Day</p>
                  <p className="text-[10px] text-[#7A6D65] uppercase mt-1">Boutique Return</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3DC]">
                  <p className="font-serif text-xl font-bold text-[#241E1C]">Pan-India</p>
                  <p className="text-[10px] text-[#7A6D65] uppercase mt-1">Express Dispatch</p>
                </div>
              </div>
            </div>
          )}

          {pageType === 'contact' && (
            <div className="space-y-6">
              <p>
                Our private concierge team is dedicated to assisting you with bespoke styling, order inquiries, bespoke wedding gifting, and sizing assistance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-[#EAE3DC] flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#B01A46] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#241E1C]">Customer Concierge</p>
                    <p className="text-[#7A6D65]">care@kittuz.in</p>
                    <p className="text-[10px] text-[#A89D96] mt-1">Response within 4 business hours</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[#EAE3DC] flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#B01A46] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#241E1C]">WhatsApp Concierge</p>
                    <p className="text-[#7A6D65]">+91 98201 44521</p>
                    <p className="text-[10px] text-[#A89D96] mt-1">Mon - Sat (10 AM - 7 PM IST)</p>
                  </div>
                </div>

                <div className="sm:col-span-2 p-5 bg-white rounded-2xl border border-[#EAE3DC] flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B01A46] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#241E1C]">Studio Flagship & Atelier</p>
                    <p className="text-[#7A6D65]">
                      KITTUZ Atelier, Sea Pearl Residences, Bandra West, Mumbai, Maharashtra 400050, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {pageType === 'faqs' && (
            <div className="space-y-4">
              {[
                {
                  q: 'Are your pearls and gemstones authentic?',
                  a: 'Yes. All KITTUZ jewellery pieces utilize genuine Grade-AAA cultured freshwater baroque pearls and 18K gold vermeil on solid 925 sterling silver. Each piece arrives with our Studio Authenticity Certificate.'
                },
                {
                  q: 'What is the standard delivery timeframe in India?',
                  a: 'Orders shipped via Blue Dart or Delhivery Air typically arrive in 2–3 business days for metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Kolkata, Chennai) and 3–5 business days for regional hubs.'
                },
                {
                  q: 'Is Cash on Delivery (COD) supported?',
                  a: 'Yes, Cash on Delivery is available across all serviceable Indian PIN codes with a nominal ₹49 handling fee.'
                },
                {
                  q: 'How does your 7-Day Return policy work?',
                  a: 'If you wish to exchange a size or return an unworn piece with original tags intact, simply initiate a request from your Customer Dashboard within 7 days of delivery. Our courier will pick up the package from your doorstep.'
                }
              ].map((faq, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-[#EAE3DC]">
                  <p className="font-bold text-[#241E1C] mb-1">{faq.q}</p>
                  <p className="text-[#7A6D65]">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {pageType === 'shipping' && (
            <div className="space-y-3">
              <p>
                KITTUZ provides <strong>Complimentary Express Delivery</strong> across India on all orders exceeding ₹999. For orders below ₹999, a flat delivery fee of ₹99 applies.
              </p>
              <p>
                Every parcel is insured and packed with utmost care, using custom unboxing tissue, satin ribbons, and tamper-evident courier seals.
              </p>
              <p>
                Live tracking numbers from Blue Dart or Delhivery are issued via SMS and Email as soon as your parcel is dispatched.
              </p>
            </div>
          )}

          {pageType === 'returns' && (
            <div className="space-y-3">
              <p>
                We want you to fall in love with every KITTUZ lifestyle piece. If an item doesn't fit or meet your expectations, we gladly offer a <strong>7-Day Return or Exchange</strong> from the date of receipt.
              </p>
              <p>
                Returned items must be unused, unwashed, and in their original packaging with all boutique tags and certificates intact.
              </p>
              <p>
                Refunds are processed back to the original payment source (Razorpay, UPI, or Bank Account for COD) within 48 hours of quality inspection at our atelier.
              </p>
            </div>
          )}

          {pageType === 'cancellation' && (
            <div className="space-y-3">
              <p>
                Orders can be cancelled free of charge at any time prior to warehouse handover and dispatch directly through your <strong>My Orders</strong> dashboard.
              </p>
              <p>
                Once an order has been picked up by the air courier, cancellation is not possible; however, you may utilize our 7-day doorstep return upon arrival.
              </p>
            </div>
          )}

          {pageType === 'privacy' && (
            <div className="space-y-3">
              <p>
                KITTUZ respects your personal privacy. We do not sell, rent, or trade your personal information to third parties. Customer data is encrypted with SSL banking grade standards and used solely for fulfilling orders and communicating updates.
              </p>
            </div>
          )}

          {pageType === 'terms' && (
            <div className="space-y-3">
              <p>
                By placing an order on KITTUZ, you agree to our standard terms of trade, authentic Indian product warranty, and fair usage guidelines. All disputes are subject to the exclusive jurisdiction of the courts of Mumbai, India.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#EAE3DC] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
