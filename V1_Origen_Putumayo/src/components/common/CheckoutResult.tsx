import { useState } from "react";
import { openWhatsApp } from "../../utils/openWhatsApp";

interface Props {
  message: string;
  onDone?: () => void;
}

export default function CheckoutResult({ message, onDone }: Props) {
  const [blocked, setBlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);

  const safeDone = () => {
    if (done) return;
    setDone(true);
    onDone?.();
  };

  const handleOpenWhatsApp = () => {
    const opened = openWhatsApp(message);
    if (!opened) {
      setBlocked(true);
    } else {
      safeDone();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      safeDone();
    } catch {
      // Si no pudo copiar, no limpiamos carrito para no perder el mensaje
    }
  };

  return (
    <section className="checkout-result">
      <h2 className="checkout-result-title">Pedido listo</h2>
      <p className="checkout-result-text">
        Tu pedido está listo para enviarse por WhatsApp.
      </p>

      <button className="whatsapp-btn" onClick={handleOpenWhatsApp} type="button">
        Abrir WhatsApp
      </button>

      {blocked && (
        <div className="checkout-fallback">
          <p className="checkout-fallback-text">
            No se pudo abrir WhatsApp automáticamente. Copiá el mensaje y envialo manualmente.
          </p>

          <button className="copy-btn" onClick={handleCopy} type="button">
            {copied ? "Mensaje copiado" : "Copiar mensaje"}
          </button>
        </div>
      )}
    </section>
  );
}
