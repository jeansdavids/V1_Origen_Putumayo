// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/Products.css/ProductCard.css";

/**
 * ProductCard (listados / destacados)
 * - Diseño como el mock (sin background del contenedor)
 * - Agrega precio
 * - Rutas: /products y /products/:id
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

  // Chips: usa tags si existen, si no: muestra category + availability
  const chips = Array.isArray(product?.tags) && product.tags.length
    ? product.tags.slice(0, 2)
    : [category, availabilityLabel].filter(Boolean).slice(0, 2);

  const to = id ? `${linkBase}/${id}` : linkBase;

  return (
    <article className="pCard">
      <div className="pCard__imgWrap">
        <img
          className="pCard__img"
          src={getImg(product)}
          alt={product?.name || "Producto"}
        />
      </div>

      <div className="pCard__body">
        <h3 className="pCard__name">{product?.name || "name"}</h3>

        <p className="pCard__meta">
          <span className="pCard__metaLabel">Categoría:</span>
          <span className="pCard__chips">
            {chips.map((t) => (
              <span key={t} className="pCard__chip">
                {t}
              </span>
            ))}
          </span>
        </p>

        <p className="pCard__line">
          <span className="pCard__lineLabel">empresa:</span>{" "}
          <span className="pCard__lineValue">{company}</span>
        </p>

        <p className="pCard__line">
          <span className="pCard__lineLabel">Nombre empresa</span>
        </p>

        <p className="pCard__line">
          <span className="pCard__lineLabel">Location</span>
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
          ver producto
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
