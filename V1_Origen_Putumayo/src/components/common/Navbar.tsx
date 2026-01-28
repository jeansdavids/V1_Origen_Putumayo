import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext";
import logo from "../../assets/images/logo.png";
import navBg from "../../assets/images/navbar-bg-1920x250.png";

const Navbar = () => {
  const { totalItems, openCart } = useCart();

  return (
    <nav
      className="navbar"
      style={{
        backgroundImage: `url(${navBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Menu */}
      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        <li className="navbar-item"><Link to="/products">Productos</Link></li>
        <li className="navbar-item"><Link to="/history">Historia</Link></li>
        <li className="navbar-item"><Link to="/turismo">Turismo</Link></li>
        <li className="navbar-item"><Link to="/contacto">Contacto</Link></li>
      </ul>

      {/* Botón carrito */}
      <button
        className="navbar-cartBtn"
        type="button"
        aria-label="Abrir carrito"
        onClick={openCart}
      >
        {/* Icono carrito (SVG profesional) */}
        <svg
          className="navbar-cartIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>

        {/* Badge */}
        {totalItems > 0 && (
          <span className="navbar-cartBadge">
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
