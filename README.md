# KITTUZ – Premium Women's Lifestyle E-Commerce Platform

> **Your Style. Your Lifestyle.**

KITTUZ is a production-grade, luxury women’s lifestyle and fashion e-commerce web application designed for the Indian market. It bridges traditional Indian artisanal craftsmanship (Chanderi handloom silks, 18K gold vermeil baroque pearls) with contemporary silhouettes, powered by a server-side AI shopping stylist (Anya), interactive Style Finder, and secure Razorpay payment flows.

---

## 💎 Features Overview

1. **Brand Aesthetic & Visual Identity**
   - Palette: Soft blush pink (`#FFF7F8`, `#FDE8ED`), warm ivory, cream, champagne beige, and rich rose accents (`#B01A46`).
   - Editorial Typography: Cormorant Garamond serif headings with Plus Jakarta Sans body.
   - Zero-Pill & Metadata Discipline: Clean unboxed metadata and typographic separators (`·`).

2. **10 Distinct Product Categories**
   - Women's Clothing
   - Handbags & Purses
   - Jewellery
   - Fashion Accessories
   - Beauty & Personal Care
   - Footwear
   - Watches
   - Lifestyle Essentials
   - Gift Sets
   - Trending Products

3. **Product Detail Pages & Interactive Capabilities**
   - High-resolution multi-angle thumbnail gallery with zoom.
   - Color selection swatches and size selector with interactive Size Guide modal.
   - Domestic Indian PIN Code delivery checker (validates 6-digit Indian PINs, calculates exact delivery date via Blue Dart / Delhivery).
   - "Frequently Bought Together" bundles with 1-click bundle discount.
   - Verified customer reviews with "Write a Review" submission form.

4. **KITTUZ AI Shopping Assistant (Anya)**
   - Floating luxury chat drawer.
   - Powered server-side via `@google/genai` with model `gemini-3.8-flash`.
   - Conversational advice grounded in active catalogue data with direct "View" and "Add to Bag" interactive cards embedded inside chat replies.
   - Resilient offline fallback if API key is not configured.

5. **KITTUZ Style Finder**
   - 5-step visual lifestyle quiz (Aesthetic, Color Palette, Categories, Budget Range, Occasions).
   - Instant calculation of personalized archetype (e.g., "The Modern Romantic", "The Effortless Minimalist").
   - 1-Click "Add Complete Outfit to Bag" with bundle discount.

6. **Complete E-Commerce & Checkout**
   - Cart slide-over with free delivery threshold progress bar (Free over ₹999).
   - Coupon codes engine (`KITTUZ15` for 15% off, `FIRST10`, `FREESHIP`).
   - Server-side price recalculation (anti-tamper) and stock verification.
   - Razorpay integration for UPI (GPay, PhonePe), Cards, NetBanking, plus Cash on Delivery (COD).
   - Confetti celebration with printable order receipts.

7. **Customer Account Dashboard**
   - Order history with 5-stage shipment timeline (Placed → Confirmed → Shipped → Out for Delivery → Delivered).
   - Courier partner and live tracking numbers.
   - Order cancellation and 7-day return request workflows.
   - Saved address manager (add/edit/delete/set default).
   - Wishlist with 1-click "Move all to Bag".

8. **Admin Executive Console**
   - Product Management: Add, edit, delete, and adjust stock in real-time.
   - Order Pipeline: Update shipment status, assign courier tracking numbers, process refunds.
   - Marketing Management: Create promotional coupons and minimum order thresholds.
   - Financial Analytics: Gross revenue, total orders, AOV, category sales distribution chart, and low-inventory alerts.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TSX, Vite Middleware.
- **AI Integration**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`).
- **Database Architecture**: PostgreSQL & Supabase with 19 structured tables and Row Level Security (RLS).
- **Payment Gateway**: Razorpay (Indian Rupee transactions).

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `GEMINI_API_KEY` and optional `RAZORPAY_KEY_ID`.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Sign up or log into [Supabase](https://supabase.com/).
2. Create a new project and open the **SQL Editor**.
3. Copy the contents of `/supabase/schema.sql` and execute the script.
4. The script creates all 19 tables:
   - `profiles`, `admin_roles`, `categories`, `products`, `product_variants`, `product_images`, `inventory`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, `addresses`, `coupons`, `orders`, `order_items`, `payments`, `reviews`, `customer_preferences`, `newsletter_subscribers`.
   - Enables Row Level Security (RLS) policies and indexes.
5. In project settings, copy `Project URL` and `anon public key` into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 💳 Razorpay Payment Gateway Setup

1. Create a merchant account on [Razorpay](https://razorpay.com/).
2. Navigate to **Settings > API Keys** and generate Test Key ID and Secret.
3. Add keys to `.env`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
   ```
4. For production, switch keys to Live mode and configure your Webhook URL pointing to `/api/orders/verify-payment`.

---

## 🌐 Vercel Deployment Instructions

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), click **Add New Project** and import your repository.
3. In **Build & Development Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
