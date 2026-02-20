import { useState } from "react";

import type {
  CustomerSnapshot,
  DocumentType,
  OrderItemSnapshot,
} from "../../types/order";

interface Props {
  items: OrderItemSnapshot[];
  onSuccess?: (customer: CustomerSnapshot) => void;
  loading?: boolean;
}

const documentTypes: DocumentType[] = ["CC", "TI", "CE", "PASAPORTE"];

export default function CheckoutForm({
  items,
  onSuccess,
  loading = false,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerSnapshot>({
    full_name: "",
    address: "",
    city: "",
    document_type: "CC",
    document_id: "",
  });

  const update = (k: keyof CustomerSnapshot, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.full_name.length >= 3 &&
    form.address.length >= 5 &&
    form.city.length > 0 &&
    form.document_id.length >= 5 &&
    items.length > 0;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || loading) return;

    try {
      setError(null);
      onSuccess?.(form);
    } catch {
      setError("Error procesando el pedido");
    }
  };

  return (
    <form className="checkout-form" onSubmit={submit}>
      <h3 className="checkout-title">DATOS DEL COMPRADOR</h3>

      <input
        className="checkout-input"
        placeholder="Nombre completo"
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
        required
      />

      <input
        className="checkout-input"
        placeholder="Dirección"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
        required
      />

      <input
        className="checkout-input"
        placeholder="Ciudad"
        value={form.city}
        onChange={(e) => update("city", e.target.value)}
        required
      />

      <select
        className="checkout-input"
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
        className="checkout-input"
        placeholder="Documento"
        value={form.document_id}
        onChange={(e) => update("document_id", e.target.value)}
        required
      />

      {error && <p className="checkout-error">{error}</p>}

      <button
        className="checkout-submit"
        type="submit"
        disabled={!isValid || loading}
      >
        {loading ? "Procesando pedido..." : "Confirmar pedido"}
      </button>
    </form>
  );
}