// src/pages/public/checkout/CheckoutPage.tsx
import CheckoutForm from "../../../components/common/CheckoutForm";
import { useCart } from "../../../features/cart/CartContext";
import { buildWhatsAppMessage } from "../../../utils/whatsapp";
import { openWhatsApp } from "../../../utils/openWhatsApp";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h2>Checkout</h2>
        <p>Tu carrito está vacío.</p>
      </section>
    );
  }

  // Snapshot del carrito para el checkout (simple y seguro)
  const checkoutItems = items.map((item) => ({
    product_id: item.id,
    product_name: item.name,
    company_name: "Origen Putumayo", // valor seguro para MVP
    quantity: item.quantity,
    item_type: "normal" as const, // MVP: todo normal
  }));

  return (
    <section>
      <h2>Finalizar pedido</h2>

      <CheckoutForm
        items={checkoutItems}
        onSuccess={({ orderId, customer }) => {
          const message = buildWhatsAppMessage({
            orderId, // ID solo informativo (frontend)
            customer,
            items: checkoutItems,
          });

          openWhatsApp(message);
          clearCart();
        }}
      />
    </section>
  );
}
