import { useState } from "react";
import { openWhatsApp } from "../../utils/openWhatsApp";

interface Props {
  message: string;
}

export default function CheckoutResult({ message }: Props) {
  const [blocked, setBlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenWhatsApp = () => {
    const opened = openWhatsApp(message);
    if (!opened) {
      setBlocked(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      // No hacemos nada
    }
  };

  return (
    <section className="checkout-result">
      <h2 className="checkout-result-title">Pedido registrado</h2>
      <p className="checkout-result-text">
        Tu pedido fue guardado correctamente. Ahora puedes enviarlo por WhatsApp.
      </p>

      <button className="whatsapp-btn" onClick={handleOpenWhatsApp} type="button">
        Abrir WhatsApp
      </button>

      {blocked && (
        <div className="checkout-fallback">
          <p className="checkout-fallback-text">
            No se pudo abrir WhatsApp automáticamente. Copia el mensaje y envíalo manualmente.
          </p>

          <button className="copy-btn" onClick={handleCopy} type="button">
            {copied ? "Mensaje copiado" : "Copiar mensaje"}
          </button>
        </div>
      )}
    </section>
  );
}