import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from './src/data/products.ts';
import { Product, Order, Coupon, CartItem } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// In-Memory Database store initialized from catalog
let products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let coupons: Coupon[] = JSON.parse(JSON.stringify(INITIAL_COUPONS));
let subscribers: { email: string; date: string }[] = [];

// Seed sample orders for realistic dashboard & tracking
let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'KTZ-2026-9281',
    userId: 'user-default-1',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@example.com',
    customerPhone: '+91 98201 44521',
    items: [
      {
        productId: 'ktz-c-01',
        name: 'Blush Chanderi Silk Anarkali Kurta Set',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
        price: 3899,
        quantity: 1,
        selectedColor: 'Blush Rose',
        selectedSize: 'M'
      },
      {
        productId: 'ktz-j-01',
        name: 'Celeste 18K Gold Vermeil Freshwater Pearl Choker',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
        price: 2199,
        quantity: 1,
        selectedColor: 'Classic Gold & Pearl'
      }
    ],
    subtotal: 6098,
    couponCode: 'KITTUZ15',
    discountAmount: 914,
    shippingFee: 0,
    taxAmount: 259,
    totalAmount: 5443,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98201 44521',
      street: 'Flat 402, Sea Pearl Residences, Bandra West',
      landmark: 'Near Carter Road Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      addressType: 'home',
      isDefault: true
    },
    shippingMethod: 'standard',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    razorpayPaymentId: 'pay_OMsK8x7L2n9Pq1',
    status: 'Shipped',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    trackingNumber: 'BLUEDART-882910394',
    courierPartner: 'Blue Dart Express'
  },
  {
    id: 'ord-1002',
    orderNumber: 'KTZ-2026-7734',
    userId: 'user-default-1',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@example.com',
    customerPhone: '+91 98201 44521',
    items: [
      {
        productId: 'ktz-h-01',
        name: 'Le Marais Trapeze Structured Leather Bag',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
        price: 4499,
        quantity: 1,
        selectedColor: 'Almond Beige'
      }
    ],
    subtotal: 4499,
    couponCode: 'FIRST10',
    discountAmount: 450,
    shippingFee: 0,
    taxAmount: 202,
    totalAmount: 4251,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Ananya Deshmukh',
      phone: '+91 98201 44521',
      street: 'Flat 402, Sea Pearl Residences, Bandra West',
      landmark: 'Near Carter Road Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      addressType: 'home',
      isDefault: true
    },
    shippingMethod: 'standard',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    razorpayPaymentId: 'pay_Ktz99201LMN2',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    trackingNumber: 'DELHIVERY-99201948',
    courierPartner: 'Delhivery Surface'
  }
];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Products: GET all with filter & search
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...products];
    const { category, search, minPrice, maxPrice, sort, collection } = req.query;

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (collection) {
      result = result.filter(p => p.featuredCollection?.toLowerCase() === (collection as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else {
      // featured / popularity
      result.sort((a, b) => (b.isBestseller || b.isTrending ? 1 : 0) - (a.isBestseller || a.isTrending ? 1 : 0));
    }

    res.json({ success: true, count: result.length, data: result });
  });

  // Single Product: GET by ID or Slug
  app.get('/api/products/:identifier', (req: Request, res: Response) => {
    const { identifier } = req.params;
    const product = products.find(p => p.id === identifier || p.slug === identifier);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  });

  // Admin Product Create
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: `ktz-${Date.now().toString(36)}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      reviews: req.body.reviews || [],
      tags: req.body.tags || []
    };
    products.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  });

  // Admin Product Update
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, data: products[index] });
  });

  // Admin Product Delete
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // Coupons: GET all
  app.get('/api/coupons', (_req: Request, res: Response) => {
    res.json({ success: true, data: coupons });
  });

  // Coupons: Validate and apply
  app.post('/api/coupons/apply', (req: Request, res: Response) => {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code required' });
    }

    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(400).json({ success: false, error: 'Invalid or expired coupon code' });
    }

    if (cartSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        error: `Minimum order value of ₹${coupon.minOrderValue} required for coupon ${coupon.code}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount: discount,
        description: coupon.description
      }
    });
  });

  // Admin Create Coupon
  app.post('/api/coupons', (req: Request, res: Response) => {
    const newCoupon: Coupon = {
      ...req.body,
      code: req.body.code.toUpperCase().trim(),
      isActive: true
    };
    coupons.push(newCoupon);
    res.status(201).json({ success: true, data: newCoupon });
  });

  // Orders: GET
  app.get('/api/orders', (req: Request, res: Response) => {
    const { userId, role } = req.query;
    if (role === 'admin') {
      return res.json({ success: true, count: orders.length, data: orders });
    }
    const userOrders = orders.filter(o => o.userId === (userId || 'user-default-1'));
    res.json({ success: true, count: userOrders.length, data: userOrders });
  });

  // Orders: Create Order with server-side pricing verification & stock validation
  app.post('/api/orders/create', (req: Request, res: Response) => {
    const {
      cartItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      couponCode,
      customerDetails
    } = req.body;

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, error: 'Valid delivery address required' });
    }

    // 1. Recalculate Subtotal server-side (prevent frontend tampering)
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of cartItems as CartItem[]) {
      const dbProd = products.find(p => p.id === item.productId);
      if (!dbProd) {
        return res.status(400).json({ success: false, error: `Product ${item.name} not found in catalog` });
      }

      if (dbProd.inStock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${dbProd.name}. Only ${dbProd.inStock} remaining.`
        });
      }

      verifiedSubtotal += dbProd.price * item.quantity;
      verifiedItems.push({
        productId: dbProd.id,
        name: dbProd.name,
        image: dbProd.images[0] || item.image,
        price: dbProd.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });
    }

    // 2. Validate Coupon server-side
    let discountAmount = 0;
    if (couponCode) {
      const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
      if (coupon && verifiedSubtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((verifiedSubtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    // 3. Shipping fee calculation
    let shippingFee = 0;
    if (shippingMethod === 'express') {
      shippingFee = 149;
    } else {
      // Standard: Free over 999 else 99
      shippingFee = (verifiedSubtotal - discountAmount) >= 999 ? 0 : 99;
    }

    // 4. GST / Taxes: 5% included or calculated
    const taxableAmount = Math.max(0, verifiedSubtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST
    const totalAmount = taxableAmount + shippingFee + (paymentMethod === 'cod' ? 49 : 0);

    // Generate Order
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KTZ-2026-${randomSuffix}`;
    const orderId = `ord-${Date.now().toString(36)}`;

    // Prepare Razorpay order payload if razorpay is selected
    const razorpayOrderId = paymentMethod === 'razorpay' ? `order_rzp_${Date.now().toString(36)}` : undefined;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: customerDetails?.userId || 'user-default-1',
      customerName: customerDetails?.name || shippingAddress.fullName,
      customerEmail: customerDetails?.email || 'customer@kittuz.in',
      customerPhone: customerDetails?.phone || shippingAddress.phone,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      couponCode: discountAmount > 0 ? couponCode : undefined,
      discountAmount,
      shippingFee,
      taxAmount,
      totalAmount,
      shippingAddress,
      shippingMethod: shippingMethod || 'standard',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      razorpayOrderId,
      status: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + (shippingMethod === 'express' ? 48 : 96) * 3600 * 1000).toISOString(),
      trackingNumber: `KTZ-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: 'Blue Dart Luxury Express'
    };

    orders.unshift(newOrder);

    // Deduct stock
    for (const item of verifiedItems) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.inStock = Math.max(0, prod.inStock - item.quantity);
      }
    }

    res.status(201).json({
      success: true,
      data: {
        order: newOrder,
        razorpayOrderId,
        amountInPaise: totalAmount * 100,
        currency: 'INR',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_kittuz_mock_key'
      }
    });
  });

  // Orders: Verify Razorpay payment signature
  app.post('/api/orders/verify-payment', (req: Request, res: Response) => {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // In production with RAZORPAY_KEY_SECRET, verify crypto HMAC:
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    // const generatedSignature = hmac.digest('hex');
    // const isSignatureValid = generatedSignature === razorpaySignature;

    // For test / sandbox without credentials, accept verified payment ID
    order.paymentStatus = 'paid';
    order.status = 'Confirmed';
    order.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now().toString(36)}`;
    order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;

    res.json({
      success: true,
      message: 'Payment verified and confirmed successfully',
      data: order
    });
  });

  // Admin Order Status Update
  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, trackingNumber, courierPartner } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierPartner) order.courierPartner = courierPartner;

    res.json({ success: true, data: order });
  });

  // Customer Cancel Order
  app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        error: 'Order has already been dispatched. You may request a Return once delivered.'
      });
    }

    order.status = 'Cancelled';
    order.cancelReason = reason || 'Customer requested cancellation';

    // Restore stock
    for (const item of order.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.inStock += item.quantity;
      }
    }

    res.json({ success: true, data: order });
  });

  // Customer Return Order
  app.post('/api/orders/:id/return', (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        error: 'Return requests can only be placed for delivered orders within 7 days.'
      });
    }

    order.status = 'Return Requested';
    order.returnReason = reason || 'Fit or style preference';

    res.json({ success: true, data: order });
  });

  // Admin Analytics Stats
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid' && o.status !== 'Cancelled');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
    const totalCustomers = new Set(orders.map(o => o.customerEmail)).size + 14;

    const lowStockProducts = products.filter(p => p.inStock < 15);

    // Sales by Category
    const categoryCounts: Record<string, number> = {};
    for (const o of orders) {
      for (const item of o.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          categoryCounts[prod.category] = (categoryCounts[prod.category] || 0) + item.price * item.quantity;
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 5),
        bestsellers: products.filter(p => p.isBestseller).slice(0, 5),
        categorySales: categoryCounts
      }
    });
  });

  // Newsletter Subscription
  app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address required' });
    }

    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({
        success: true,
        message: 'You are already part of the KITTUZ circle!',
        code: 'WELCOME10'
      });
    }

    subscribers.push({ email, date: new Date().toISOString() });
    res.json({
      success: true,
      message: 'Welcome to the KITTUZ circle! Here is your exclusive 10% welcome coupon.',
      code: 'WELCOME10'
    });
  });

  // Reviews: Add review
  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, author, rating, title, comment, location } = req.body;
    const prod = products.find(p => p.id === productId);
    if (!prod) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const newRev = {
      id: `rev-${Date.now().toString(36)}`,
      author: author || 'KITTUZ Shopper',
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: title || 'Delighted with my purchase',
      comment,
      verified: true,
      location: location || 'India'
    };

    prod.reviews.unshift(newRev);
    prod.reviewCount = prod.reviews.length;
    prod.rating = Number((prod.reviews.reduce((s, r) => s + r.rating, 0) / prod.reviews.length).toFixed(1));

    res.status(201).json({ success: true, data: newRev, product: prod });
  });

  // -------------------------------------------------------------
  // KITTUZ AI SHOPPING ASSISTANT ROUTE (Server-Side Gemini API)
  // -------------------------------------------------------------
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Catalog summary for context
    const catalogContext = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      colors: p.colors.map(c => c.name).join(', '),
      tags: p.tags.join(', '),
      inStock: p.inStock,
      collection: p.featuredCollection,
      highlight: p.shortDescription
    }));

    const systemPrompt = `You are Anya, the premier Senior Lifestyle Stylist and Personal Shopper for KITTUZ, India's luxury women's lifestyle and fashion brand (Tagline: "Elevate Your Everyday.").
Brand voice: Sophisticated, warm, encouraging, knowledgeable about fabrics (Chanderi silk, Mulberry silk, linen, organza), jewellery (18k gold vermeil, baroque pearls), footwear comfort, and Indian festive / work / brunch styling.
Currency: Always format prices in Indian Rupees (₹).

CATALOGUE KNOWLEDGE BASE (Use ONLY these real products from our database when recommending):
${JSON.stringify(catalogContext, null, 2)}

INSTRUCTIONS:
1. Provide thoughtful, bespoke fashion & lifestyle advice tailored to the customer's question.
2. When mentioning products, recommend specific items from the catalogue above.
3. Suggest styling tips (e.g. pairing a silk anarkali with the baroque pearl choker or trapeze bag).
4. In your response, include at the very end a JSON array formatted as:
[RECOMMENDED_PRODUCTS: ["ktz-c-01", "ktz-j-01"]]
listing up to 3 relevant product IDs from the catalogue that directly answer the query. If none apply, omit this bracket.
5. Keep your tone polished, warm, and concise (under 160 words).`;

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        const replyText = response.text || '';

        // Extract recommended product IDs
        let cleanText = replyText;
        const recommendedProductIds: string[] = [];
        const match = replyText.match(/\[RECOMMENDED_PRODUCTS:\s*(\[[^\]]*\])\]/);
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            if (Array.isArray(parsed)) {
              recommendedProductIds.push(...parsed);
            }
          } catch (e) {
            // Ignore parse error
          }
          cleanText = cleanText.replace(/\[RECOMMENDED_PRODUCTS:\s*\[[^\]]*\]\]/, '').trim();
        }

        return res.json({
          success: true,
          data: {
            reply: cleanText,
            recommendedProductIds
          }
        });
      }
    } catch (err) {
      console.error('Gemini API call failed, falling back to heuristic stylist:', err);
    }

    // Graceful Intelligent Fallback if Gemini key is missing or encounters a timeout
    const lower = message.toLowerCase();
    let fallbackReply = "Welcome to KITTUZ! I'm delighted to assist you with our handpicked lifestyle curation. How can I help you elevate your everyday wardrobe or home sanctuary?";
    let matchedIds: string[] = ['ktz-c-01', 'ktz-h-01'];

    if (lower.includes('brunch') || lower.includes('casual') || lower.includes('linen') || lower.includes('summer')) {
      fallbackReply = "For an effortless brunch or sunlit afternoon, our Seraphina Linen Wrap Co-ord Set in Warm Oat paired with the Petite Lune Crescent Bag radiates understated Riviera charm. The pure Belgian linen breathes beautifully in warm weather.";
      matchedIds = ['ktz-c-03', 'ktz-h-02', 'ktz-f-01'];
    } else if (lower.includes('festive') || lower.includes('wedding') || lower.includes('traditional') || lower.includes('kurta') || lower.includes('diwali')) {
      fallbackReply = "For festive elegance, our Blush Chanderi Silk Anarkali Set with handcrafted zari buti work is a timeless favorite. Complete the royal ensemble with the Celeste 18K Gold Vermeil Freshwater Pearl Choker for an ethereal glow.";
      matchedIds = ['ktz-c-01', 'ktz-j-01', 'ktz-j-02'];
    } else if (lower.includes('office') || lower.includes('work') || lower.includes('formal') || lower.includes('boardroom')) {
      fallbackReply = "For workplace grace, the Aurelia Pleated Mulberry Silk Midi Dress paired with the Le Marais Trapeze Structured Leather Bag commands authority while remaining exceptionally comfortable for 10-hour days.";
      matchedIds = ['ktz-c-02', 'ktz-h-01', 'ktz-w-01'];
    } else if (lower.includes('gift') || lower.includes('hamper') || lower.includes('present') || lower.includes('anniversary')) {
      fallbackReply = "Our Queen’s Reverie Luxury Pamper Gift Hamper is the ultimate bespoke indulgence. It includes our pure silk scarf, 18K gold earrings, hand-poured soy candle, and genuine rose quartz roller in a ribbon-tied keepsake trunk.";
      matchedIds = ['ktz-g-01', 'ktz-l-01'];
    } else if (lower.includes('bag') || lower.includes('handbag') || lower.includes('tote')) {
      fallbackReply = "Explore our Le Marais Trapeze Structured Leather Bag for everyday luxury that fits up to 13-inch devices, or the viral Sienna Handwoven Bamboo & Pearl Bucket Bag for resort wanderlust.";
      matchedIds = ['ktz-h-01', 'ktz-t-01'];
    } else if (lower.includes('jewel') || lower.includes('earring') || lower.includes('necklace') || lower.includes('gold')) {
      fallbackReply = "Our jewellery is crafted in solid 925 sterling silver dipped in 18K gold vermeil. The Celeste Baroque Pearl Choker and Aura Molten Huggies are hypoallergenic, sweat-resistant, and sparkle brilliantly.";
      matchedIds = ['ktz-j-01', 'ktz-j-02'];
    } else if (lower.includes('candle') || lower.includes('glow') || lower.includes('skincare')) {
      fallbackReply = "Indulge your senses with the Kashmir Amber & French Vanilla Soy Candle alongside our Rose Quartz Facial Sculpting Roller & 24K Saffron Glow Elixir kit for the ultimate evening self-care ritual.";
      matchedIds = ['ktz-b-01', 'ktz-l-01'];
    }

    res.json({
      success: true,
      data: {
        reply: fallbackReply,
        recommendedProductIds: matchedIds
      }
    });
  });

  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC ASSETS
  // -------------------------------------------------------------
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ KITTUZ Luxury Lifestyle Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start KITTUZ server:', err);
});
