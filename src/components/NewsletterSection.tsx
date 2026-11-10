import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const NewsletterSection: React.FC = () => {
  const { applyCoupon } = useCart();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rewardCode, setRewardCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setRewardCode(data.code || 'WELCOME10');
        setMessage(data.message);
        setEmail('');
      }
    } catch {
      setMessage('Thank you for subscribing to the KITTUZ circle!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyWelcomeCode = async () => {
    if (rewardCode) {
      await applyCoupon(rewardCode);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#FAF8F5] border-b border-[#EAE3DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-12 h-12 rounded-full bg-[#FFF2F5] text-[#B01A46] flex items-center justify-center mx-auto mb-4 border border-[#FCD2DC]">
          <Sparkles className="w-6 h-6" />
        </div>

        <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-2">
          The KITTUZ Circle
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241E1C]">
          An Invitation to Everyday Elegance
        </h2>

        <p className="text-xs sm:text-sm text-[#7A6D65] max-w-lg mx-auto mt-2 leading-relaxed">
          Subscribe to receive private preview access to artisanal seasonal drops, private concierge style notes, and an exclusive <strong>10% welcome privilege</strong> on your first order.
        </p>

        {rewardCode ? (
          <div className="mt-8 p-6 bg-white rounded-3xl border border-[#FCD2DC] max-w-md mx-auto shadow-sm animate-in fade-in">
            <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-serif text-lg font-bold text-[#241E1C]">{message}</h4>
            <div className="mt-4 p-3 bg-[#FFF2F5] rounded-xl flex items-center justify-between border border-[#F8ADC0]">
              <span className="font-mono font-bold text-sm text-[#B01A46]">{rewardCode}</span>
              <button
                onClick={handleApplyWelcomeCode}
                className="px-3 py-1 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Apply to Bag
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your personal email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3.5 text-xs bg-white border border-[#E2D8CF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B01A46] placeholder:text-[#9E9086] shadow-xs"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'JOIN'}
            </button>
          </form>
        )}

        <p className="text-[10px] text-[#A89D96] mt-4">
          By subscribing you agree to receive mindful updates from KITTUZ. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
};
