import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "./components/common/NavbarLayout";
import Home from "./pages/public/Home";
import History from "./pages/public/History";
import Products from "./pages/public/Products";
import CheckoutPage from "./pages/public/checkout/CheckoutPage";
import Login from "./pages/public/Login";
import Contacto from "./pages/public/Contacto";
import { CartProvider } from "./features/cart/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CartDrawer from "./features/cart/CartDrawer";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NavbarLayout>
          <CartDrawer />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/history" element={<History />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </NavbarLayout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
