import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import "../../../styles/Products.css/ProductCard.css";

interface ProductCardProps {
  product: any;
  getImg: (product: any) => string;
  linkBase?: string;
}

/**
 * ProductCard
 * - Click en la card → ver producto
 * - Botón carrito → agregar al carrito
 * - Mobile-first, compacto
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  getImg,
  linkBase = "/products",
}) => {
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

  const category = product?.category || product?.categoryName || null;

  const availabilityRaw = product?.availability || "";
  const availabilityLabel = (() => {
    const v = String(availabilityRaw).toLowerCase();
    if (v === "available") return "Disponible";
    if (v === "out_of_stock") return "Sin stock";
    if (v === "on_demand") return "Bajo pedido";
    return null;
  })();

  // Chips visibles (máx 2)
  const chips = [category, availabilityLabel].filter(Boolean).slice(0, 2);

  const handleNavigate = () => {
    if (id) navigate(`${linkBase}/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // ⛔ evita navegar al detalle

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
      aria-label={`Ver producto ${product?.name || ""}`}
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

        {/* Precio + CTA compacto */}
        <div className="pCard__footer">
          <span className="pCard__price">{priceLabel}</span>

          <button
            className="pCard__cartBtn"
            type="button"
            onClick={handleAddToCart}
            aria-label="Agregar al carrito"
          >
            🛒
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
