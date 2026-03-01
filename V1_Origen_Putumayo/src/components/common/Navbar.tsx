import "../../styles/Navbar.css";
import "../../styles/navbarcel.css";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext";
import logo from "../../assets/images/logo1.png";
import { useState, useEffect, useRef } from "react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const prevCountRef = useRef<number>(totalItems);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  /* =========================================================
     Detectar aumento del carrito SIN setState
  ========================================================= */
  useEffect(() => {
    if (totalItems > prevCountRef.current && cartButtonRef.current) {
      const btn = cartButtonRef.current;

      btn.classList.remove("cart-bounce");
      void btn.offsetWidth; // 🔥 fuerza reflow para reiniciar animación
      btn.classList.add("cart-bounce");
    }

    prevCountRef.current = totalItems;
  }, [totalItems]);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* Menu */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/">Inicio</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/productos">Productos</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/historia">Historia</Link>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <a
            href="https://ecoturismoputumayo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Turismo
          </a>
        </li>
        <li className="navbar-item" onClick={() => setMenuOpen(false)}>
          <Link to="/contacto">Contacto</Link>
        </li>
      </ul>

      {/* Acciones derecha */}
      <div className="navbar-actions">
        {/* Login / User Info */}
        {user ? (
          <div className="navbar-user">
            <span className="navbar-username">
              Hola, {user.user_metadata.full_name?.split(" ")[0] || "Usuario"}
            </span>
            <button onClick={() => { console.log('Logout clicked'); signOut(); }} className="navbar-logoutBtn" aria-label="Cerrar Sesión">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-loginBtn" aria-label="Iniciar Sesión">
            <i className="bi bi-person-circle"></i>
          </Link>
        )}

        {/* Hamburguesa */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <i className="bi bi-list"></i>
        </button>

        <button
          ref={cartButtonRef}
          className="navbar-cartBtn"
          type="button"
          aria-label="Abrir carrito"
          onClick={openCart}
        >
          <i className="bi bi-cart3"></i>

          {totalItems > 0 && (
            <span className="navbar-cartBadge">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
