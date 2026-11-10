import { Product, Coupon } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Women's Clothing
  {
    id: 'ktz-c-01',
    name: 'Blush Chanderi Silk Anarkali Kurta Set',
    slug: 'blush-chanderi-silk-anarkali-kurta-set',
    category: "Women's Clothing",
    price: 3899,
    originalPrice: 5999,
    discountPercentage: 35,
    shortDescription: 'Handcrafted Chanderi silk anarkali with delicate zari embroidery, accompanied by organza dupatta and tailored pants.',
    description: 'Imbued with regal Indian charm, our signature Blush Chanderi Silk Kurta Set is tailored from luminous hand-spun Chanderi silk. Features delicate golden zari thread work along the scalloped neckline and sleeves, accompanied by an ethereal sheer organza dupatta with hand-tasseled borders. Designed for festive mornings, sundowners, and intimate celebrations.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Blush Rose', hex: '#F4C2C2' },
      { name: 'Ivory Cream', hex: '#FFFDD0' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: [
      { id: 'var-c01-s', colorName: 'Blush Rose', colorHex: '#F4C2C2', size: 'S', sku: 'KTZ-CLO-01-S', inStock: 12 },
      { id: 'var-c01-m', colorName: 'Blush Rose', colorHex: '#F4C2C2', size: 'M', sku: 'KTZ-CLO-01-M', inStock: 18 },
      { id: 'var-c01-l', colorName: 'Blush Rose', colorHex: '#F4C2C2', size: 'L', sku: 'KTZ-CLO-01-L', inStock: 8 }
    ],
    rating: 4.9,
    reviewCount: 48,
    reviews: [
      {
        id: 'rev-c01-1',
        author: 'Ananya Deshmukh',
        rating: 5,
        date: '2026-10-14',
        title: 'Breathtaking quality and fabric!',
        comment: 'Wore this for Diwali puja and received countless compliments. The zari work is subtle yet looks extraordinarily luxurious. Fits like a glove.',
        verified: true,
        location: 'Mumbai'
      },
      {
        id: 'rev-c01-2',
        author: 'Pooja Kashyap',
        rating: 5,
        date: '2026-10-02',
        title: 'Worth every rupee',
        comment: 'The organza dupatta is so soft and lightweight. Stitching finish is top boutique grade.',
        verified: true,
        location: 'Bengaluru'
      }
    ],
    specifications: {
      'Fabric': 'Pure Handloom Chanderi Silk & Organza',
      'Weave Type': 'Zari Buti Handloom',
      'Neckline': 'Sweetheart with Scallop Zari Edge',
      'Sleeve Length': 'Three-Quarter (17 inches)',
      'Care Instructions': 'Dry Clean Only',
      'Country of Origin': 'India',
      'Package Contents': '1 Kurta, 1 Trousers, 1 Dupatta'
    },
    inStock: 38,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Festive Radiance',
    tags: ['kurta set', 'silk', 'festive', 'traditional', 'blush pink', 'chanderi'],
    frequentlyBoughtWith: ['ktz-j-01', 'ktz-h-01']
  },
  {
    id: 'ktz-c-02',
    name: 'Aurelia Pleated Mulberry Silk Midi Dress',
    slug: 'aurelia-pleated-mulberry-silk-midi-dress',
    category: "Women's Clothing",
    price: 3299,
    originalPrice: 4799,
    discountPercentage: 31,
    shortDescription: 'Sculpted pleated waist midi dress in premium silk blend with a flattering square neck and flutter sleeves.',
    description: 'Designed for effortless contemporary poise. The Aurelia Midi Dress is woven from a featherlight Mulberry silk-viscose blend. Featuring an accordion-pleated flared skirt, a structured square collar, and subtle side pockets. Perfect from boardroom presentations to weekend high teas.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Champagne Beige', hex: '#F7E7CE' },
      { name: 'Midnight Onyx', hex: '#1C1C1E' },
      { name: 'Dusty Rose', hex: '#DCAE96' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'var-c02-s', colorName: 'Champagne Beige', colorHex: '#F7E7CE', size: 'S', sku: 'KTZ-CLO-02-S', inStock: 14 },
      { id: 'var-c02-m', colorName: 'Champagne Beige', colorHex: '#F7E7CE', size: 'M', sku: 'KTZ-CLO-02-M', inStock: 22 }
    ],
    rating: 4.8,
    reviewCount: 32,
    reviews: [
      {
        id: 'rev-c02-1',
        author: 'Rhea Sen',
        rating: 5,
        date: '2026-09-28',
        title: 'Effortlessly chic and elegant',
        comment: 'The pleating retains its shape even after full day wear. Fabric drape is sublime.',
        verified: true,
        location: 'New Delhi'
      }
    ],
    specifications: {
      'Fabric': '70% Mulberry Silk, 30% Modal',
      'Fit': 'A-Line Fit and Flare',
      'Length': 'Midi (46 inches)',
      'Care Instructions': 'Gentle Machine Wash Cold / Steam Iron',
      'Country of Origin': 'India'
    },
    inStock: 36,
    isTrending: false,
    isBestseller: true,
    featuredCollection: 'Workplace Grace',
    tags: ['midi dress', 'silk', 'workwear', 'pleated', 'beige'],
    frequentlyBoughtWith: ['ktz-w-01', 'ktz-h-02']
  },
  {
    id: 'ktz-c-03',
    name: 'Seraphina Linen Wrap Co-ord Set',
    slug: 'seraphina-linen-wrap-co-ord-set',
    category: "Women's Clothing",
    price: 2499,
    originalPrice: 3699,
    discountPercentage: 32,
    shortDescription: 'Relaxed Belgian linen tailored crop shirt with high-waisted wide-leg trousers in warm oat.',
    description: 'Breathe easy in pure artisanal Belgian linen. The Seraphina co-ord features an adjustable tie-wrap waist blazer crop paired with fluid pleated palazzo pants. Imbues effortless French-Riviera style tailored for warm Indian climates.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Warm Oat', hex: '#E6DAC8' },
      { name: 'Terracotta', hex: '#C66B4E' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'var-c03-s', colorName: 'Warm Oat', colorHex: '#E6DAC8', size: 'S', sku: 'KTZ-CLO-03-S', inStock: 16 }
    ],
    rating: 4.7,
    reviewCount: 29,
    reviews: [],
    specifications: {
      'Fabric': '100% Breathable Organic Flax Linen',
      'Pattern': 'Solid Texture',
      'Care': 'Gentle hand wash or dry clean',
      'Country of Origin': 'India'
    },
    inStock: 25,
    isNewArrival: true,
    featuredCollection: 'Pastel Reverie',
    tags: ['linen', 'co-ord', 'resort wear', 'minimalist'],
    frequentlyBoughtWith: ['ktz-f-01', 'ktz-a-01']
  },

  // 2. Handbags & Purses
  {
    id: 'ktz-h-01',
    name: 'Le Marais Trapeze Structured Leather Bag',
    slug: 'le-marais-trapeze-structured-leather-bag',
    category: 'Handbags & Purses',
    price: 4499,
    originalPrice: 6999,
    discountPercentage: 36,
    shortDescription: 'Italian grain vegan leather tote with 24k brushed gold hardware, detachable shoulder strap, and suede interior.',
    description: 'Architectural silhouette meets daily functionality. Crafted from supple Italian micro-grain vegan leather that is water-resistant and scratch-proof. Features an expandable magnetic side gusset, central zippered divider for laptops up to 13 inches, and reinforced protective metal base feet.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Almond Beige', hex: '#DEC8B0' },
      { name: 'Rose Taupe', hex: '#905D5D' },
      { name: 'Noir Black', hex: '#111111' }
    ],
    sizes: ['One Size'],
    variants: [
      { id: 'var-h01-almond', colorName: 'Almond Beige', colorHex: '#DEC8B0', sku: 'KTZ-BAG-01-ALM', inStock: 15 }
    ],
    rating: 5.0,
    reviewCount: 64,
    reviews: [
      {
        id: 'rev-h01-1',
        author: 'Meera Iyer',
        rating: 5,
        date: '2026-10-18',
        title: 'Luxurious beyond expectations',
        comment: 'Looks and feels like a ₹25,000 designer handbag. The gold hardware has substantial weight and zero tarnish. Love the dedicated iPad pocket.',
        verified: true,
        location: 'Chennai'
      }
    ],
    specifications: {
      'Material': 'High-Grade Microfiber Vegan Leather',
      'Hardware': '24k Brushed Gold Zinc-Alloy',
      'Dimensions': '32 cm x 24 cm x 13 cm',
      'Strap Drop': '12 cm Handle / 52 cm Adjustable Crossbody',
      'Lining': 'Peach Suede Microfiber',
      'Warranty': '1 Year Kittuz Artisan Warranty'
    },
    inStock: 24,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Workplace Grace',
    tags: ['handbag', 'vegan leather', 'tote', 'luxury bag', 'beige bag'],
    frequentlyBoughtWith: ['ktz-c-02', 'ktz-w-01']
  },
  {
    id: 'ktz-h-02',
    name: 'Petite Lune Crescent Cloud Shoulder Bag',
    slug: 'petite-lune-crescent-cloud-shoulder-bag',
    category: 'Handbags & Purses',
    price: 2799,
    originalPrice: 3999,
    discountPercentage: 30,
    shortDescription: 'Ruched croissant crescent bag with magnetic curved closure and buttery soft silhouette.',
    description: 'The viral ‘it-girl’ accessory reimagined with elevated craftsmanship. Gently ruched top-grain faux nappa with a comfortable padded shoulder strap. Ample room for smartphone, cosmetic pouch, cardholder, and keys.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Butter Cream', hex: '#FDF4DC' },
      { name: 'Soft Sage', hex: '#ADC2A9' },
      { name: 'Rosé Pink', hex: '#E8B4B8' }
    ],
    sizes: ['One Size'],
    variants: [
      { id: 'var-h02-butter', colorName: 'Butter Cream', colorHex: '#FDF4DC', sku: 'KTZ-BAG-02-BUT', inStock: 19 }
    ],
    rating: 4.8,
    reviewCount: 41,
    reviews: [],
    specifications: {
      'Material': 'Ultra-Soft Vegan Nappa',
      'Closure': 'Concealed Magnetic Flap + YKK Zip',
      'Dimensions': '28 cm x 16 cm x 8 cm',
      'Country of Origin': 'India'
    },
    inStock: 30,
    isTrending: true,
    featuredCollection: 'Pastel Reverie',
    tags: ['shoulder bag', 'crescent', 'pastel', 'trending bag'],
    frequentlyBoughtWith: ['ktz-j-02']
  },

  // 3. Jewellery
  {
    id: 'ktz-j-01',
    name: 'Celeste 18K Gold Vermeil Freshwater Pearl Choker',
    slug: 'celeste-18k-gold-vermeil-freshwater-pearl-choker',
    category: 'Jewellery',
    price: 2199,
    originalPrice: 3499,
    discountPercentage: 37,
    shortDescription: 'Baroque lustrous freshwater pearls interspaced with 18K gold-dipped pebble beads and an adjustable extender chain.',
    description: 'Graceful, timeless, and radiant. Hand-selected organic baroque freshwater pearls known for their deep iridescent lustre, strung with double-knotted silk thread and finished with thick 2.5-micron 18 Karat gold vermeil on solid sterling silver. Hypoallergenic, nickel-free, and sweat-resistant.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Classic Gold & Pearl', hex: '#E5C158' }
    ],
    sizes: ['16 - 18 inch adjustable'],
    variants: [
      { id: 'var-j01-std', colorName: 'Classic Gold & Pearl', colorHex: '#E5C158', sku: 'KTZ-JWL-01', inStock: 25 }
    ],
    rating: 4.9,
    reviewCount: 88,
    reviews: [
      {
        id: 'rev-j01-1',
        author: 'Kritika Roy',
        rating: 5,
        date: '2026-10-22',
        title: 'Authentic pearls, gorgeous glow',
        comment: 'You can tell these are natural baroque pearls because each has a unique, organic shape and brilliant shine. The clasp is sturdy and doesn’t irritate sensitive skin.',
        verified: true,
        location: 'Kolkata'
      }
    ],
    specifications: {
      'Base Metal': '925 Sterling Silver',
      'Plating': '18K Yellow Gold Vermeil (2.5 Micron)',
      'Stone': 'AAA Grade Cultured Freshwater Baroque Pearls',
      'Chain Length': '40 cm + 5 cm extension',
      'Skin Friendly': '100% Nickel & Lead Free (Hypoallergenic)',
      'Certification': 'Artisan Authenticity Certificate Included'
    },
    inStock: 35,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Festive Radiance',
    tags: ['jewellery', 'pearl necklace', 'gold vermeil', 'choker', 'hypoallergenic'],
    frequentlyBoughtWith: ['ktz-c-01', 'ktz-j-02']
  },
  {
    id: 'ktz-j-02',
    name: 'Aura Molten Huggie Hoops with Pavé Zircon',
    slug: 'aura-molten-huggie-hoops-with-pave-zircon',
    category: 'Jewellery',
    price: 1499,
    originalPrice: 2299,
    discountPercentage: 35,
    shortDescription: 'Organic molten-texture gold huggie earrings studded with brilliant micro-pavé Austrian cubic zirconia.',
    description: 'Subtle daily shimmer. Inspired by fluid molten gold drops, these huggies gently clasp the earlobe with a secure clicker latch. Dipped in 18k thick gold plating for long-lasting brilliance.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1611591475819-79b8b73ff267?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Yellow Gold', hex: '#E5C158' },
      { name: 'Rose Gold', hex: '#E0A899' },
      { name: 'Silver Platinum', hex: '#E5E5E5' }
    ],
    sizes: ['12mm'],
    variants: [
      { id: 'var-j02-yg', colorName: 'Yellow Gold', colorHex: '#E5C158', sku: 'KTZ-JWL-02-YG', inStock: 30 }
    ],
    rating: 4.9,
    reviewCount: 52,
    reviews: [],
    specifications: {
      'Plating': '18K PVD Gold Electroplated (Tarnish Resistant)',
      'Diameter': '12 mm outer / 9 mm inner',
      'Stone Type': '5A Brilliant Micro Cubic Zirconia',
      'Weight': '2.8 grams per pair'
    },
    inStock: 45,
    isTrending: true,
    isBestseller: true,
    tags: ['earrings', 'huggie hoops', 'gold earrings', 'cubic zirconia'],
    frequentlyBoughtWith: ['ktz-j-01']
  },

  // 4. Fashion Accessories
  {
    id: 'ktz-a-01',
    name: 'Jardin de Fleurs Pure Twill Silk Scarf',
    slug: 'jardin-de-fleurs-pure-twill-silk-scarf',
    category: 'Fashion Accessories',
    price: 1699,
    originalPrice: 2499,
    discountPercentage: 32,
    shortDescription: '100% Mulberry silk square twill scarf with hand-rolled edges featuring botanical Mughal garden motifs.',
    description: 'A masterpiece of wearable art. Illustrating blooming roses, jasmine vines, and songbirds in heritage blush, emerald, and champagne tones. Can be styled around the neck, tied onto your handbag handle, or worn as an elegant headwrap.',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Blush Botanical', hex: '#F2D3D8' },
      { name: 'Emerald Royale', hex: '#2A5D44' }
    ],
    sizes: ['70 cm x 70 cm'],
    variants: [
      { id: 'var-a01-blush', colorName: 'Blush Botanical', colorHex: '#F2D3D8', sku: 'KTZ-ACC-01-BLU', inStock: 20 }
    ],
    rating: 4.8,
    reviewCount: 37,
    reviews: [],
    specifications: {
      'Material': '100% 16-Momme Mulberry Silk Twill',
      'Edge Finish': 'Hand-Rolled & Stitched Artisan Hem',
      'Dimensions': '70 cm x 70 cm (27.5 x 27.5 inches)',
      'Care': 'Gentle Hand Wash with Silk Detergent or Dry Clean'
    },
    inStock: 22,
    isNewArrival: true,
    featuredCollection: 'Pastel Reverie',
    tags: ['silk scarf', 'accessories', 'floral scarf', 'luxury gift'],
    frequentlyBoughtWith: ['ktz-h-01']
  },

  // 5. Beauty & Personal Care
  {
    id: 'ktz-b-01',
    name: 'Rose Quartz Facial Sculpting Roller & Gua Sha Elixir Kit',
    slug: 'rose-quartz-facial-sculpting-roller-and-gua-sha-kit',
    category: 'Beauty & Personal Care',
    price: 1899,
    originalPrice: 2899,
    discountPercentage: 34,
    shortDescription: 'Certified authentic Brazilian rose quartz dual roller with heart-wing gua sha and a 30ml 24K Saffron Glow Elixir.',
    description: 'Awaken your inner radiance with the ancient ritual of crystal lymphatic drainage. Crafted from genuine, non-porous Madagascan rose quartz that stays naturally cool. Paired with our cold-pressed Kashmiri Saffron and Rosehip botanical face elixir for an unmatched luminous dewiness.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Natural Rose Quartz', hex: '#FAD2E1' }
    ],
    sizes: ['Standard Set'],
    variants: [
      { id: 'var-b01-std', colorName: 'Natural Rose Quartz', colorHex: '#FAD2E1', sku: 'KTZ-BTY-01', inStock: 35 }
    ],
    rating: 4.9,
    reviewCount: 76,
    reviews: [
      {
        id: 'rev-b01-1',
        author: 'Shalini Nambiar',
        rating: 5,
        date: '2026-10-10',
        title: 'Deeply relaxing & visible glow',
        comment: 'The stone stays cold on the skin even without keeping it in the fridge! The saffron serum smells like heavenly pure roses and absorbs immediately without grease.',
        verified: true,
        location: 'Hyderabad'
      }
    ],
    specifications: {
      'Stone': '100% Grade-A Natural Brazilian Rose Quartz',
      'Serum Ingredients': 'Cold-Pressed Rosehip, Saffron Stigmas, Kumkumadi Extract, 24k Gold Flakes',
      'Kit Includes': 'Dual-End Facial Roller, Heart-Wing Gua Sha Stone, 30ml Elixir Oil, Velvet Storage Pouch',
      'Skin Type': 'All Skin Types (Dermatologically Tested)'
    },
    inStock: 40,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Pastel Reverie',
    tags: ['skincare', 'gua sha', 'rose quartz', 'facial roller', 'glow serum'],
    frequentlyBoughtWith: ['ktz-l-01']
  },

  // 6. Footwear
  {
    id: 'ktz-f-01',
    name: 'Paloma Braided Nappa Leather Block Heel Mules',
    slug: 'paloma-braided-nappa-leather-block-heel-mules',
    category: 'Footwear',
    price: 2999,
    originalPrice: 4299,
    discountPercentage: 30,
    shortDescription: 'Cushioned memory-foam footbed mules with hand-woven tubular braided straps and a comfortable 2.2-inch block heel.',
    description: 'Walk on clouds from morning meetings to evening dinners. The Paloma Mules feature ultra-soft tubular braided straps that gently conform to your foot without pinching. Equipped with dual-layer cloud memory foam and non-slip rubber outsoles.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Vanilla Cream', hex: '#F9F5EB' },
      { name: 'Latte Tan', hex: '#C4A482' },
      { name: 'Blush Nude', hex: '#E8CCD7' }
    ],
    sizes: ['EU 36 (UK 3)', 'EU 37 (UK 4)', 'EU 38 (UK 5)', 'EU 39 (UK 6)', 'EU 40 (UK 7)'],
    variants: [
      { id: 'var-f01-37', colorName: 'Vanilla Cream', colorHex: '#F9F5EB', size: 'EU 37 (UK 4)', sku: 'KTZ-FTW-01-37', inStock: 12 },
      { id: 'var-f01-38', colorName: 'Vanilla Cream', colorHex: '#F9F5EB', size: 'EU 38 (UK 5)', sku: 'KTZ-FTW-01-38', inStock: 15 }
    ],
    rating: 4.8,
    reviewCount: 38,
    reviews: [],
    specifications: {
      'Heel Height': '2.2 inches (5.5 cm) Sturdy Block Heel',
      'Insole': '6mm Dual-Density Orthopedic Memory Cushion',
      'Upper': 'Supple Breathable Vegan Nappa',
      'Sole': 'Anti-Skid Textured German Rubber'
    },
    inStock: 28,
    isBestseller: true,
    featuredCollection: 'Workplace Grace',
    tags: ['heels', 'mules', 'block heels', 'comfortable shoes', 'nude heels'],
    frequentlyBoughtWith: ['ktz-c-02', 'ktz-h-01']
  },

  // 7. Watches
  {
    id: 'ktz-w-01',
    name: 'Soleil Petite Sunray Dial Mesh Watch in Rose Gold',
    slug: 'soleil-petite-sunray-dial-mesh-watch-rose-gold',
    category: 'Watches',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    shortDescription: 'Japanese quartz movement with mother-of-pearl dial, rose gold ion-plated Milanese mesh strap, and 3 ATM water resistance.',
    description: 'An understated icon of poise. Featuring an authentic shimmering natural Mother-of-Pearl dial catches the light with subtle iridescence. Housed in a slim 28mm stainless steel case with ultra-flexible Milanese mesh that adjusts effortlessly to any wrist circumference.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Silver Slate', hex: '#C0C0C0' }
    ],
    sizes: ['28mm Case'],
    variants: [
      { id: 'var-w01-rg', colorName: 'Rose Gold', colorHex: '#B76E79', sku: 'KTZ-WCH-01-RG', inStock: 18 }
    ],
    rating: 4.9,
    reviewCount: 57,
    reviews: [
      {
        id: 'rev-w01-1',
        author: 'Divya Malhotra',
        rating: 5,
        date: '2026-10-15',
        title: 'Exquisite dial and featherlight feel',
        comment: 'The mother-of-pearl reflection is mesmerizing in sunlight. Magnetic adjustable clasp makes it easy to put on single-handedly.',
        verified: true,
        location: 'Pune'
      }
    ],
    specifications: {
      'Movement': 'Miyota Japanese High-Precision Quartz',
      'Case Material': '316L Surgical Stainless Steel (IP Rose Gold Plated)',
      'Dial': 'Natural Luminescent Mother of Pearl',
      'Glass': 'Scratch-Resistant Sapphire Crystal Coated Mineral',
      'Water Resistance': '3 ATM (Splash / Rain resistant)',
      'Warranty': '2 Years Kittuz Movement Guarantee'
    },
    inStock: 26,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Monochrome Chic',
    tags: ['watch', 'rose gold watch', 'milanese mesh', 'mother of pearl', 'minimal watch'],
    frequentlyBoughtWith: ['ktz-j-02', 'ktz-h-01']
  },

  // 8. Lifestyle Essentials
  {
    id: 'ktz-l-01',
    name: 'Kashmir Amber & French Vanilla Scented Soy Candle',
    slug: 'kashmir-amber-french-vanilla-scented-soy-candle',
    category: 'Lifestyle Essentials',
    price: 1199,
    originalPrice: 1699,
    discountPercentage: 29,
    shortDescription: 'Hand-poured coconut soy candle in ribbed ceramic vessel with wooden crackling wick. 50+ hours clean burn time.',
    description: 'Transform your personal sanctuary into a tranquil retreat. Infused with warm notes of Kashmiri amber, velvety French vanilla bean, sandalwood, and soft white musk. Housed in a custom handmade cream fluted ceramic vessel that can be repurposed as a jewellery holder.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1572726729437-373264426210?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Warm Cream Ceramic', hex: '#FAF6EE' }
    ],
    sizes: ['280g / 9.8 oz'],
    variants: [
      { id: 'var-l01-std', colorName: 'Warm Cream Ceramic', colorHex: '#FAF6EE', sku: 'KTZ-LIF-01', inStock: 30 }
    ],
    rating: 4.8,
    reviewCount: 44,
    reviews: [],
    specifications: {
      'Wax': '100% Natural Coconut & Soy Wax Blend',
      'Wick': 'FSC Certified Crackling Wood Wick',
      'Burn Time': '50 - 55 Hours',
      'Fragrance Notes': 'Top: Cashmere & Tonka; Heart: French Vanilla; Base: Amber & Sandalwood',
      'Toxin Free': 'Phthalate, Paraben & Cruelty-Free'
    },
    inStock: 32,
    isNewArrival: false,
    tags: ['candle', 'soy candle', 'home decor', 'aromatherapy', 'vanilla amber'],
    frequentlyBoughtWith: ['ktz-b-01']
  },

  // 9. Gift Sets
  {
    id: 'ktz-g-01',
    name: 'The Queen’s Reverie Luxury Pamper Gift Hamper',
    slug: 'the-queens-reverie-luxury-pamper-gift-hamper',
    category: 'Gift Sets',
    price: 4999,
    originalPrice: 7499,
    discountPercentage: 33,
    shortDescription: 'Curated keepsake trunk including silk scarf, 18K gold huggie earrings, soy candle, rose quartz roller, and handwritten custom card.',
    description: 'The ultimate bespoke indulgence for her. Hand-packaged in an opulent textured blush-gold hardbound keepsake box tied with double-faced satin ribbon. Contains five of our highest rated luxury essentials curated to pamper, delight, and celebrate her special moments.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Signature Blush & Gold', hex: '#F9D5DC' }
    ],
    sizes: ['Luxury Hamper Box'],
    variants: [
      { id: 'var-g01-box', colorName: 'Signature Blush & Gold', colorHex: '#F9D5DC', sku: 'KTZ-GFT-01', inStock: 20 }
    ],
    rating: 5.0,
    reviewCount: 61,
    reviews: [
      {
        id: 'rev-g01-1',
        author: 'Arjun Singhania',
        rating: 5,
        date: '2026-10-25',
        title: 'My fiancée was thrilled to tears!',
        comment: 'Ordered this for our anniversary. The presentation is world class! Even the fragrance upon opening the trunk felt like walking into a luxury boutique in Paris.',
        verified: true,
        location: 'Gurugram'
      }
    ],
    specifications: {
      'Box Dimensions': '35 cm x 26 cm x 14 cm Rigid Keepsake Trunk',
      'Included Items': '1 Jardin Silk Scarf, 1 Aura 18K Gold Huggies, 1 Kashmir Soy Candle, 1 Rose Quartz Roller, 1 Personalized Calligraphy Card',
      'Gift Ready': 'Arrives with Velvet Ribbon & Embossed Wax Seal'
    },
    inStock: 18,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Festive Radiance',
    tags: ['gift set', 'luxury hamper', 'anniversary gift', 'birthday gift', 'curated box'],
    frequentlyBoughtWith: ['ktz-c-01']
  },

  // 10. Trending Products
  {
    id: 'ktz-t-01',
    name: 'Sienna Handwoven Structured Bamboo & Pearl Bucket Bag',
    slug: 'sienna-handwoven-bamboo-pearl-bucket-bag',
    category: 'Trending Products',
    price: 3199,
    originalPrice: 4599,
    discountPercentage: 30,
    shortDescription: 'Artisan hand-woven structured organic bamboo bucket with satin drawstring pouch and detachable pearl handle.',
    description: 'The sensation of summer resorts. Meticulously handcrafted by master artisans over 14 hours. Features a removable champagne silk drawstring inner pouch and dual interchangeable handles: a chunky baroque pearl top handle and an adjustable vegan leather strap.',
    images: [
      'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Natural Honey Bamboo', hex: '#D8B168' },
      { name: 'White Sand', hex: '#F5EBE1' }
    ],
    sizes: ['One Size'],
    variants: [
      { id: 'var-t01-honey', colorName: 'Natural Honey Bamboo', colorHex: '#D8B168', sku: 'KTZ-TRD-01', inStock: 15 }
    ],
    rating: 4.9,
    reviewCount: 39,
    reviews: [],
    specifications: {
      'Material': '100% Sustainable Treated Bamboo & Vegan Leather',
      'Handle': 'Hand-Knotted Baroque Pearl Beaded Handle + Crossbody Strap',
      'Pouch': 'Removable Pure Satin Jacquard Lining with Cinch Cord',
      'Dimensions': '18 cm diameter x 20 cm height'
    },
    inStock: 20,
    isTrending: true,
    isNewArrival: true,
    featuredCollection: 'Pastel Reverie',
    tags: ['trending', 'bucket bag', 'bamboo bag', 'pearl handle', 'vacation style'],
    frequentlyBoughtWith: ['ktz-c-03', 'ktz-j-01']
  },
  {
    id: 'ktz-t-02',
    name: 'Vespera Obsidian Velvet Tuxedo Blazer Dress',
    slug: 'vespera-obsidian-velvet-tuxedo-blazer-dress',
    category: 'Trending Products',
    price: 4299,
    originalPrice: 6499,
    discountPercentage: 34,
    shortDescription: 'Plush midnight velvet double-breasted blazer dress with satin peaked lapels and crystal buttons.',
    description: 'Sensational evening glamour. Tailored with power shoulders, sharp satin peak lapels, and custom handset faceted crystal buttons that shimmer effortlessly. Lined with stretch silk crepe for luxurious all-night comfort.',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Midnight Onyx', hex: '#0D0D0D' },
      { name: 'Royal Emerald', hex: '#0B3B24' },
      { name: 'Burgundy Wine', hex: '#58111A' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    variants: [
      { id: 'var-t02-s', colorName: 'Midnight Onyx', colorHex: '#0D0D0D', size: 'S', sku: 'KTZ-TRD-02-S', inStock: 12 },
      { id: 'var-t02-m', colorName: 'Midnight Onyx', colorHex: '#0D0D0D', size: 'M', sku: 'KTZ-TRD-02-M', inStock: 18 }
    ],
    rating: 5.0,
    reviewCount: 35,
    reviews: [],
    specifications: {
      'Fabric': 'Premium Micro-Velvet with Satin Trim',
      'Lining': '100% Stretch Silk Crepe de Chine',
      'Buttons': 'Faceted K9 Crystal in 18K Gold Rim Setting',
      'Care': 'Specialist Dry Clean Only'
    },
    inStock: 25,
    isTrending: true,
    isBestseller: true,
    featuredCollection: 'Monochrome Chic',
    tags: ['blazer dress', 'velvet', 'cocktail', 'party wear', 'black dress'],
    frequentlyBoughtWith: ['ktz-j-02', 'ktz-h-01']
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'KITTUZ15',
    description: '15% off on all lifestyle & fashion essentials',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 999,
    maxDiscount: 1500,
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    code: 'FIRST10',
    description: '10% off on your first KITTUZ purchase',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    maxDiscount: 1000,
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    code: 'FESTIVE20',
    description: '20% off on festive collections above ₹2,499',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2499,
    maxDiscount: 2000,
    expiresAt: '2026-11-30',
    isActive: true
  },
  {
    code: 'FREESHIP',
    description: 'Complimentary express delivery across India',
    discountType: 'fixed',
    discountValue: 149,
    minOrderValue: 0,
    expiresAt: '2026-12-31',
    isActive: true
  }
];

export const CATEGORIES_METADATA = [
  {
    name: "Women's Clothing",
    slug: 'womens-clothing',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    tagline: 'Timeless silhouettes & artisanal silks'
  },
  {
    name: 'Handbags & Purses',
    slug: 'handbags-purses',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    tagline: 'Architectural luxury & vegan leather'
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    tagline: '18K gold vermeil & baroque pearls'
  },
  {
    name: 'Fashion Accessories',
    slug: 'fashion-accessories',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800',
    tagline: 'Mulberry silk scarves & belts'
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    tagline: 'Pure botanicals & rose quartz rituals'
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    tagline: 'Cloud-cushioned mules & artisanal flats'
  },
  {
    name: 'Watches',
    slug: 'watches',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
    tagline: 'Mother-of-pearl dials & Milanese mesh'
  },
  {
    name: 'Lifestyle Essentials',
    slug: 'lifestyle-essentials',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    tagline: 'Soy wax scents & mindful sanctuary'
  },
  {
    name: 'Gift Sets',
    slug: 'gift-sets',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    tagline: 'Luxury keepsake trunks with bespoke notes'
  },
  {
    name: 'Trending Products',
    slug: 'trending-products',
    image: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&q=80&w=800',
    tagline: 'Viral season statements & must-haves'
  }
];
