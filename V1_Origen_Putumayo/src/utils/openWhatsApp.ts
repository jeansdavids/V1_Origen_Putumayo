export function openWhatsApp(message: string) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER as string;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
