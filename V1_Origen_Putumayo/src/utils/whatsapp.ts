import type { CustomerSnapshot, OrderItemSnapshot } from "../types/order";

interface BuildMessageParams {
  customer: CustomerSnapshot;
  items: OrderItemSnapshot[];
}

export function buildWhatsAppMessage({
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
    "🟢 NUEVO PEDIDO – ORIGEN PUTUMAYO",
    "",
    "👤 DATOS DEL CLIENTE",
    `Nombre: ${customer.full_name}`,
    `Teléfono: ${customer.phone}`,
    `Documento: ${customer.document_type} ${customer.document_id}`,
    `Ciudad: ${customer.city}`,
    `Dirección: ${customer.address}`,
    "",
    "📦 PRODUCTOS",
    itemsText,
    "",
    "📝 NOTAS DEL CLIENTE:",
    customer.notes || "—",
    "",
    "📍 REFERENCIAS:",
    customer.references || "—",
    "",
    "—",
    "Pedido generado desde el sitio web de Origen Putumayo",
  ].join("\n");
}
