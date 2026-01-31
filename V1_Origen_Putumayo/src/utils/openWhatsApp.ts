// Abre WhatsApp Web con un mensaje predefinido.
export function openWhatsApp(message: string): boolean {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER as string;

  if (!phone) {
    console.error("WhatsApp number is not defined");
    return false;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Intento explícito de apertura (debe llamarse desde un click)
  const win = window.open(url, "_blank", "noopener,noreferrer");

  // Si el navegador bloquea el popup, window.open devuelve null
  if (!win) {
    return false;
  }

  return true;
}
