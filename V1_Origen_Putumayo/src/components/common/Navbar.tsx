import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import navBg from "../../assets/images/navbar-bg-1920x250.png";

const Navbar = () => {
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
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        <li className="navbar-item"><Link to="/products">Productos</Link></li>
        <li className="navbar-item"><Link to="/history">Historia</Link></li>
        <li className="navbar-item"><Link to="/turismo">Turismo</Link></li>
        <li className="navbar-item"><Link to="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
