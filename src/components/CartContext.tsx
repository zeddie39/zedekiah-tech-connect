
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const CART_STORAGE_KEY = "ztech_cart";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
  isAvailable?: boolean;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return [];
}

// Save cart to localStorage
function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount and check availability
  useEffect(() => {
    const checkAvailability = async (items: CartItem[]) => {
      if (items.length === 0) {
        setCart([]);
        setIsLoaded(true);
        return;
      }
      
      const ids = items.map(i => i.id);
      const { data, error } = await supabase
        .from("products")
        .select("id, status")
        .in("id", ids);
        
      if (error) {
        console.error("Failed to check product availability", error);
        setCart(items); // fallback to stored
      } else {
        const availableIds = new Set(data?.filter(p => p.status === 'approved').map(p => p.id) || []);
        setCart(items.map(item => ({
          ...item,
          isAvailable: availableIds.has(item.id)
        })));
      }
      setIsLoaded(true);
    };

    const storedCart = loadCartFromStorage();
    checkAvailability(storedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(cart);
    }
  }, [cart, isLoaded]);

  // Calculate cart count and total
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item: Omit<CartItem, "quantity" | "isAvailable">) {
    setCart(prev =>
      prev.some(i => i.id === item.id)
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1, isAvailable: true }]
    );
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateQuantity(id: string, quantity: number) {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
    );
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

