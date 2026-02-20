// src/features/cart/CartDrawer.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../lib/icons";
import "../../styles/CartDrawer.css";

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal } =
    useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />

      <aside className="cart-drawer" role="dialog" aria-label="Carrito">
        <header className="cart-header">
          <h2>Tu carrito</h2>
          <button
            className="cart-closeBtn"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            type="button"
          >
            <FontAwesomeIcon icon={Icons.close} />
          </button>
        </header>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-emptyIcon">
                <FontAwesomeIcon icon={Icons.cart} />
              </span>
              <p className="cart-emptyTitle">Tu carrito está vacío</p>
              <p className="cart-emptyText">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                
                <div
                  className="cart-itemClickable"
                  onClick={() => {
                    closeCart();
                    navigate(`/products/${item.id}`);
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-itemImg"
                    />
                  )}

                  <div className="cart-itemInfo">
                    <span className="cart-itemName">{item.name}</span>

                    <span className="cart-itemUnitPrice">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(item.price)}{" "}
                      c/u
                    </span>
                  </div>
                </div>

                <div className="cart-itemActions">
                  <div className="cart-itemQtyControls">
                    <button
                      className="cart-qtyBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, -1);
                      }}
                      aria-label="Disminuir cantidad"
                      disabled={item.quantity === 1}
                      type="button"
                    >
                      <FontAwesomeIcon icon={Icons.minus} />
                    </button>

                    <span className="cart-itemQtyValue">
                      {item.quantity}
                    </span>

                    <button
                      className="cart-qtyBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(item.id, 1);
                      }}
                      aria-label="Aumentar cantidad"
                      type="button"
                    >
                      <FontAwesomeIcon icon={Icons.plus} />
                    </button>
                  </div>

                  <span className="cart-itemPrice">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>

                  <button
                    className="cart-removeBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    aria-label="Eliminar producto"
                    type="button"
                  >
                    <FontAwesomeIcon icon={Icons.trash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

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

            <button
              className="cart-checkoutBtn"
              onClick={handleCheckout}
              type="button"
              disabled={items.length === 0}
            >
              <FontAwesomeIcon
                icon={Icons.cart}
                style={{ marginRight: "8px" }}
              />
              Finalizar compra
            </button>
          </footer>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
