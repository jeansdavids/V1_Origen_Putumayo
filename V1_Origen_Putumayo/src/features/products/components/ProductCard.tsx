// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import "../../../styles/Products.css/ProductCard.css";

/**
 * ProductCard
 *
 * Objetivo UX:
 * - Mostrar solo información esencial para decisión rápida
 * - Jerarquía clara: imagen → nombre → chips → precio → CTA
 *
 * Comportamiento:
 * - Click en la card: navega al detalle
 * - Click en CTA: agrega al carrito sin navegar
 */
const ProductCard = ({ product, getImg, linkBase = "/products" }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!product) return null;

  /* =========================
     IDENTIFICADOR
  ========================= */
  const id = product?.product_id ?? product?.productId ?? product?.id;

  /* =========================
     PRECIO
  ========================= */
  const rawPrice =
    product?.price ??
    product?.unit_price ??
    product?.price_value ??
    product?.price_cop ??
    product?.precio ??
    null;

  const numericPrice =
    rawPrice === null || rawPrice === undefined || rawPrice === ""
      ? 0
      : Number(rawPrice);

  const currency = product?.currency ?? "COP";

  const priceLabel =
    numericPrice === 0
      ? "Consultar"
      : new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(numericPrice);

  /* =========================
     CATEGORÍA / DISPONIBILIDAD
  ========================= */
  const category = product?.category || product?.categoryName || null;

  const availabilityRaw = String(product?.availability || "").toLowerCase();
  const availabilityLabel =
    availabilityRaw === "available"
      ? "Disponible"
      : availabilityRaw === "out_of_stock"
      ? "Sin stock"
      : availabilityRaw === "on_demand"
      ? "Bajo pedido"
      : null;

  const isOutOfStock = availabilityLabel === "Sin stock";

  /* =========================
     CHIPS (máx. 2)
  ========================= */
  const chips = [category, availabilityLabel].filter(Boolean).slice(0, 2);

  /* =========================
     HANDLERS
  ========================= */
  const handleNavigate = () => {
    if (id) navigate(`${linkBase}/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart({
      id: String(id),
      name: product?.name || "Producto",
      price: numericPrice,
      image: getImg(product),
    });
  };

  return (
    <article
      className="pCard"
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
    >
      {/* Imagen */}
      <div className="pCard__imgWrap">
        <img
          className="pCard__img"
          src={getImg(product)}
          alt={product?.name || "Producto"}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido */}
      <div className="pCard__body">
        {/* Nombre */}
        <h3 className="pCard__name">{product?.name || "Producto"}</h3>

        {/* Chips */}
        {chips.length > 0 && (
          <div className="pCard__chips">
            {chips.map((chip) => (
              <span key={chip} className="pCard__chip">
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Footer: precio + CTA (único precio del card) */}
        <div className="pCard__footer">
          <div className="pCard__price">{priceLabel}</div>

          <button
            className="pCard__cartBtn"
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
