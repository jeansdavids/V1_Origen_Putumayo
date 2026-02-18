// src/pages/public/ProductDetail/index.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProducts } from "../../../services/products.service";
import { useCart } from "../../../features/cart/CartContext";
import type { Product } from "../../../features/products/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../lib/icons";
import "../../../pages/public/ProductDetail/ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data: Product[] = await getPublicProducts();
        const products = Array.isArray(data) ? data : [];

        const found = products.find((p: Product) =>
          String(p.product_id || p.productId || p.id) === id
        );

        setProduct(found || null);
 
        if (found?.variant_group) {
          const related = products
            .filter(
              (p: Product) =>
                p.variant_group === found.variant_group
            )
            .sort(
              (a: Product, b: Product) =>
                (a.weight_value || 0) - (b.weight_value || 0)
            );

          setVariants(related);
        } else {
          setVariants([]);
        }
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-container pd-center">
        <p>Cargando información del producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-container pd-center">
        <h2>Producto no encontrado</h2>
        <button
          className="pd-btn-secondary"
          onClick={() => navigate("/products")}
        >
          <FontAwesomeIcon icon={Icons.back} style={{ marginRight: "8px" }} />
          Volver a productos
        </button>
      </div>
    );
  }

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/home/placeholder.png";

  const rawPrice =
    product.price ??
    product.unit_price ??
    product.price_value ??
    product.price_cop ??
    product.precio ??
    0;

  const price = Number(rawPrice);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(
      {
        id: String(product.product_id || product.productId || product.id),
        name: product.name || "Producto",
        price: price,
        image: imageSrc,
      },
      quantity
    );

    openCart();
  };

  const currentId = String(
    product.product_id || product.productId || product.id
  );

  return (
    <main className="pd-container">
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={Icons.back} style={{ marginRight: "8px" }} />
        Volver
      </button>

      <div className="pd-grid">
        <div className="pd-image-section">
          <img
            src={imageSrc}
            alt={product.name || "Producto"}
            className="pd-main-image"
          />

          {/* VARIANTES */}
          {variants.length > 1 && (
            <div className="pd-variants">
              

              <div className="pd-variants-buttons">
                {variants.map((v) => {
                  const variantId = String(
                    v.product_id || v.productId || v.id
                  );

                  const isActive = variantId === currentId;

                  return (
                    <button
                      key={variantId}
                      className={`pd-variant-btn ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() =>
                        navigate(`/products/${variantId}`)
                      }
                    >
                      {v.weight_value}
                      {v.weight_unit}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pd-info-section">
          <h1 className="pd-title">{product.name}</h1>

          {product.company_name && (
            <p className="pd-brand">
              <FontAwesomeIcon
                icon={Icons.store}
                style={{ marginRight: "6px" }}
              />
              Productor: <span>{product.company_name}</span>
            </p>
          )}

          <span className="pd-price">{formattedPrice}</span>

          <div className="pd-description">
            <h3>
              <FontAwesomeIcon
                icon={Icons.description}
                style={{ marginRight: "6px" }}
              />
              Descripción
            </h3>
            <p>
              {product.description ||
                "Sin descripción disponible para este producto."}
            </p>
          </div>

          {product.location && (
            <div className="pd-meta">
              <FontAwesomeIcon
                icon={Icons.location}
                style={{ marginRight: "6px" }}
              />
              <strong>Ubicación:</strong> {product.location}
            </div>
          )}

          <div className="pd-actions">
            <div className="pd-qty">
              <button onClick={decreaseQty}>
                <FontAwesomeIcon icon={Icons.minus} />
              </button>

              <span>{quantity}</span>

              <button onClick={increaseQty}>
                <FontAwesomeIcon icon={Icons.plus} />
              </button>
            </div>

            <button className="pd-btn-primary" onClick={handleAddToCart}>
              <FontAwesomeIcon
                icon={Icons.cart}
                style={{ marginRight: "8px" }}
              />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
