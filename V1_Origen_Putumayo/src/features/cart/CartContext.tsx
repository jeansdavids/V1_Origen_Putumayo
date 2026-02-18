/* eslint-disable react-refresh/only-export-components */
// src/features/cart/CartContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
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
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* =========================
   LOCAL STORAGE
========================= */
const CART_STORAGE_KEY = "origen_cart_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clampQuantity(q: unknown): number {
  if (typeof q !== "number" || !Number.isFinite(q)) return 1;
  const n = Math.floor(q);
  return n < 1 ? 1 : n;
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const sanitized: CartItem[] = [];

    for (const item of parsed) {
      if (!isRecord(item)) continue;

      const id = item["id"];
      const name = item["name"];
      const price = item["price"];
      const image = item["image"];
      const quantity = item["quantity"];

      if (typeof id !== "string" || id.trim().length === 0) continue;
      if (typeof name !== "string" || name.trim().length === 0) continue;
      if (typeof price !== "number" || !Number.isFinite(price)) continue;

      // image es opcional: si viene, debe ser string
      if (typeof image !== "undefined" && typeof image !== "string") continue;

      sanitized.push({
        id,
        name,
        price,
        image,
        quantity: clampQuantity(quantity),
      });
    }

    return sanitized;
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // si falla (modo incógnito/cuota/permisos), no rompemos la app
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Cargar carrito desde storage una sola vez
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [isOpen, setIsOpen] = useState(false);

  // Guardar carrito cada vez que cambie
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

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
    const safeQty =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + safeQty } : i
        );
      }

      return [...prev, { ...item, quantity: safeQty }];
    });
  };

  /* =========================
     UPDATE QUANTITY (+ / −)
  ========================= */
  const updateQuantity = (id: string, delta: number) => {
    const safeDelta = Number.isFinite(delta) ? Math.trunc(delta) : 0;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const nextQty = item.quantity + safeDelta;

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
    updateQuantity,
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
