import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hook de contexto del carrito
import { useCart } from "../../../features/cart/CartContext";

// Estilos de la tarjeta
import "../../../styles/Products.css/ProductCard.css";

// Drawer para seleccionar cantidad
import AddToCartDrawer from "../../cart/AddToCartDrawer";

// Definimos la interfaz del producto exportada para reutilizarla si es necesario
export interface Product {
  product_id?: string;
  productId?: string;
  id?: string;
  name?: string;
  price?: number | string;
  unit_price?: number | string;
  price_value?: number | string;
  price_cop?: number | string;
  precio?: number | string;
  currency?: string;
  availability?: string;
  images?: string[];
  [key: string]: any; // Permite propiedades adicionales dinámicas
}

interface ProductCardProps {
  product: Product;
  getImg: (product: Product) => string;
  linkBase?: string;
}

/**
 * ProductCard
 *
 * Objetivo UX:
 * - Mobile-first
 * - Mostrar solo lo esencial
 * - Click en card: navega al detalle
 * - Click en carrito: abre selector de cantidad
 * - Toast al confirmar agregado
 * - Usa Bootstrap Icons
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, getImg, linkBase = "/products" }) => {
  /* =========================================================
     HOOKS
  ========================================================= */

  // Navegación a la vista de detalle
  const navigate = useNavigate();

  // Funciones del carrito desde el contexto global
  const { addToCart, openCart } = useCart();

  // Estado para abrir/cerrar el drawer de cantidad
  const [openQty, setOpenQty] = useState(false);

  // Estado para mostrar/ocultar el toast de confirmación
  const [showToast, setShowToast] = useState(false);

  // Si no hay producto, no se renderiza nada
  if (!product) return null;

  /* =========================================================
     IDENTIFICADOR DEL PRODUCTO
     - Se soportan distintas posibles claves
  ========================================================= */
  const id =
    product?.product_id ??
    product?.productId ??
    product?.id;

  /* =========================================================
     PRECIO
     - Se normaliza el precio venga como venga del backend
  ========================================================= */
  const rawPrice =
    product?.price ??
    product?.unit_price ??
    product?.price_value ??
    product?.price_cop ??
    product?.precio ??
    null;

  // Conversión segura a número
  const numericPrice =
    rawPrice === null || rawPrice === undefined || rawPrice === ""
      ? 0
      : Number(rawPrice);

  // Moneda (por defecto COP)
  const currency = product?.currency ?? "COP";

  // Formateo del precio para mostrar
  const priceLabel =
    numericPrice === 0
      ? "Consultar"
      : new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(numericPrice);

  /* =========================================================
     DISPONIBILIDAD
     - Determina si el producto está agotado
  ========================================================= */
  const availabilityRaw = String(product?.availability || "").toLowerCase();
  const isOutOfStock = availabilityRaw === "out_of_stock";

  /* =========================================================
     HANDLERS
  ========================================================= */

  // Navega al detalle del producto al hacer click en la card
  const handleNavigate = () => {
    if (id) navigate(`${linkBase}/${id}`);
  };

  // Abre el selector de cantidad
  // Se detiene la propagación para no disparar la navegación
  const handleOpenQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setOpenQty(true);
  };

  // Confirma el agregado al carrito
  const handleConfirmAdd = (qty: number) => {
    addToCart(
      {
        id: String(id),
        name: product?.name || "Producto",
        price: numericPrice,
        image: getImg(product),
      },
      qty
    );

    // Muestra el toast de confirmación
    setShowToast(true);

    // Oculta el toast automáticamente después de 5s
    setTimeout(() => setShowToast(false), 5000);
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <>
      {/* ========================
          TARJETA PRINCIPAL
      ======================== */}
      <article
        className="pCard"
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
      >
        {/* Imagen del producto */}
        <div className="pCard__imgWrap">
          <img
            className="pCard__img"
            src={getImg(product)}
            alt={product?.name || "Producto"}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Contenido de la tarjeta */}
        <div className="pCard__body">
          {/* Nombre del producto */}
          <h3 className="pCard__name">
            {product?.name || "Producto"}
          </h3>

          {/* Footer: precio + botón carrito */}
          <div className="pCard__footer">
            <div className="pCard__price">
              {priceLabel}
            </div>

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

      {/* ========================
          DRAWER DE CANTIDAD
      ======================== */}
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

      {/* ========================
          TOAST DE CONFIRMACIÓN
      ======================== */}
      {showToast && (
        <div className="cartToast">
          <span className="cartToast__msg">
            ¡Añadido!
          </span>

          <button
            className="cartToast__action"
            onClick={() => {
              setShowToast(false);
              openCart(); // Abre el carrito global
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
