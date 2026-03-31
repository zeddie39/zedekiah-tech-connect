import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, ArrowLeft, ShoppingBag, Heart, ShoppingCart, LayoutDashboard, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";

const navLinks = [
  { label: "Shop", to: "/shop", icon: ShoppingBag },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/cart", icon: ShoppingCart },
  { label: "Orders", to: "/orders", icon: ShoppingBag },
  { label: "Add Product", to: "/shop/new", icon: PlusCircle },
];

export default function ShopNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  const handleNav = (to: string) => {
    setOpen(false);
    if (location.pathname !== to) navigate(to);
  };

  const cartCount = cartItems?.length || 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {location.pathname !== "/shop" && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </Button>
          )}

          <Link to="/shop" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-10 h-10 rounded-full relative z-10 border-2 border-primary/30 shadow-lg group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none text-foreground">
                ZTech <span className="text-primary">Store</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Electronics Marketplace</span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Button
                key={link.to}
                variant="ghost"
                size="sm"
                className={`gap-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => handleNav(link.to)}
              >
                <Icon size={16} />
                {link.label}
                {link.to === "/cart" && cartCount > 0 && (
                  <span className="ml-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            );
          })}
          <div className="h-8 w-px bg-border/60 mx-2" />
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/wishlist')}
            className="relative rounded-xl"
          >
            <Heart size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cart')}
            className="relative rounded-xl"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-xl"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-2xl z-40 animate-fade-in">
          <div className="p-4 flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Button
                  key={link.to}
                  variant="ghost"
                  className={`justify-start gap-3 w-full rounded-xl h-11 ${
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                  }`}
                  onClick={() => handleNav(link.to)}
                >
                  <Icon size={18} />
                  {link.label}
                </Button>
              );
            })}
            <div className="my-2 border-t border-border/40" />
            <Button
              variant="outline"
              className="justify-start gap-3 w-full rounded-xl h-11 border-primary/20"
              onClick={() => handleNav('/dashboard')}
            >
              <LayoutDashboard size={18} />
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
