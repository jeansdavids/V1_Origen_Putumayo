import { useState } from "react";
import { openWhatsApp } from "../../utils/openWhatsApp";

interface Props {
  message: string;
  onDone?: () => void;
}

export default function CheckoutResult({ message, onDone }: Props) {
  const [blocked, setBlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenWhatsApp = () => {
    const opened = openWhatsApp(message);
    if (!opened) {
      setBlocked(true);
    } else {
      onDone?.();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
  };

  return (
  <section className="checkout-result">
    <h2 className="checkout-result-title">Pedido listo</h2>
    <p className="checkout-result-text">
      Tu pedido está listo para enviarse por WhatsApp.
    </p>

    <button className="whatsapp-btn" onClick={handleOpenWhatsApp}>
      Abrir WhatsApp
    </button>

    {blocked && (
      <div className="checkout-fallback">
        <p className="checkout-fallback-text">
          No se pudo abrir WhatsApp automáticamente.
          Copiá el mensaje y envialo manualmente.
        </p>

        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "Mensaje copiado" : "Copiar mensaje"}
        </button>
      </div>
    )}
  </section>
);

}
