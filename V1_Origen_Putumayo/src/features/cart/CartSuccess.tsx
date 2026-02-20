import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import "../../styles/CartSuccess.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const CartSuccess: React.FC = () => {
  const {
    lastAddedItem,
    showSuccess,
    setShowSuccess,
    totalItems,
    openCart,
    pauseSuccessTimer,
    resumeSuccessTimer,
  } = useCart();

  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showSuccess || !lastAddedItem) return null;

  /* =========================
     MOBILE VERSION
  ========================= */
  if (!isDesktop) {
    return (
      <div className="cartSuccess-toast">
        <img
          src={lastAddedItem.image}
          alt={lastAddedItem.name}
          className="cartSuccess-toastImage"
        />

        <div className="cartSuccess-toastContent">
          <p className="cartSuccess-toastTitle">
            {lastAddedItem.name}
          </p>

          <span className="cartSuccess-toastSub">
            Añadido al carrito
          </span>
        </div>
      </div>
    );
  }

  /* =========================
     DESKTOP VERSION
  ========================= */

  const formattedPrice = lastAddedItem.price.toLocaleString(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }
  );

  return (
    <div
      className="cartSuccess-panel"
      onMouseEnter={pauseSuccessTimer}
      onMouseLeave={resumeSuccessTimer}
    >
      <button
        className="cartSuccess-close"
        onClick={() => setShowSuccess(false)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className="cartSuccess-header">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="cartSuccess-icon"
        />
        <span>Añadido a tu carrito</span>
      </div>

      <div className="cartSuccess-product">
        <img
          src={lastAddedItem.image}
          alt={lastAddedItem.name}
        />
        <div>
          <p className="cartSuccess-name">
            {lastAddedItem.name}
          </p>
          <p className="cartSuccess-price">
            {formattedPrice}
          </p>
        </div>
      </div>

      <button
        className="cartSuccess-secondary"
        onClick={openCart}
      >
        Ver carrito ({totalItems})
      </button>
    </div>
  );
};

export default CartSuccess;