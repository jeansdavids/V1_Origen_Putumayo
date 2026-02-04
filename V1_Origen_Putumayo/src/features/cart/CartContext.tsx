/* eslint-disable react-refresh/only-export-components */
// src/features/cart/CartContext.tsx

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "./types";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    item: Omit<CartItem, "quantity">,
    quantity?: number
  ) => void;
  updateQuantity: (id: string, delta: number) => void; // ✅ NUEVO
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  /* =========================
     UI STATE
  ========================= */
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...item, quantity }];
    });
  };

  /* =========================
     UPDATE QUANTITY (+ / −)
  ========================= */
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const nextQty = item.quantity + delta;

        // Nunca bajar de 1
        if (nextQty < 1) return item;

        return {
          ...item,
          quantity: nextQty,
        };
      })
    );
  };

  /* =========================
     REMOVE / CLEAR
  ========================= */
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  /* =========================
     DERIVED VALUES
  ========================= */
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    isOpen,
    totalItems,
    subtotal,
    openCart,
    closeCart,
    addToCart,
    updateQuantity, // ✅ EXPORTADO
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
