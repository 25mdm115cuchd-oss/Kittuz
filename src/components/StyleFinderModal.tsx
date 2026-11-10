import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { Product, ProductCategory, StyleQuizResult } from '../types';
import { useCart } from '../context/CartContext';

interface StyleFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const StyleFinderModal: React.FC<StyleFinderModalProps> = ({
  isOpen,
  onClose,
  allProducts,
  onSelectProduct
}) => {
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Answers state
  const [stylePreference, setStylePreference] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [preferredCategories, setPreferredCategories] = useState<ProductCategory[]>([]);
  const [budgetRange, setBudgetRange] = useState('');
  const [occasion, setOccasion] = useState('');

  // Results state
  const [quizResult, setQuizResult] = useState<StyleQuizResult | null>(null);

  if (!isOpen) return null;

  const handleCategoryToggle = (cat: ProductCategory) => {
    setPreferredCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const calculateResult = () => {
    let persona = 'The Modern Romantic';
    let description = 'Soft silhouettes, luminous pearls, and timeless blush silks curated for effortlessly elevated everyday grace.';
    let matchedIds = ['ktz-c-01', 'ktz-j-01', 'ktz-h-02'];

    if (stylePreference === 'Minimalist Chic' || occasion === 'Office / Executive') {
      persona = 'The Effortless Minimalist';
      description = 'Clean tailoring, architectural vegan leather, and discreet gold accents that move with poise from boardroom to evening dinner.';
      matchedIds = ['ktz-c-02', 'ktz-h-01', 'ktz-w-01', 'ktz-f-01'];
    } else if (stylePreference === 'Festive Regal' || occasion === 'Festive / Wedding') {
      persona = 'The Regal Classicist';
      description = 'Opulent handloom Chanderi silks, zari details, and heirloom baroque pearls celebrating India’s rich textile heritage.';
      matchedIds = ['ktz-c-01', 'ktz-j-01', 'ktz-a-01', 'ktz-g-01'];
    } else if (stylePreference === 'Bohemian Glow' || occasion === 'Travel / Resort') {
      persona = 'The Sunlit Bohemian';
      description = 'Breezy Belgian linens, hand-woven bamboo textures, and botanical rose quartz skincare for sun-kissed wanderlust.';
      matchedIds = ['ktz-c-03', 'ktz-t-01', 'ktz-b-01'];
    } else if (stylePreference === 'Modern Glam') {
      persona = 'The Evening Luminary';
      description = 'Plush obsidian velvet, pavé Austrian crystals, and statement silhouettes tailored for unforgettable galas and celebrations.';
      matchedIds = ['ktz-t-02', 'ktz-j-02', 'ktz-w-01'];
    }

    const result: StyleQuizResult = {
      stylePersona: persona,
      styleDescription: description,
      colorPalette: [favoriteColor || 'Blush Rose', 'Warm Ivory', 'Champagne Gold'],
      recommendedCategories: preferredCategories.length > 0 ? preferredCategories : ["Women's Clothing", "Jewellery", "Handbags & Purses"],
      preferredBudget: budgetRange || 'Moderate Luxury (₹2,500 - ₹5,000)',
      recommendedProductIds: matchedIds,
      outfitRecommendation: {
        title: `Signature ${persona} Look`,
        description: 'A harmonic complete look designed by KITTUZ stylists.',
        productIds: matchedIds.slice(0, 3)
      }
    };

    setQuizResult(result);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setQuizResult(null);
    setStylePreference('');
    setFavoriteColor('');
    setPreferredCategories([]);
    setBudgetRange('');
    setOccasion('');
  };

  const recommendedProducts = quizResult
    ? allProducts.filter(p => quizResult.recommendedProductIds.includes(p.id))
    : [];

  const outfitProducts = quizResult
    ? allProducts.filter(p => quizResult.outfitRecommendation.productIds.includes(p.id))
    : [];

  const handleAddEntireOutfit = () => {
    for (const p of outfitProducts) {
      addToCart(p, p.colors[0]?.name, p.sizes[0], 1);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EAE3DC] relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EAE3DC]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B01A46]" />
            <h2 className="font-serif text-lg font-bold text-[#241E1C]">
              KITTUZ Personal Style Finder
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#7A6D65] hover:text-[#241E1C]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {!quizResult ? (
            <div>
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[#7A6D65] mb-2 font-medium">
                  <span>Step {step} of {totalSteps}</span>
                  <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-[#EAE3DC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B01A46] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 1: Style Preference */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                    How would you describe your core fashion aesthetic?
                  </h3>
                  <p className="text-xs text-[#7A6D65]">
                    Select the visual identity that resonates most with your lifestyle.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: 'Minimalist Chic', desc: 'Monochrome palettes, tailored cuts, and understated luxury.' },
                      { title: 'Festive Regal', desc: 'Handcrafted silks, zari embroidery, and heritage baroque pearls.' },
                      { title: 'Bohemian Glow', desc: 'Pure breathable linens, organic textures, and effortless fluidity.' },
                      { title: 'Modern Glam', desc: 'Velvet silhouettes, statement jewellery, and evening allure.' },
                      { title: 'Casual Everyday', desc: 'Soft fabrics, cloud mules, and dependable chic essentials.' }
                    ].map((opt) => (
                      <button
                        key={opt.title}
                        onClick={() => setStylePreference(opt.title)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          stylePreference === opt.title
                            ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                            : 'bg-white border-[#EAE3DC] hover:border-[#D8CEBC]'
                        }`}
                      >
                        <p className="font-bold text-sm text-[#241E1C]">{opt.title}</p>
                        <p className="text-xs text-[#7A6D65] mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Color Palette */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                    Which color palette brings out your best confidence?
                  </h3>
                  <p className="text-xs text-[#7A6D65]">
                    We curate products that complement your skin tone and personal palette.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { name: 'Blush Pink & Rose', hex: '#F4C2C2', desc: 'Gentle, feminine, and romantic.' },
                      { name: 'Warm Ivory & Champagne', hex: '#FFFDD0', desc: 'Timeless, clean, and classic.' },
                      { name: 'Jewel Emerald & Sapphire', hex: '#1B4D3E', desc: 'Rich, celebratory, and regal.' },
                      { name: 'Classic Monochrome & Onyx', hex: '#241E1C', desc: 'Sharp, modern, and executive.' },
                      { name: 'Earthy Terracotta & Oat', hex: '#C66B4E', desc: 'Warm, grounded, and organic.' }
                    ].map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setFavoriteColor(col.name)}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          favoriteColor === col.name
                            ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                            : 'bg-white border-[#EAE3DC] hover:border-[#D8CEBC]'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div>
                          <p className="font-bold text-sm text-[#241E1C]">{col.name}</p>
                          <p className="text-xs text-[#7A6D65]">{col.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Categories of Interest */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                    Which lifestyle categories are you shopping for?
                  </h3>
                  <p className="text-xs text-[#7A6D65]">
                    Select all that you would love in your personalized collection.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      "Women's Clothing",
                      "Handbags & Purses",
                      "Jewellery",
                      "Beauty & Personal Care",
                      "Footwear",
                      "Watches",
                      "Lifestyle Essentials",
                      "Gift Sets"
                    ].map((cat) => {
                      const selected = preferredCategories.includes(cat as ProductCategory);
                      return (
                        <button
                          key={cat}
                          onClick={() => handleCategoryToggle(cat as ProductCategory)}
                          className={`p-3 rounded-2xl border text-center transition-all text-xs font-semibold ${
                            selected
                              ? 'bg-[#241E1C] text-white border-[#241E1C]'
                              : 'bg-white text-[#241E1C] border-[#EAE3DC] hover:border-[#B01A46]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Budget Range */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                    What is your target budget for this curation?
                  </h3>
                  <p className="text-xs text-[#7A6D65]">
                    We match authentic pieces within your preferred investment range.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { label: 'Under ₹2,000', desc: 'Chic everyday jewellery, scarves, candles & essentials' },
                      { label: '₹2,000 – ₹4,000', desc: 'Artisanal linen co-ords, mules & cloud shoulder bags' },
                      { label: '₹4,000 – ₹7,000', desc: 'Chanderi silk anarkalis, structured leather totes & hampers' },
                      { label: 'Luxury ₹7,000+', desc: 'Complete bespoke wardrobe ensembles and curated sets' }
                    ].map((b) => (
                      <button
                        key={b.label}
                        onClick={() => setBudgetRange(b.label)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          budgetRange === b.label
                            ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                            : 'bg-white border-[#EAE3DC] hover:border-[#D8CEBC]'
                        }`}
                      >
                        <p className="font-bold text-sm text-[#241E1C]">{b.label}</p>
                        <p className="text-xs text-[#7A6D65] mt-1">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Shopping Occasions */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#241E1C]">
                    What primary occasion are you styling for?
                  </h3>
                  <p className="text-xs text-[#7A6D65]">
                    Select the moment you want to feel extraordinary in.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { label: 'Brunch & Weekend Chic', desc: 'Effortless relaxation with friends and family.' },
                      { label: 'Office / Executive Presence', desc: 'Polished, sharp, and all-day comfort.' },
                      { label: 'Festive / Wedding Ceremonies', desc: 'Celebratory royalty, puja mornings, and sangeet glam.' },
                      { label: 'Travel & Resort Retreats', desc: 'Airy fabrics, woven bamboo, and glowing skincare.' },
                      { label: 'Bespoke Gifting', desc: 'Pampering a loved one with luxury keepsakes.' }
                    ].map((occ) => (
                      <button
                        key={occ.label}
                        onClick={() => setOccasion(occ.label)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          occasion === occ.label
                            ? 'bg-[#FFF2F5] border-[#B01A46] ring-1 ring-[#B01A46]'
                            : 'bg-white border-[#EAE3DC] hover:border-[#D8CEBC]'
                        }`}
                      >
                        <p className="font-bold text-sm text-[#241E1C]">{occ.label}</p>
                        <p className="text-xs text-[#7A6D65] mt-1">{occ.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Nav Controls */}
              <div className="mt-8 pt-4 border-t border-[#EAE3DC] flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-semibold text-[#7A6D65] hover:text-[#241E1C]"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>{step === totalSteps ? 'Curate My Style' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-8 animate-in fade-in">
              <div className="p-6 bg-gradient-to-br from-[#FFF5F7] via-white to-[#FDF0F3] rounded-3xl border border-[#FCD2DC] text-center">
                <span className="text-xs font-bold text-[#B01A46] uppercase tracking-widest block mb-1">
                  Your Signature Style Archetype
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#241E1C]">
                  {quizResult.stylePersona}
                </h3>
                <p className="text-xs text-[#4A403A] max-w-lg mx-auto mt-2 leading-relaxed">
                  {quizResult.styleDescription}
                </p>

                {/* Color Palette Indicators */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-xs text-[#7A6D65] mr-1">Your Curated Palette:</span>
                  {quizResult.colorPalette.map((col) => (
                    <span
                      key={col}
                      className="px-3 py-1 bg-white border border-[#EAE3DC] rounded-full text-[11px] font-medium text-[#241E1C]"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Complete Suggested Outfit Bundle */}
              {outfitProducts.length > 0 && (
                <div className="p-6 bg-white rounded-3xl border border-[#EAE3DC] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F8F5F2]">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-[#241E1C]">
                        {quizResult.outfitRecommendation.title}
                      </h4>
                      <p className="text-xs text-[#7A6D65]">
                        {quizResult.outfitRecommendation.description}
                      </p>
                    </div>

                    <button
                      onClick={handleAddEntireOutfit}
                      className="px-5 py-2.5 bg-[#241E1C] hover:bg-[#B01A46] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Complete Look to Bag</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {outfitProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="cursor-pointer group flex sm:flex-col items-center sm:items-start gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DC] hover:border-[#B01A46] transition-all"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-20 sm:w-full sm:aspect-[3/4] object-cover rounded-xl bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase text-[#7A6D65]">{p.category}</p>
                          <p className="font-semibold text-xs text-[#241E1C] truncate mt-0.5 group-hover:text-[#B01A46]">
                            {p.name}
                          </p>
                          <p className="text-xs font-bold text-[#241E1C] mt-1">
                            ₹{p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Product Matches */}
              <div>
                <h4 className="font-serif text-xl font-bold text-[#241E1C] mb-4">
                  Handpicked Pieces Matching Your Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-4 p-4 bg-white rounded-2xl border border-[#EAE3DC] hover:border-[#B01A46] transition-colors"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-20 h-24 object-cover rounded-xl bg-[#FAF8F5] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase text-[#7A6D65]">{p.category}</p>
                          <h5 className="font-semibold text-xs text-[#241E1C] line-clamp-1 mt-0.5">
                            {p.name}
                          </h5>
                          <p className="text-xs font-bold text-[#B01A46] mt-1">
                            ₹{p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                            className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[11px] font-semibold text-[#241E1C] rounded-lg border border-[#EAE3DC]"
                          >
                            View
                          </button>
                          <button
                            onClick={() => addToCart(p)}
                            className="px-3 py-1 bg-[#241E1C] hover:bg-[#B01A46] text-white text-[11px] font-semibold rounded-lg"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Quiz Button */}
              <div className="pt-4 border-t border-[#EAE3DC] text-center">
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1.5 text-xs text-[#7A6D65] hover:text-[#241E1C] underline font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Style Finder with different preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
