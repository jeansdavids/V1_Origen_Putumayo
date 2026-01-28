import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/common/NavbarLayout";
import Home from "./pages/public/Home";
import History from "./pages/public/History";
import Products from "./pages/public/Products";
import { CartProvider } from "./features/cart/CartContext";
import CartDrawer from "./features/cart/CartDrawer";

const App: React.FC = () => {
  return (
    <CartProvider>
    <NavbarLayout>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </NavbarLayout>
    </CartProvider>
  );
};

export default App;
