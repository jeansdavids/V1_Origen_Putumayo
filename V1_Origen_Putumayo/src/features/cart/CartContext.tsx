/* eslint-disable react-refresh/only-export-components */
// src/features/cart/CartContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartItem } from "./types";

interface AddToCartOptions {
  notify?: boolean;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;

  lastAddedItem: CartItem | null;
  showSuccess: boolean;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  pauseSuccessTimer: () => void;
  resumeSuccessTimer: () => void;

  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
    options?: AddToCartOptions
  ) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "origen_cart_v1";

/* =========================
   HELPERS
========================= */

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

      if (typeof id !== "string") continue;
      if (typeof name !== "string") continue;
      if (typeof price !== "number") continue;

      sanitized.push({
        id,
        name,
        price,
        image: typeof image === "string" ? image : "",
        quantity: clampQuantity(quantity),
      });
    }

    return sanitized;
  } catch (error) {
    console.warn("Error loading cart from storage:", error);
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Error saving cart to storage:", error);
  }
}

/* =========================
   PROVIDER
========================= */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() =>
    loadCartFromStorage()
  );

  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] =
    useState<CartItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /* =========================
     TIMER PROFESIONAL
  ========================= */

  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(4500);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    startTimeRef.current = Date.now();

    timeoutRef.current = window.setTimeout(() => {
      setShowSuccess(false);
      remainingTimeRef.current = 4500;
    }, remainingTimeRef.current);
  };

  const pauseSuccessTimer = () => {
    if (timeoutRef.current === null) return;

    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(
      0,
      remainingTimeRef.current - elapsed
    );

    clearTimer();
  };

  const resumeSuccessTimer = () => {
    if (remainingTimeRef.current <= 0) {
      setShowSuccess(false);
      return;
    }

    startTimer();
  };

  /* =========================
     EFFECTS
  ========================= */

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  /* =========================
     UI ACTIONS
  ========================= */

  const openCart = () => {
    setIsOpen(true);

    // 🔥 Si el toast está visible, lo cerramos
    if (showSuccess) {
      setShowSuccess(false);
      clearTimer();
      remainingTimeRef.current = 4500;
    }
  };

  const closeCart = () => setIsOpen(false);

  /* =========================
     CART ACTIONS
  ========================= */

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1,
    options?: AddToCartOptions
  ) => {
    const notify = options?.notify ?? true;

    const safeQty =
      Number.isFinite(quantity) && quantity > 0
        ? Math.floor(quantity)
        : 1;

    const newItem: CartItem = {
      ...item,
      quantity: safeQty,
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + safeQty }
            : i
        );
      }

      return [...prev, newItem];
    });

    /* =========================
       🔥 NUEVA LÓGICA UX
       No mostrar toast si el carrito está abierto
    ========================= */

    if (notify && !isOpen) {
      setLastAddedItem(newItem);
      setShowSuccess(true);

      remainingTimeRef.current = 4500;
      startTimer();
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

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

    lastAddedItem,
    showSuccess,
    setShowSuccess,

    pauseSuccessTimer,
    resumeSuccessTimer,

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