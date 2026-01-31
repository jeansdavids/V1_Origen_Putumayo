// src/features/cart/CartDrawer.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "../../styles/CartDrawer.css";

const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    subtotal,
  } = useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();          // cerrar drawer
    navigate("/checkout"); // ir a checkout
  };

  return (
    <>
      {/* Overlay con blur */}
      <div className="cart-overlay" onClick={closeCart} />

      {/* Drawer */}
      <aside className="cart-drawer" role="dialog" aria-label="Carrito">
        <header className="cart-header">
          <h2>Tu carrito</h2>
          <button
            className="cart-closeBtn"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </header>

        {/* Contenido */}
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-emptyIcon">🛒</span>
              <p className="cart-emptyTitle">Tu carrito está vacío</p>
              <p className="cart-emptyText">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-itemImg"
                  />
                )}

                <div className="cart-itemInfo">
                  <span className="cart-itemName">{item.name}</span>
                  <span className="cart-itemQty">
                    Cantidad: {item.quantity}
                  </span>
                </div>

                <div className="cart-itemActions">
                  <span className="cart-itemPrice">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>

                  <button
                    className="cart-removeBtn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <strong>
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }).format(subtotal)}
              </strong>
            </div>

            {/* 👇 BOTÓN CLAVE */}
            <button
              className="cart-checkoutBtn"
              onClick={handleCheckout}
            >
              Finalizar compra
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
