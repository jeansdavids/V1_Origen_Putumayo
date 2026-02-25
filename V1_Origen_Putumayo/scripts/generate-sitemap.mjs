/**
 * generate-sitemap.mjs
 *
 * Genera public/sitemap.xml consultando los productos desde Supabase.
 * Se ejecuta automáticamente antes de cada build (ver package.json).
 *
 * Cómo funciona:
 *  1. Lee las credenciales de Supabase desde .env.local
 *  2. Consulta la vista products_public para obtener product_id y name
 *  3. Replica la función generateSlug de src/utils/format.ts
 *  4. Construye las URLs estáticas + una entrada por producto
 *  5. Escribe public/sitemap.xml
 */

import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── 1. LEER .env.local ──────────────────────────────────────────────────────

function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

const env = {
  ...loadEnv(resolve(ROOT, ".env")),
  ...loadEnv(resolve(ROOT, ".env.local")), // .env.local tiene prioridad en local
};

// En Vercel las vars vienen como process.env, no como archivo
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_ANON_KEY;
const BASE_URL = "https://www.origenputumayo.com";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌  Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local");
  process.exit(1);
}

// ─── 2. RÉPLICA DE generateSlug (src/utils/format.ts) ────────────────────────
// Debe mantenerse sincronizada con la función original.

function generateSlug(name, id) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const shortId = id.replace(/-/g, "").slice(0, 8);
  return `${base}-${shortId}`;
}

// ─── 3. RUTAS ESTÁTICAS ───────────────────────────────────────────────────────

const STATIC_URLS = [
  { loc: `${BASE_URL}/`,          priority: "1.0", changefreq: "weekly"  },
  { loc: `${BASE_URL}/productos`, priority: "0.9", changefreq: "daily"   },
  { loc: `${BASE_URL}/historia`,  priority: "0.7", changefreq: "monthly" },
  { loc: `${BASE_URL}/contacto`,  priority: "0.6", changefreq: "monthly" },
];

// ─── 4. GENERAR XML ───────────────────────────────────────────────────────────

function buildXml(urls) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const entries = urls
    .map(({ loc, priority, changefreq }) =>
      [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n")
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

// ─── 5. MAIN ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("🗺️  Generando sitemap.xml...");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: products, error } = await supabase
    .from("products_public")
    .select("product_id, name");

  if (error) {
    console.error("❌  Error consultando Supabase:", error.message);
    process.exit(1);
  }

  const productUrls = (products ?? [])
    .filter((p) => p.product_id && p.name)
    .map((p) => ({
      loc: `${BASE_URL}/productos/${generateSlug(p.name, p.product_id)}`,
      priority: "0.8",
      changefreq: "weekly",
    }));

  const allUrls = [...STATIC_URLS, ...productUrls];
  const xml = buildXml(allUrls);

  const outPath = resolve(ROOT, "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");

  console.log(`✅  sitemap.xml generado: ${allUrls.length} URLs (${productUrls.length} productos)`);
}

main();
