// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/Products.css/ProductCard.css";

/**
 * ProductCard
 * - Usa datos reales de Supabase (defensivo)
 * - Sin Tailwind
 * - Preparado para grid / destacados
 */
const ProductCard = ({ product, getImg, linkBase = "/products" }) => {
  if (!product) return null;

  const id = product?.product_id ?? product?.productId ?? product?.id;

  // Precio (soporta varios nombres comunes)
  const price =
    product?.price ??
    product?.unit_price ??
    product?.price_value ??
    product?.price_cop ??
    product?.precio ??
    null;

  const currency = product?.currency ?? "COP";

  const priceLabel =
    price === null || price === undefined || price === ""
      ? "—"
      : new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(Number(price));

  const category = product?.category || product?.categoryName || "—";
  const company = product?.companyName || product?.company_name || "—";
  const location = product?.location || product?.locationName || "—";

  const availabilityRaw = product?.availability || "";
  const availabilityLabel = (() => {
    const v = String(availabilityRaw).toLowerCase();
    if (v === "available") return "Disponible";
    if (v === "out_of_stock") return "Sin stock";
    if (v === "on_demand") return "Bajo pedido";
    return availabilityRaw || null;
  })();

  // Chips: usa tags si existen; si no, category + availability
  const chips =
    Array.isArray(product?.tags) && product.tags.length
      ? product.tags.slice(0, 2)
      : [category, availabilityLabel].filter(Boolean).slice(0, 2);

  const to = id ? `${linkBase}/${id}` : linkBase;

  return (
    <article className="pCard">
      {/* Imagen */}
      <div className="pCard__imgWrap">
        <img
          className="pCard__img"
          src={getImg(product)}
          alt={product?.name || "Producto"}
        />
      </div>

      {/* Contenido */}
      <div className="pCard__body">
        <h3 className="pCard__name">{product?.name || "Producto"}</h3>

        {chips.length > 0 && (
          <div className="pCard__chips">
            {chips.map((t) => (
              <span key={t} className="pCard__chip">
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="pCard__line">
          <span className="pCard__lineLabel">Empresa:</span>
          <span className="pCard__lineValue">{company}</span>
        </p>

        <p className="pCard__line pCard__line--withDot">
          <span className="pCard__dot" aria-hidden="true" />
          <span className="pCard__lineValue">{location}</span>
        </p>

        <p className="pCard__price">
          <span className="pCard__priceLabel">Precio:</span>
          <span className="pCard__priceValue">{priceLabel}</span>
        </p>

        <Link className="pCard__btn" to={to}>
          Ver producto
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
