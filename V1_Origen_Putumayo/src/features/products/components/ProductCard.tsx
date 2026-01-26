// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";

/**
 * Card de producto (uso en destacados / listados)
 * Kaleth
 */
const ProductCard = ({ product, getImg }) => {
  if (!product) return null;

  return (
    <article className="Destacado-card">
      <div className="Destacado-card__imgWrap">
        <img
          className="Destacado-card__img"
          src={getImg(product)}
          alt={product?.name || "Producto"}
        />
      </div>

      <div className="Destacado-card__body">
        <h3 className="Destacado-card__name">
          {product?.name || "Producto"}
        </h3>

        <div className="Destacado-card__info">
          <p className="Destacado-card__line">
            <span className="Destacado-card__label">categoría</span>
            <span className="Destacado-card__value">
              {product?.category || product?.categoryName || "—"}
            </span>
          </p>

          <div className="Destacado-card__chips">
            {product?.availability && (
              <span className="Destacado-chip">{product.availability}</span>
            )}
            {product?.isTop && <span className="Destacado-chip">TOP</span>}
          </div>

          <p className="Destacado-card__line">
            <span className="Destacado-card__label">Empresa</span>
            <span className="Destacado-card__value">
              {product?.companyName || product?.company_name || "—"}
            </span>
          </p>

          <Link className="Destacado-card__btn" to="/catalog">
            ver producto
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
