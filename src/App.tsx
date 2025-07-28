import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import MorePricingPage from "./pages/MorePricingPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/Admin";
import AdminChat from "./pages/admin/Chat";
import AdminRepairs from "./pages/admin/Repairs";
import AdminNotifications from "./pages/admin/Notifications";
import AdminTeam from "./pages/admin/Team";
import AdminHealth from "./pages/admin/Health";
import AdminReports from "./pages/admin/Reports";
import AdminWorkflow from "./pages/admin/Workflow";
import GalleryManagerPage from "./pages/admin/GalleryManager";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/admin/Users";
import Shop from "./pages/Shop";
import ShopNew from "./pages/ShopNew";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrdersPage from "./pages/Orders";
import { CartProvider } from "@/components/CartContext";
import ProductDetails from "./pages/ProductDetails";
import ConfirmedCelebration from "./pages/ConfirmedCelebration";
import BlogPage from "./pages/Blog";
import BackToTopButton from "@/components/BackToTopButton";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import TeamPage from "./pages/Team";
import ContactPage from "./pages/Contact";
import ProductsApproval from "./pages/admin/ProductsApproval";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import WhyChooseUs from "./pages/WhyChooseUs";
import FAQPage from "./pages/FAQ";
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={null} />
              <Route path="chat" element={<AdminChat />} />
              <Route path="repairs" element={<AdminRepairs />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="health" element={<AdminHealth />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="workflow" element={<AdminWorkflow />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="ProductsApproval" element={<ProductsApproval />} />
              <Route path="gallery-manager" element={<GalleryManagerPage />} />
            </Route>
            <Route path="/ConfirmedCelebration" element={<ConfirmedCelebration />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/more-pricing" element={<MorePricingPage />} />
            <Route path="/gallery" element={<Gallery />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTopButton />
          <CookieConsent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
