// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import "../../../styles/Products.css/ProductCard.css";

/**
 * ProductCard
 * - Click en la card → ver producto
 * - Botón principal → agregar al carrito
 * - Usa CartContext
 * - Defensivo con datos de Supabase
 */
const ProductCard = ({ product, getImg, linkBase = "/products" }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

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

  const numericPrice =
    price === null || price === undefined || price === ""
      ? 0
      : Number(price);

  const currency = product?.currency ?? "COP";

  const priceLabel =
    numericPrice === 0
      ? "—"
      : new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(numericPrice);

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

  // Chips
  const chips =
    Array.isArray(product?.tags) && product.tags.length
      ? product.tags.slice(0, 2)
      : [category, availabilityLabel].filter(Boolean).slice(0, 2);

  const handleNavigate = () => {
    if (id) navigate(`${linkBase}/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // ⛔ evita navegar al detalle

    addToCart({
      id: String(id),
      name: product?.name || "Producto",
      price: numericPrice,
      image: getImg(product),
    });
  };

  return (
    <article className="pCard" onClick={handleNavigate} role="button">
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

        {/* CTA principal */}
        <button
          className="pCard__btn"
          type="button"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
