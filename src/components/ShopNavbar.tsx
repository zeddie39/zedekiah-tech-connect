
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Shop", to: "/shop" },
  { label: "Cart", to: "/cart" },
  { label: "Orders", to: "/orders" },
  { label: "Add Product", to: "/shop/new" },
];

export default function ShopNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (to: string) => {
    setOpen(false);
    if (location.pathname !== to) navigate(to);
  };

  return (
    <nav className="w-full px-3 py-4 bg-primary text-white shadow sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div
          className="font-bold text-lg cursor-pointer font-orbitron flex items-center gap-2"
          onClick={() => handleNav("/shop")}
        >
          <span>Zedekiah Shop</span>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
            <button
              key={link.to}
              className={
                "hover:underline hover:text-accent transition-all" +
                (location.pathname === link.to ? " underline text-accent" : "")
              }
              onClick={() => handleNav(link.to)}
            >
              {link.label}
            </button>
          ))}
        </div>
        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 rounded hover:bg-accent/10"
          onClick={() => setOpen(o => !o)}
          aria-label="Open navigation menu"
        >
          <Menu size={28} />
        </button>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden mt-3 bg-primary/95 rounded shadow p-3 animate-slide-in-right z-30 absolute left-0 right-0">
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <button
                key={link.to}
                onClick={() => handleNav(link.to)}
                className={
                  "text-left w-full px-1 py-2 rounded hover:bg-accent/20" +
                  (location.pathname === link.to ? " text-accent underline" : "")
                }
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
