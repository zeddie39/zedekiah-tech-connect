# Ztech Electronics Web App – Technical Documentation

This document provides a comprehensive overview of the project’s architecture, routing, components, data models, integrations, environment setup, development workflow, and operational considerations.


## 1) Overview and Tech Stack

- Core
  - React 18 + TypeScript
  - Vite build tool
  - react-router-dom v6 for routing
  - TailwindCSS + shadcn/ui (Radix UI primitives wrapped in utility components)
  - Framer Motion (animations)
  - TanStack React Query (server-state caching)
- Forms/Validation
  - react-hook-form
  - zod + @hookform/resolvers
- UI Utilities
  - class-variance-authority, tailwind-merge, clsx
  - lucide-react icons
  - embla-carousel-react (carousel)
  - recharts (charts)
  - react-zoom-pan-pinch (image zoom)
- Date/Time
  - date-fns
- State and Notifications
  - Local React Context for cart state
  - shadcn Toaster + Sonner
- Integrations
  - Supabase (Auth, Database, Storage, Realtime)
  - Payments: M-Pesa (Daraja STK push server), Paystack/Flutterwave placeholders, Stripe planned
- Server
  - Express + CORS + dotenv


## 2) Project Structure (high level)

- public/
  - Static assets, PWA manifest, redirects (Netlify-style _redirects)
- server/
  - mpesa.js – Express server exposing M-Pesa endpoints
- src/
  - App.tsx – Root providers and routing
  - main.tsx – Vite/React entry
  - components/ – Shared UI and feature components
  - components/ui/ – shadcn/ui component wrappers
  - components/admin/ – Admin dashboard components
  - components/services/ – Services UI
  - data/ – Static data for services
  - hooks/ – Custom hooks (e.g., realtime chat)
  - integrations/supabase/ – Supabase client and generated types
  - lib/utils.ts – Utility helpers
  - pages/ – Route components (public, shop, admin)
  - pages/admin/ – Nested admin pages
- server.js – Express server placeholder (initialized Supabase service client)
- tailwind.config.ts – Tailwind setup
- vite.config.ts – Vite setup
- package.json – Scripts and dependencies


## 3) Application Composition

- Providers (src/App.tsx)
  - QueryClientProvider (React Query)
  - TooltipProvider (Radix + shadcn)
  - Toaster + Sonner (notifications)
  - CartProvider (shopping cart context)
  - BrowserRouter (client routing)
  - PWAInstallPrompt (PWA UX)
  - CookieConsent (cookie notice)


## 4) Routing Map

All routes are defined in src/App.tsx.

- Public/Marketing
  - / → Home (pages/Index.tsx)
    - Sections via in-page anchors: home, about, services, pricing, team, blog, faq, whychooseus, contact
    - Components: Navigation, Hero, About, Services, HomePricingSection, Team, Blog, FAQ, WhyChooseUs, Contact, Footer
  - /about → About page (pages/About.tsx)
  - /services → Services page (pages/Services.tsx)
  - /team → Team page (pages/Team.tsx)
  - /contact → Contact page (pages/Contact.tsx)
  - /gallery → Gallery page (pages/Gallery.tsx)
  - /blog → Blog page (pages/Blog.tsx)
  - /pricing and /more-pricing → Pricing pages
  - /faq → FAQ page
  - /why-choose-us → WhyChooseUs page
  - /terms → Terms page
  - /privacy → Privacy page
  - /ConfirmedCelebration → Post-action confirmation page

- Auth and Dashboard
  - /auth → Auth page (pages/Auth.tsx)
  - /dashboard → User dashboard (pages/Dashboard.tsx)

- Shop
  - /shop → Product listing (pages/Shop.tsx)
    - Requires auth; otherwise redirects to /auth
    - Features: category filtering, sorting, wishlist, image preview, WhatsApp contact, reviews
  - /shop/new → New product form (pages/ShopNew.tsx)
    - Uploads images to Supabase Storage bucket product-images
    - Inserts product in products (status = pending)
    - Inserts images in product_images table
  - /shop/:id → Product details (pages/ProductDetails.tsx)
  - /cart → Shopping cart (pages/Cart.tsx)
  - /checkout → Checkout (pages/Checkout.tsx)
  - /orders → Orders list (pages/Orders.tsx)

- Admin (nested under /admin with layout in pages/Admin.tsx)
  - /admin → DashboardHome (pages/admin/DashboardHome.tsx)
  - /admin/chat → AdminChat
  - /admin/repairs → AdminRepairs
  - /admin/notifications → AdminNotifications
  - /admin/team → AdminTeam
  - /admin/health → AdminHealth
  - /admin/reports → AdminReports
  - /admin/workflow → AdminWorkflow
  - /admin/users → AdminUsers
  - /admin/ProductsApproval → ProductsApproval (product moderation)
  - /admin/gallery-manager → GalleryManagerPage
  - /admin/logout → Logout

- Fallback
  - * → NotFound page


## 5) Key Components and Responsibilities

- Global Layout
  - Navigation (components/Navigation.tsx)
    - Responsive nav bar; hides on scroll down, shows on scroll up
    - In-page section scrolling for home page anchors
    - Links to Gallery, Blog, Shop
  - Footer (components/Footer.tsx)
    - Quick links, services deep links, contact info, socials

- Shop Experience
  - CartContext (components/CartContext.tsx)
    - In-memory cart state
    - API: addToCart, removeFromCart, updateQuantity, clearCart
  - ShopNavbar, ShopHeroCarousel, ShopCategories
    - UI composition for product discovery
  - Shop (pages/Shop.tsx)
    - Fetches products and first image per product from Supabase
    - Wishlist persisted to Supabase (user_wishlist) for logged-in users; localStorage for guests
    - Product reviews read/write to product_reviews table
    - WhatsApp deep link via formatPhoneForWhatsapp
  - ShopNew (pages/ShopNew.tsx)
    - Auth required; creates product (status=pending)
    - Uploads multiple images to product-images storage bucket and records URLs in product_images
  - ProductDetails (pages/ProductDetails.tsx)
    - Displays product details, images, WhatsApp contact if provided
  - Cart, Checkout, Orders
    - Checkout creates one order row per cart item in orders table
    - MpesaButton used for M-Pesa initiation (success callback clears cart and navigates to orders)

- Admin Dashboard (pages/Admin.tsx + components/admin/*)
  - Access control via Supabase user_roles table (roles: super_admin, support_admin, data_analyst)
  - Sidebar navigation (AdminSidebar)
  - Dashboard widgets and analytics components
  - GalleryManagerPage + AdminGalleryManager
    - Uploads images to gallery storage bucket and inserts metadata into gallery table

- UI Library (components/ui/*)
  - shadcn/ui components wired to Tailwind
  - Command palette (components/ui/command.tsx) via cmdk

- Utilities
  - formatPhoneForWhatsapp (lib/utils.ts)
    - Normalizes phone, builds wa.me link, optionally includes product image link in the message

- PWA/UX
  - PWAInstallPrompt
  - BackToTopButton
  - CookieConsent


## 6) Data Model and Tables (Supabase)

Observed tables used in code (ensure they exist in your Supabase project):

- products
  - id (uuid)
  - owner_id (uuid, references auth.users.id)
  - title (text)
  - description (text)
  - price (numeric)
  - category (text)
  - status (text: pending, approved, etc.)
  - whatsapp_number (text, optional)
  - created_at (timestamp)

- product_images
  - id (uuid)
  - product_id (uuid, references products.id)
  - image_url (text)
  - uploaded_at (timestamp)

- product_reviews
  - id (uuid)
  - product_id (uuid, references products.id)
  - user_id (uuid, references auth.users.id)
  - rating (int, 1-5)
  - comment (text)
  - created_at (timestamp)

- user_wishlist
  - user_id (uuid)
  - product_id (uuid)

- orders
  - id (uuid)
  - buyer_id (uuid)
  - product_id (uuid)
  - amount (numeric)
  - status (text: pending, fulfilled, etc.)
  - payment_status (text: unpaid, paid)
  - checkout_request_id (text, optional; used by M-Pesa callback to reconcile)
  - mpesa_receipt (text, optional)
  - created_at (timestamp)

- user_roles
  - user_id (uuid)
  - role (text: super_admin, support_admin, data_analyst)

- gallery (table)
  - id (uuid)
  - image_url (text)
  - title (text)
  - description (text)
  - category (text)
  - created_at (timestamp)

- Storage Buckets
  - product-images (public) – for product images
  - gallery (public) – for gallery uploads


## 7) Supabase Integration

- Client (src/integrations/supabase/client.ts)
  - createClient using Supabase URL and publishable key (anon key)
  - Note: values are hard-coded in file; recommended to move into env vars (Vite: import.meta.env.VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) and never commit secrets
- Types (src/integrations/supabase/types.ts)
  - Generated database types (update with supabase gen if schema changes)
- Usage
  - Auth: supabase.auth.getSession(), getUser(), onAuthStateChange, signOut
  - Database: CRUD on tables above
  - Storage: product-images and gallery buckets

Security note: Never expose service role key in frontend. This project uses service role key only on server.


## 8) Backend and Payments

- server.js (root)
  - Express app with Supabase service client (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
  - Currently no routes defined; runs on PORT (default 5001)

- server/mpesa.js
  - Express server exposing:
    - POST /api/mpesa/stkpush – Initiate STK push to user’s phone
    - POST /api/mpesa/callback – Safaricom callback to update order payment status
  - Environment variables required:
    - MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET
    - MPESA_SHORTCODE, MPESA_PASSKEY
    - MPESA_CALLBACK_URL (defaults to https://ztechelectronics.co.ke/mpesa-callback)
    - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
  - On successful callback ResultCode === 0, updates orders table: payment_status='paid', sets mpesa_receipt and matches by checkout_request_id (ensure you store this reference when initiating the STK push)

- Frontend payment trigger
  - Checkout (pages/Checkout.tsx) uses MpesaButton component to initiate payment (component implementation not shown here)
  - On success, clears cart and navigates to /orders


## 9) Environment Configuration

Create a .env file at project root for backend servers (never commit secrets):

- General/Supabase (server)
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY

- M-Pesa (server/mpesa.js)
  - MPESA_CONSUMER_KEY
  - MPESA_CONSUMER_SECRET
  - MPESA_SHORTCODE
  - MPESA_PASSKEY
  - MPESA_CALLBACK_URL

- Port configuration (optional)
  - PORT=5001 for server.js
  - PORT=5002 for server/mpesa.js

Client-side Supabase configuration is currently hard-coded. Recommended to switch to Vite env:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Then in src/integrations/supabase/client.ts:

- Use import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_ANON_KEY


## 10) Development Workflow

- Install dependencies
  - npm install

- Run frontend dev server
  - npm run dev  → Vite dev server

- Lint
  - npm run lint

- Build
  - npm run build

- Preview production build
  - npm run preview

- Run backend servers (in separate terminals)
  - node server.js
  - node server/mpesa.js

Note: Ensure .env is populated before running servers.


## 11) Deployment Notes

- Frontend
  - Vite static output can be deployed to Netlify, Vercel, or static hosting. The presence of public/_redirects suggests Netlify configuration for routing.
  - If using client-side routing, ensure SPA fallback is configured (/_redirects or host-specific setting).

- Backend
  - Express servers require a Node runtime (e.g., Render, Railway, Fly.io, or as Netlify/Vercel functions). Adjust endpoints in frontend MpesaButton accordingly.
  - Secure SUPABASE_SERVICE_ROLE_KEY; never expose it to the client.

- PWA
  - PWAInstallPrompt present; ensure manifest and service worker (if any) are configured as needed for installability.


## 12) Security and Privacy

- Auth gate critical flows (Shop listing requires auth; Orders page requires auth). Consider protecting /checkout as well.
- Use RLS (Row Level Security) in Supabase to restrict access to per-user data where appropriate.
- Don’t expose sensitive keys
  - Move Supabase anon key and URL to Vite env
  - Keep service role key strictly server-side
- Validate and sanitize user-generated content (product titles, descriptions, reviews) before display.
- When generating WhatsApp links, format numbers and avoid injecting raw content.


## 13) Extensibility and Conventions

- UI: Prefer components in components/ui and shadcn conventions; reuse Button, Card, Dialog, etc.
- State: Keep server state via React Query; local UI state via useState/useReducer; cross-cutting via contexts (e.g., CartContext) where needed.
- Data access: Centralize Supabase CRUD patterns; consider extracting data services for products, orders, reviews.
- Types: Update src/integrations/supabase/types.ts when schema changes; prefer typed queries to avoid any-casting.
- Error handling: Use toast notifications consistently; handle Supabase error returns.


## 14) Known Gaps and Recommendations

- Supabase client keys are hard-coded in the repo. Move to env-based config.
- server.js has no endpoints; either merge with mpesa.js or remove if unused.
- Checkout creates separate orders per cart item. Consider a parent order and order_items table for multi-item orders.
- Product images: Shop page currently fetches a single image via .single() on product_images. If multiple images exist, consider fetching all and showing a gallery/slider.
- Reviews: ProductDetails shows a placeholder for reviews; unify with Shop’s review logic and show actual reviews on detail page.
- Admin roles: Ensure user_roles is populated via a secure backend process; add UI to manage roles safely.
- Validation: Add form validation (zod + RHF) for ShopNew and Reviews.
- Payment reconciliation: Ensure Checkout stores checkout_request_id (from STK push response) on the orders row to match callbacks.
- SEO/Performance: Add meta tags per route and image optimization.


## 15) Quick Start Scenarios

- Add a new product
  1) Login → /shop/new
  2) Fill product info, select one or more images
  3) Submit → product stored (status=pending), images uploaded to product-images bucket
  4) Admin reviews in /admin/ProductsApproval, then approves

- Place an order
  1) Add items to cart in /shop
  2) Go to /cart → /checkout
  3) Initiate M-Pesa via MpesaButton (or mark as paid in dev)
  4) On success → /orders shows status

- Upload gallery content (admin)
  1) /admin/gallery-manager
  2) Choose a category, select image
  3) Upload → stored in gallery bucket + gallery table


## 16) Glossary

- shadcn/ui: A set of copy-paste Tailwind components built on Radix UI primitives.
- Supabase: Backend-as-a-service with Postgres, Auth, Storage, Realtime.
- RLS: Row Level Security; Postgres feature to enforce per-row access rules.
- STK Push: M-Pesa flow that prompts a SIM to authorize a payment on device.


---
This documentation reflects the current codebase structure and patterns inferred from the repository files. Keep it updated alongside code changes, particularly when schemas, routes, or integrations evolve.