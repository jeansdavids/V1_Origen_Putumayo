// src/pages/public/checkout/CheckoutPage.tsx
import { useState } from "react";
import CheckoutForm from "../../../components/common/CheckoutForm";
import CheckoutResult from "../../../components/common/CheckoutResult";
import { useCart } from "../../../features/cart/CartContext";
import { buildWhatsAppMessage } from "../../../utils/whatsapp";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  // Mensaje listo para WhatsApp (paso intermedio)
  const [message, setMessage] = useState<string | null>(null);

  // Si no hay carrito y aún no hay mensaje, no hay checkout
  if (items.length === 0 && !message) {
    return (
      <section>
        <h2>CHECKOUT</h2>
        <p>Tu carrito está vacío.</p>
      </section>
    );
  }

  // Snapshot del carrito para el mensaje (estable)
  const checkoutItems = items.map((item) => ({
    product_id: item.id,
    product_name: item.name,
    company_name: "Origen Putumayo",
    quantity: item.quantity,
    item_type: "normal" as const,
  }));

  // PASO 3: Pantalla intermedia "Pedido listo"
  if (message) {
    return (
      <CheckoutResult
        message={message}
        onDone={() => {
          clearCart();
        }}
      />
    );
  }

  // PASO 1 + 2: Formulario
  return (
    <section>
      

      <CheckoutForm
        items={checkoutItems}
        onSuccess={(customer) => {
          const msg = buildWhatsAppMessage({
            customer,
            items: checkoutItems,
          });

          // NO abrimos WhatsApp aquí
          // Solo preparamos el mensaje y pasamos al paso intermedio
          setMessage(msg);
        }}
      />
    </section>
  );
}
