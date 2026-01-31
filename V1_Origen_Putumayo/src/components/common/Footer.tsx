import "../../styles/Footer.css";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>

        <ul className="footer-menu">
          <li className="footer-item">Home</li>
          <li className="footer-item">Productos</li>
          <li className="footer-item">Historia</li>
          <li className="footer-item">Turismo</li>
          <li className="footer-item">Contacto</li>
        </ul>
      </div>

      <div className="footer-copy">
        <p>© 2026 Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
