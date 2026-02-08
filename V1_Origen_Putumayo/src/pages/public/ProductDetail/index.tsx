
// src/pages/public/ProductDetail/index.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProducts } from "../../../services/products.service";
import { useCart } from "../../../features/cart/CartContext";
import type { Product } from "../../../features/products/components/ProductCard";
import "../../../pages/public/ProductDetail/ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nota: En una app real, lo ideal sería tener un servicio getProductById(id)
    // Aquí reutilizamos getPublicProducts y filtramos por el ID recibido en la URL.
    getPublicProducts()
      .then((data: any) => {
        const products = Array.isArray(data) ? data : [];
        // Buscamos el producto que coincida con el ID de la URL
        const found = products.find((p: any) =>
          String(p.product_id || p.productId || p.id) === id
        );
        setProduct(found || null);
      })
      .catch((err) => console.error("Error cargando producto:", err))
      .finally(() => setLoading(false));
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
        <button className="pd-btn-secondary" onClick={() => navigate("/products")}>
          Volver a productos
        </button>
      </div>
    );
  }

  // Normalización de datos (similar a como lo haces en ProductCard)
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : "/home/placeholder.png";
  const rawPrice = product.price ?? product.unit_price ?? product.price_value ?? product.price_cop ?? product.precio ?? 0;
  const price = Number(rawPrice);
  const formattedPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    addToCart({
      id: String(product.product_id || product.productId || product.id),
      name: product.name || "Producto",
      price: price,
      image: imageSrc
    }, 1);
    openCart(); // Abrir carrito para confirmar visualmente
  };

  return (
    <main className="pd-container">
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        &larr; Volver
      </button>

      <div className="pd-grid">
        {/* Columna Izquierda: Imagen */}
        <div className="pd-image-section">
          <img src={imageSrc} alt={product.name || "Producto"} className="pd-main-image" />
        </div>

        {/* Columna Derecha: Información */}
        <div className="pd-info-section">
          <h1 className="pd-title">{product.name}</h1>
          
          {product.company_name && (
            <p className="pd-brand">Productor: <span>{product.company_name}</span></p>
          )}

          <div className="pd-price-row">
            <span className="pd-price">{formattedPrice}</span>
          </div>

          <div className="pd-description">
            <h3>Descripción</h3>
            <p>{product.description || "Sin descripción disponible para este producto."}</p>
          </div>

          {product.location && (
             <div className="pd-meta">
                <strong>Ubicación:</strong> {product.location}
             </div>
          )}

          <div className="pd-actions">
            <button className="pd-btn-primary" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
