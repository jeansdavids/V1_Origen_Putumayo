import "../../styles/Footer.css";
import logo from "../../assets/images/logo1.png";
import.meta.env.VITE_WHATSAPP_URL

const Footer = () => {
  return (
    <footer className="footer">
      {/* ===== CONTENIDO SUPERIOR ===== */}
      <div className="footer-content">
        {/* IZQUIERDA */}
        <div className="footer-left">
          <img src={logo} alt="Origen Putumayo" className="footer-logo" />

          <p className="footer-description">
            Comprometidos con nuestras raíces, impulsando iniciativas que generan
            desarrollo y bienestar.
          </p>

          <div className="footer-icons">
                      <a
            href={import.meta.env.VITE_APP_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-whatsapp"></i>
          </a>
            <a
              href="https://www.instagram.com/origenputumayo/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a href="mailto:contacto@origenputumayo.com">
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </div>

        {/* DERECHA */}
        <ul className="footer-menu">
          <li className="footer-item">Historia</li>
          <li className="footer-item">Contacto</li>
        </ul>
      </div>

      {/* ===== LINEA ===== */}
      <hr className="footer-divider" />

      {/* ===== COPY ===== */}
      <div className="footer-copy">
        © 2026 Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
