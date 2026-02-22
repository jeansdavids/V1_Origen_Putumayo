import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavbarLayout from "./components/common/NavbarLayout";
import FooterLayout from "./components/common/FooterLayout";
import Home from "./pages/public/Home";
import History from "./pages/public/History";
import Products from "./pages/public/Products";
import CheckoutPage from "./pages/public/checkout/CheckoutPage";
import ProductDetail from "./pages/public/ProductDetail";
import { CartProvider } from "./features/cart/CartContext";
import CartDrawer from "./features/cart/CartDrawer";
import CartSuccess from "./features/cart/CartSuccess"; // NUEVO
import Contacto from "./pages/public/Contacto";

const App: React.FC = () => {
  const location = useLocation();

  // Scroll hacia arriba cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <CartProvider>
      <NavbarLayout>
        <FooterLayout>
          {/* Componentes globales del carrito */}
          <CartDrawer />
          <CartSuccess /> {/* NUEVO */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/history" element={<History />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </FooterLayout>
      </NavbarLayout>
    </CartProvider>
  );
};

export default App;
