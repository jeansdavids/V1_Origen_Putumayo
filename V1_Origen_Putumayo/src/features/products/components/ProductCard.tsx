import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../features/cart/CartContext";
import { generateSlug } from "../../../utils/format";
import "../../../styles/Products.css/ProductCard.css";
import AddToCartDrawer from "../../cart/AddToCartDrawer";

/* =========================================================
   INTERFAZ PRODUCTO
========================================================= */
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
  is_top?: boolean;
  company_name?: string;
  description?: string;
  location?: string;
  variant_group?: string | null;
  weight_value?: number | null;
  weight_unit?: string | null;
}

/* =========================================================
   PROPS
========================================================= */
interface ProductCardProps {
  product: Product;
  getImg: (product: Product) => string;
  linkBase?: string;
  mode?: "catalog" | "home";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  getImg,
  linkBase = "/products",
  mode = "catalog",
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [openQty, setOpenQty] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  if (!product) return null;

  /* =========================================================
     IDENTIFICADOR
  ========================================================= */
  const id =
    product.product_id ??
    product.productId ??
    product.id ??
    "";

  /* =========================================================
     PRECIO NORMALIZADO
  ========================================================= */
  const rawPrice =
    product.price ??
    product.unit_price ??
    product.price_value ??
    product.price_cop ??
    product.precio ??
    null;

  const numericPrice =
    rawPrice === null || rawPrice === undefined || rawPrice === ""
      ? 0
      : Number(rawPrice);

  const currency = product.currency ?? "COP";

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
  ========================================================= */
  const availabilityRaw = String(product.availability ?? "").toLowerCase();
  const isOutOfStock = availabilityRaw === "out_of_stock";

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleNavigate = () => {
    if (id) {
      const slug = generateSlug(product.name ?? "producto", id);
      navigate(`${linkBase}/${slug}`);
    }
  };

  const handleOpenQty = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // HOME → agregar directo + animación check
    if (mode === "home") {
      addToCart(
        {
          id: String(id),
          name: product.name ?? "Producto",
          price: numericPrice,
          image: getImg(product),
        },
        1
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);

      return;
    }

    // CATÁLOGO → abrir drawer
    setOpenQty(true);
  };

  const handleConfirmAdd = (qty: number) => {
    addToCart(
      {
        id: String(id),
        name: product.name ?? "Producto",
        price: numericPrice,
        image: getImg(product),
      },
      qty
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <>
      <article
        className="pCard"
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
      >
        <div className="pCard__imgWrap">
          <img
            className="pCard__img"
            src={getImg(product)}
            alt={product.name ?? "Producto"}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="pCard__body">
          <h3 className="pCard__name">
            {product.name ?? "Producto"}
          </h3>

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
              <i
                className={`bi ${
                  added ? "bi-check-lg" : "bi-cart-plus"
                }`}
              ></i>
            </button>
          </div>
        </div>
      </article>

      {openQty && mode === "catalog" && (
        <AddToCartDrawer
          product={{
            id: String(id),
            name: product.name ?? "Producto",
            price: numericPrice,
            image: getImg(product),
          }}
          onConfirm={handleConfirmAdd}
          onClose={() => setOpenQty(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
