
import React, { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart(prev =>
      prev.some(i => i.id === item.id)
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }]
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
