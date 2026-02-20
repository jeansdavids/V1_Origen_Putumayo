import type { CustomerSnapshot, OrderItemSnapshot } from "../types/order";

interface BuildMessageParams {
  customer: CustomerSnapshot;
  items: OrderItemSnapshot[];
  totalAmount: number;
}

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export function buildWhatsAppMessage({
  customer,
  items,
  totalAmount,
}: BuildMessageParams): string {
  const itemsText =
    items.length > 0
      ? items
          .map((i, idx) => {
            const unitPrice = formatCOP(i.unit_price);
            const subtotal = formatCOP(i.subtotal);

            return [
              `${idx + 1}. ${i.product_name}`,
              `   Empresa: ${i.company_name}`,
              `   Cantidad: ${i.quantity}`,
              `   Precio unitario: ${unitPrice}`,
              `   Subtotal: ${subtotal}`,
              i.item_type === "encargo" ? `   Tipo: Encargo` : "",
            ]
              .filter(Boolean)
              .join("\n");
          })
          .join("\n\n")
      : "—";

  return [
    "NUEVO PEDIDO – ORIGEN PUTUMAYO",
    "---------------------------------------",
    "",
    "DATOS DEL CLIENTE",
    `Nombre: ${customer.full_name}`,
    `Documento: ${customer.document_type} ${customer.document_id}`,
    `Ciudad: ${customer.city}`,
    `Dirección: ${customer.address}`,
    "",
    "DETALLE DEL PEDIDO",
    itemsText,
    "",
    "TOTAL DEL PEDIDO",
    formatCOP(totalAmount),
    "",
    "---------------------------------------",
    "Pedido generado desde el sitio web de Origen Putumayo.",
  ].join("\n");
}