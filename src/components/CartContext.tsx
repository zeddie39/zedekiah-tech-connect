import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const CART_STORAGE_KEY = "ztech_cart";

type CartItem = {
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
  isSyncing: boolean;
  isCloudSynced: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Cart load error", e);
  }
  return [];
}

function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Cart save error", e);
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const isCloudSynced = !!userId;
  const skipNextPush = useRef(false);

  // Load local cart on mount
  useEffect(() => {
    setCart(loadCartFromStorage());
    setIsLoaded(true);
  }, []);

  // Track auth state and hydrate from cloud on login
  useEffect(() => {
    let mounted = true;

    const hydrateFromCloud = async (uid: string) => {
      setIsSyncing(true);
      const { data, error } = await (supabase as any)
        .from("user_cart")
        .select("product_id, title, price, image, quantity")
        .eq("user_id", uid);

      if (!mounted) return;

      if (!error && data) {
        const cloud: CartItem[] = data.map((r: any) => ({
          id: r.product_id,
          title: r.title,
          price: Number(r.price),
          image: r.image,
          quantity: r.quantity,
        }));
        // Merge: prefer max quantity per product between local & cloud
        const local = loadCartFromStorage();
        const merged = new Map<string, CartItem>();
        [...cloud, ...local].forEach((it) => {
          const existing = merged.get(it.id);
          if (!existing) merged.set(it.id, { ...it });
          else merged.set(it.id, { ...existing, quantity: Math.max(existing.quantity, it.quantity) });
        });
        const mergedArr = Array.from(merged.values());
        skipNextPush.current = false; // We do want to push merged state back
        setCart(mergedArr);
      }
      setIsSyncing(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (uid) hydrateFromCloud(uid);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      setUserId(uid);
      if (uid) hydrateFromCloud(uid);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (isLoaded) saveCartToStorage(cart);
  }, [cart, isLoaded]);

  // Push to cloud (debounced) whenever cart changes and user is logged in
  useEffect(() => {
    if (!isLoaded || !userId) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    const t = setTimeout(async () => {
      setIsSyncing(true);
      try {
        // Full replace: delete then upsert current items
        await (supabase as any).from("user_cart").delete().eq("user_id", userId);
        if (cart.length) {
          await (supabase as any).from("user_cart").insert(
            cart.map((c) => ({
              user_id: userId,
              product_id: c.id,
              title: c.title,
              price: c.price,
              image: c.image ?? null,
              quantity: c.quantity,
            }))
          );
        }
      } catch (e) {
        console.error("Cloud cart sync failed", e);
      } finally {
        setIsSyncing(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [cart, isLoaded, userId]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }]
    );
  }
  function removeFromCart(id: string) { setCart((prev) => prev.filter((i) => i.id !== id)); }
  function clearCart() { setCart([]); }
  function updateQuantity(id: string, quantity: number) {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)));
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, cartCount, cartTotal, isSyncing, isCloudSynced }}
    >
      {children}
    </CartContext.Provider>
  );
};
