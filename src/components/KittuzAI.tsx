import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Send, Bot, User, ArrowRight, ShoppingBag } from 'lucide-react';
import { AIChatMessage, Product } from '../types';
import { useCart } from '../context/CartContext';

interface KittuzAIProps {
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

const QUICK_PROMPTS = [
  "✨ Recommend an outfit for a summer brunch",
  "🎁 Gift ideas for my best friend under ₹2,500",
  "🌸 What should I wear for a festive evening?",
  "👜 Best everyday luxury work tote bag",
  "💎 Tell me about the 18K baroque pearl choker"
];

export const KittuzAI: React.FC<KittuzAIProps> = ({
  allProducts,
  onSelectProduct
}) => {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "Namaste! I am Anya, your KITTUZ Senior Lifestyle Stylist. Whether you're curating a festive ensemble, finding an everyday work tote, or seeking a thoughtful bespoke gift, I'm here to assist you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Curate a brunch look",
        "Gifts under ₹2,000",
        "Best silk anarkali",
        "Trending jewellery"
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const resData = await response.json();

      if (resData.success && resData.data) {
        const assistantMsg: AIChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: resData.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProductIds: resData.data.recommendedProductIds
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      const fallbackMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: "I recommend exploring our signature Blush Chanderi Silk Kurta Set and Celeste 18K Baroque Pearl Choker — two of our most beloved handcrafted lifestyle pieces.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: ['ktz-c-01', 'ktz-j-01']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#241E1C] hover:bg-[#B01A46] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-[#F8ADC0]/40 group"
            aria-label="Open KITTUZ AI Stylist"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-[#F8ADC0] animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <span className="text-xs font-serif font-bold tracking-wider uppercase">
              KITTUZ AI Stylist
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EAE3DC] z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in">
          
          {/* Header */}
          <div className="p-4 bg-[#241E1C] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#B01A46] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-[#FDE8ED]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold tracking-wide">
                    Anya · KITTUZ Stylist
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-[#D8CEBC]">
                  AI-Powered Lifestyle & Luxury Fashion Concierge
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[#D8CEBC] hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const recommendedProducts = m.recommendedProductIds
                ? allProducts.filter(p => m.recommendedProductIds?.includes(p.id))
                : [];

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#241E1C] text-white rounded-tr-none'
                        : 'bg-white text-[#241E1C] border border-[#EAE3DC] rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isUser ? 'text-[#D8CEBC]' : 'text-[#A89D96]'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {/* Render Product Cards recommended by AI */}
                  {recommendedProducts.length > 0 && (
                    <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#B01A46]">
                        Curated Recommendations:
                      </p>
                      {recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EAE3DC] shadow-xs gap-3 hover:border-[#B01A46] transition-colors"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-lg bg-[#FAF8F5]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-[#241E1C] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#B01A46] font-bold">
                              ₹{p.price.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] text-[#A89D96] line-through font-normal">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onSelectProduct(p)}
                              className="px-2 py-1 text-[10px] font-semibold bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#241E1C] rounded-lg border border-[#EAE3DC]"
                            >
                              View
                            </button>
                            <button
                              onClick={() => addToCart(p)}
                              className="p-1 bg-[#241E1C] hover:bg-[#B01A46] text-white rounded-lg"
                              title="Add to Bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action Chips */}
                  {m.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.suggestedActions.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleSendMessage(action)}
                          className="text-[10px] bg-white border border-[#EAE3DC] px-2.5 py-1 rounded-full text-[#7A6D65] hover:text-[#B01A46] hover:border-[#B01A46] transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#EAE3DC] max-w-[70%] text-xs text-[#7A6D65]">
                <Bot className="w-4 h-4 text-[#B01A46] animate-bounce" />
                <span>Anya is styling your selection...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#EAE3DC] overflow-x-auto no-scrollbar flex gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap text-[11px] bg-white border border-[#E2D8CF] px-3 py-1.5 rounded-full text-[#4A403A] hover:bg-[#FDE8ED] hover:text-[#B01A46] hover:border-[#B01A46] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#EAE3DC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about fabrics, styling, gifts, sizing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CF] rounded-full focus:outline-none focus:ring-1 focus:ring-[#B01A46]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-[#241E1C] hover:bg-[#B01A46] text-white rounded-full disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
