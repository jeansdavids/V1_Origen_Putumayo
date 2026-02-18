import "../../styles/Navbar.css";
import "../../styles/navbarcel.css";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext";
import logo from "../../assets/images/logo.png";
import { useState } from "react";

const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

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

      {/* Acciones derecha: hamburguesa + carrito */}
      <div className="navbar-actions">
        {/* Login Button - Desktop */}
        <Link to="/login" className="navbar-loginBtn" aria-label="Iniciar Sesión">
          <i className="bi bi-person-circle"></i>
        </Link>

        {/* Hamburguesa */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Carrito */}
        <button
          className="navbar-cartBtn"
          type="button"
          aria-label="Abrir carrito"
          onClick={openCart}
        >
          <i className="bi bi-cart3"></i>

          {totalItems > 0 && (
            <span className="navbar-cartBadge">{totalItems}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
