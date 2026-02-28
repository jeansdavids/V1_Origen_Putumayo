import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./app/layouts/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      {
        path: "/",
        lazy: () =>
          import("./pages/public/Home").then((m) => ({ Component: m.default })),
      },
      {
        path: "/contacto",
        lazy: () =>
          import("./pages/public/Contacto").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/historia",
        lazy: () =>
          import("./pages/public/History").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/productos",
        lazy: () =>
          import("./pages/public/Products").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/productos/:slug",
        lazy: () =>
          import("./pages/public/ProductDetail").then((m) => ({
            Component: m.default,
          })),
      },
      {
        path: "/checkout",
        lazy: () =>
          import("./pages/public/checkout/CheckoutPage").then((m) => ({
            Component: m.default,
          })),
      },
    ],
  },
]);
