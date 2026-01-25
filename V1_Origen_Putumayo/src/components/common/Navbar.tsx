import "../../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="navbar-menu">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        <li className="navbar-item"><Link to="/productos">Productos</Link></li>
        <li className="navbar-item"><Link to="/historia">Historia</Link></li>
        <li className="navbar-item"><Link to="/turismo">Turismo</Link></li>
        <li className="navbar-item"><Link to="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  );
};


export default Navbar;
