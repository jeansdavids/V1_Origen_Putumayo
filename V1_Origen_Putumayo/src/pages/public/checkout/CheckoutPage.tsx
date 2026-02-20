// src/pages/public/checkout/CheckoutPage.tsx
import { useMemo, useState } from "react";
import CheckoutForm from "../../../components/common/CheckoutForm";
import CheckoutResult from "../../../components/common/CheckoutResult";
import { useCart } from "../../../features/cart/CartContext";
import { buildWhatsAppMessage } from "../../../utils/whatsapp";
import { supabase } from "../../../lib/supabaseClient";
import type { OrderItemSnapshot, CustomerSnapshot } from "../../../types/order";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     SNAPSHOT DE PRODUCTOS
  ========================= */
  const checkoutItems: OrderItemSnapshot[] = useMemo(() => {
    return items.map((item) => {
      const unitPrice = Number(item.price);
      const subtotal = unitPrice * item.quantity;

      return {
        product_id: item.id,
        product_name: item.name,
        company_name: "Origen Putumayo",
        quantity: item.quantity,
        item_type: "normal" as const,
        unit_price: unitPrice,
        subtotal: subtotal,
      };
    });
  }, [items]);

  /* =========================
     TOTAL GENERAL
  ========================= */
  const totalAmount = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
  }, [checkoutItems]);

  /* =========================
     ESTADO CARRITO VACÍO
  ========================= */
  if (items.length === 0 && !message) {
    return (
      <section>
        <h2>CHECKOUT</h2>
        <p>Tu carrito está vacío.</p>
      </section>
    );
  }

  /* =========================
     RESULTADO FINAL
  ========================= */
  if (message) {
    return <CheckoutResult message={message} />;
  }

  /* =========================
     GUARDAR PEDIDO
  ========================= */
  const handleOrderSuccess = async (customer: CustomerSnapshot) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("order_request")
        .insert({
          customer,
          items_json: checkoutItems,
          total_amount: totalAmount,
          internal_notes: null,
        });

      if (error) {
        console.error("Error guardando pedido:", error);
        alert("Ocurrió un error al guardar el pedido. Intente nuevamente.");
        return;
      }

      const msg = buildWhatsAppMessage({
        customer,
        items: checkoutItems,
        totalAmount,
      });

      // LimpiA el carrito inmediatamente después de guardar
      clearCart();

      setMessage(msg);
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Error inesperado al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <CheckoutForm
        items={checkoutItems}
        onSuccess={handleOrderSuccess}
        loading={loading}
      />
    </section>
  );
}