// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import "../../../styles/Products.css/ProductCard.css";

/**
 * ProductCard
 *
 * Objetivo UX:
 * - Mobile-first
 * - Mostrar solo lo esencial: imagen, nombre, precio, carrito
 * - Click en card: navega al detalle
 * - Click en carrito: agrega al carrito sin navegar
 * - Iconos exclusivamente de Bootstrap Icons
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
     DISPONIBILIDAD
  ========================= */
  const availabilityRaw = String(product?.availability || "").toLowerCase();
  const isOutOfStock = availabilityRaw === "out_of_stock";

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
        <h3 className="pCard__name">
          {product?.name || "Producto"}
        </h3>

        {/* Footer: precio + carrito */}
        <div className="pCard__footer">
          <div className="pCard__price">{priceLabel}</div>

          <button
            className="pCard__cartBtn"
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
            aria-label="Agregar al carrito"
          >
            <i class="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
