import React, { useState } from "react";
import "../../styles/AddToCartDrawer.css";

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

  const handleConfirm = () => {
    onConfirm(qty);
    onClose();
  };

  return (
    <div className="cartDrawer-overlay" onClick={onClose}>
      <div
        className="cartDrawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cartDrawer__header">
          <h3>Agregar al carrito</h3>
          <button
            className="cartDrawer__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="cartDrawer__product">
          <img src={product.image} alt={product.name} />
          <p className="cartDrawer__name">{product.name}</p>
        </div>

        <div className="cartDrawer__qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty(q => q + 1)}>+</button>
        </div>

        <button
          className="cartDrawer__confirm"
          onClick={handleConfirm}
        >
          Agregar {qty} al carrito
        </button>
      </div>
    </div>
  );
};

export default AddToCartDrawer;
