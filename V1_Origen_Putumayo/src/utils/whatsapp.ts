import type { CustomerSnapshot, OrderItemSnapshot } from "../types/order";

interface BuildMessageParams {
  orderId: string;
  customer: CustomerSnapshot;
  items: OrderItemSnapshot[];
}

export function buildWhatsAppMessage({
  orderId,
  customer,
  items,
}: BuildMessageParams): string {
  const itemsText =
    items.length > 0
      ? items
          .map(
            (i, idx) =>
              `${idx + 1}. ${i.product_name} (${i.company_name}) x${
                i.quantity
              }${i.item_type === "encargo" ? " [ENCARGO]" : ""}`
          )
          .join("\n")
      : "—";

  return [
    "🟢 *Nuevo pedido – Origen Putumayo*",
    `🆔 Pedido: ${orderId}`,
    "",
    "👤 *Cliente*",
    `Nombre: ${customer.full_name}`,
    `Teléfono: ${customer.phone}`,
    `Documento: ${customer.document_type} ${customer.document_id}`,
    `Dirección: ${customer.address}`,
    `Ciudad: ${customer.city}`,
    "",
    "📦 *Productos*",
    itemsText,
    "",
    `📝 Notas: ${customer.notes || "—"}`,
    `📍 Referencias: ${customer.references || "—"}`,
  ].join("\n");
}
