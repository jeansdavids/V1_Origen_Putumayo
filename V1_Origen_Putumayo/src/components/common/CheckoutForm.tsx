import { useState } from "react";
import { createOrderRequest } from "../../services/orderRequest";

import type {
  CustomerSnapshot,
  DocumentType,
  OrderItemSnapshot,
} from "../../types/order";

interface Props {
  items: OrderItemSnapshot[];
  onSuccess?: (data: {
    orderId: string;
    customer: CustomerSnapshot;
  }) => void;
}

const documentTypes: DocumentType[] = ["CC", "TI", "CE", "PASAPORTE"];

export default function CheckoutForm({ items, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerSnapshot>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    document_type: "CC",
    document_id: "",
    references: "",
    notes: "",
  });

  const update = (k: keyof CustomerSnapshot, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.full_name.length >= 3 &&
    /^\d{7,}$/.test(form.phone) &&
    form.address.length >= 5 &&
    form.city.length > 0 &&
    form.document_id.length >= 5 &&
    items.length > 0;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || loading) return;

    try {
      setLoading(true);
      setError(null);

      // 👉 ahora solo insertamos, no leemos nada
      await createOrderRequest({
        customer: form,
        items_json: items,
      });

      // 👉 ID solo para UX / WhatsApp (no es el de la DB)
      const clientOrderId = crypto.randomUUID();

      onSuccess?.({
        orderId: clientOrderId,
        customer: form,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error creando la orden");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Datos del comprador</h3>

      <input
        placeholder="Nombre completo"
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
        required
      />

      <input
        placeholder="Teléfono"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
        required
      />

      <input
        placeholder="Dirección"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
        required
      />

      <input
        placeholder="Ciudad"
        value={form.city}
        onChange={(e) => update("city", e.target.value)}
        required
      />

      <select
        value={form.document_type}
        onChange={(e) =>
          update("document_type", e.target.value as DocumentType)
        }
      >
        {documentTypes.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <input
        placeholder="Documento"
        value={form.document_id}
        onChange={(e) => update("document_id", e.target.value)}
        required
      />

      <textarea
        placeholder="Referencias (opcional)"
        value={form.references ?? ""}
        onChange={(e) => update("references", e.target.value)}
      />

      <textarea
        placeholder="Notas (opcional)"
        value={form.notes ?? ""}
        onChange={(e) => update("notes", e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={!isValid || loading}>
        {loading ? "Enviando..." : "Confirmar pedido"}
      </button>
    </form>
  );
}
