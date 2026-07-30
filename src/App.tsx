import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CartProvider } from "@/components/CartContext";
import { SavedItemsProvider } from "@/components/SavedItemsContext";
import ScrollToTop from "@/components/ui/scroll-to-top";
import CookieConsent from "@/components/CookieConsent";
import PageTransition from "@/components/PageTransition";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

// ---------------------------------------------------------------------------
// Lazy-loaded pages: These are NOT downloaded until the user actually visits
// the route, dramatically reducing the initial page load size.
// ---------------------------------------------------------------------------

// Public pages
const Gallery = lazy(() => import("./pages/Gallery"));
const MorePricingPage = lazy(() => import("./pages/MorePricingPage"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const Shop = lazy(() => import("./pages/Shop"));
const ShopNew = lazy(() => import("./pages/ShopNew"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetails"));
const InvoicePage = lazy(() => import("./pages/Invoice"));
const TrackPage = lazy(() => import("./pages/Track"));
const SubmitPage = lazy(() => import("./pages/Submit"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const SavedItems = lazy(() => import("./pages/SavedItems"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ConfirmedCelebration = lazy(() => import("./pages/ConfirmedCelebration"));
const BlogPage = lazy(() => import("./pages/Blog"));
const AboutPage = lazy(() => import("./pages/About"));
const ServicesPage = lazy(() => import("./pages/Services"));
const TeamPage = lazy(() => import("./pages/Team"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const WhyChooseUs = lazy(() => import("./pages/WhyChooseUs"));
const FAQPage = lazy(() => import("./pages/FAQ"));
const CareersPage = lazy(() => import("./pages/Careers"));

// Auth & User Dashboard
const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Admin (heavy – should never be loaded for regular visitors)
const AdminLayout = lazy(() => import("./pages/Admin"));
const AdminChat = lazy(() => import("./pages/admin/Chat"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminRepairs = lazy(() => import("./pages/admin/Repairs"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const AdminInternships = lazy(() => import("./pages/admin/AdminInternships"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));
const AdminHealth = lazy(() => import("./pages/admin/Health"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminWorkflow = lazy(() => import("./pages/admin/Workflow"));
const GalleryManagerPage = lazy(() => import("./pages/admin/GalleryManager"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const ProductsApproval = lazy(() => import("./pages/admin/ProductsApproval"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));

// ---------------------------------------------------------------------------

const queryClient = new QueryClient();

/** Simple loading spinner shown while a lazy chunk is being fetched */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Loading…</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SavedItemsProvider>
          <CartProvider>
          <BrowserRouter>
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/new" element={<ShopNew />} />
                  <Route path="/shop/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="/orders/:orderId/invoice" element={<InvoicePage />} />
                  <Route path="/track" element={<TrackPage />} />
                  <Route path="/submit" element={<SubmitPage />} />
                  <Route path="/saved-items" element={<SavedItems />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/internships" element={<CareersPage />} />
                  <Route path="admin" element={<AdminLayout />}>
                    <Route index element={null} />
                    <Route path="chat" element={<AdminChat />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="repairs" element={<AdminRepairs />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="internships" element={<AdminInternships />} />
                    <Route path="team" element={<AdminTeam />} />
                    <Route path="health" element={<AdminHealth />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="workflow" element={<AdminWorkflow />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="ProductsApproval" element={<ProductsApproval />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="gallery-manager" element={<GalleryManagerPage />} />
                  </Route>
                  <Route path="/ConfirmedCelebration" element={<ConfirmedCelebration />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/why-choose-us" element={<WhyChooseUs />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/more-pricing" element={<MorePricingPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
            <ScrollToTop />
            <FloatingWhatsApp />
            <CookieConsent />
          </BrowserRouter>
          </CartProvider>
        </SavedItemsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
