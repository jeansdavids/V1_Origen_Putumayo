import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import "../../styles/navbarcel.css"


const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Hamburguesa */}
      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Menu */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/products">Productos</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/history">Historia</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/turismo">Turismo</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/contacto">Contacto</Link>
        </li>
      </ul>

      {/* Carrito */}
      <button
        className="navbar-cartBtn"
        type="button"
        aria-label="Abrir carrito"
        onClick={openCart}
      >
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

        {totalItems > 0 && (
          <span className="navbar-cartBadge">{totalItems}</span>
        )}
      </button>
    </nav>
  );
};
export default Navbar;
