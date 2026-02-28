import { Outlet, ScrollRestoration } from "react-router-dom";
import { CartProvider } from "../../features/cart/CartContext";
import NavbarLayout from "../../components/common/NavbarLayout";
import FooterLayout from "../../components/common/FooterLayout";
import CartDrawer from "../../features/cart/CartDrawer";
import CartSuccess from "../../features/cart/CartSuccess";

export default function RootLayout() {
  return (
    <CartProvider>
      <NavbarLayout>
        <FooterLayout>
          <CartDrawer />
          <CartSuccess />
          <ScrollRestoration />
          <Outlet />
        </FooterLayout>
      </NavbarLayout>
    </CartProvider>
  );
}
