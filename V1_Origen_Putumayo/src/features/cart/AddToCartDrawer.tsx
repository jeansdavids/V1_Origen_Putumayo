import React, { useState } from "react";
import "../../styles/AddToCartDrawer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faMinus,
  faPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

interface DrawerProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Props {
  product: DrawerProduct;
  onConfirm: (qty: number) => void;
  onClose: () => void;
}

const AddToCartDrawer: React.FC<Props> = ({
  product,
  onConfirm,
  onClose,
}) => {
  const [qty, setQty] = useState<number>(1);

  const increaseQty = () => setQty((q) => q + 1);
  const decreaseQty = () => setQty((q) => Math.max(1, q - 1));

  const handleConfirm = () => {
    onConfirm(qty);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const formattedPrice = product.price.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  return (
    <div className="cartDrawer-overlay" onClick={onClose}>
      <div
        className="cartDrawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="cartDrawer__header">
          <h3 className="cartDrawer__title">Agregar al carrito</h3>
          <button
            className="cartDrawer__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* PRODUCT INFO */}
        <div className="cartDrawer__product">
          <img
            src={product.image}
            alt={product.name}
            className="cartDrawer__image"
          />
          <div className="cartDrawer__info">
            <p className="cartDrawer__name">{product.name}</p>
            <p className="cartDrawer__price">{formattedPrice}</p>
          </div>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="cartDrawer__qty">
          <button
            className="cartDrawer__qtyBtn"
            onClick={decreaseQty}
            aria-label="Disminuir cantidad"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>

          <span className="cartDrawer__qtyValue">{qty}</span>

          <button
            className="cartDrawer__qtyBtn"
            onClick={increaseQty}
            aria-label="Aumentar cantidad"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          className="cartDrawer__confirm"
          onClick={handleConfirm}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          <span>Agregar {qty} al carrito</span>
        </button>
      </div>
    </div>
  );
};

export default AddToCartDrawer;
