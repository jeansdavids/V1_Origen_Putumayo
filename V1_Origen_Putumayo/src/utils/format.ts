/**
 * Genera un slug URL-amigable a partir del nombre y UUID del producto.
 * Formato: "nombre-producto-{8 primeros chars del UUID sin guiones}"
 * Ejemplo: cafe-organico-250g-550e8400
 */
export function generateSlug(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^a-z0-9\s-]/g, "")   // elimina caracteres especiales
    .trim()
    .replace(/\s+/g, "-");           // espacios a guiones

  const shortId = id.replace(/-/g, "").slice(0, 8);
  return `${base}-${shortId}`;
}
