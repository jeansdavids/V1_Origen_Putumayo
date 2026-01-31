import { useEffect, useMemo, useState } from "react";
import type { OrderItemSnapshot } from "../types/order";

const STORAGE_KEY = "origen_cart_v1";

function readCart(): OrderItemSnapshot[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(cart: OrderItemSnapshot[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function useCart() {
  const [cart, setCart] = useState<OrderItemSnapshot[]>(() => readCart());

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const addItem = (item: OrderItemSnapshot) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.product_id === item.product_id
      );

      if (existing) {
        return prev.map((p) =>
          p.product_id === item.product_id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeItem = (product_id: string) => {
    setCart((prev) => prev.filter((p) => p.product_id !== product_id));
  };

  const updateQuantity = (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(product_id);
      return;
    }

    setCart((prev) =>
      prev.map((p) =>
        p.product_id === product_id ? { ...p, quantity } : p
      )
    );
  };

  const clear = () => setCart([]);

  return {
    cart,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}
