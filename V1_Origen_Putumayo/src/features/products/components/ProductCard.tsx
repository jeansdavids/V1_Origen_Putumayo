// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import "../../../styles/Products.css/ProductCard.css";
import AddToCartDrawer from "../../cart/AddToCartDrawer";

/**
 * ProductCard
 *
 * Objetivo UX:
 * - Mobile-first
 * - Mostrar solo lo esencial
 * - Click en card: navega al detalle
 * - Click en carrito: abre selector de cantidad
 * - Toast al confirmar agregado
 * - Bootstrap Icons
 */
const ProductCard = ({ product, getImg, linkBase = "/products" }) => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();


  const [openQty, setOpenQty] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const handleOpenQty = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setOpenQty(true);
  };

  const handleConfirmAdd = (qty) => {
    addToCart(
      {
        id: String(id),
        name: product?.name || "Producto",
        price: numericPrice,
        image: getImg(product),
      },
      qty
    );

    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <>
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

          {/* Footer */}
          <div className="pCard__footer">
            <div className="pCard__price">{priceLabel}</div>

            <button
              className="pCard__cartBtn"
              type="button"
              onClick={handleOpenQty}
              disabled={isOutOfStock}
              aria-disabled={isOutOfStock}
              aria-label="Agregar al carrito"
            >
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </article>

      {/* Drawer de cantidad */}
      {openQty && (
        <AddToCartDrawer
          product={{
            id: String(id),
            name: product?.name || "Producto",
            price: numericPrice,
            image: getImg(product),
          }}
          onConfirm={handleConfirmAdd}
          onClose={() => setOpenQty(false)}
        />
      )}

      {/* Toast */}
      {showToast && (
  <div className="cartToast">
    <span className="cartToast__msg">
      ¡Añadido!
    </span>

    <button
      className="cartToast__action"
      onClick={() => {
        setShowToast(false);
        openCart();   // AQUÍ SE ABRE EL CARRITO
      }}
    >
      Ir al carrito →
    </button>
  </div>
)}

  
    </>
  );
};

export default ProductCard;
