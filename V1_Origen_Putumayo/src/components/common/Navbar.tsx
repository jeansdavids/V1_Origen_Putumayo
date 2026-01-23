import "../common/Navbar.css";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* LOGO */}
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* MENU */}
            <ul className="navbar-menu">
                <li className="navbar-item"><a href="#home">Home</a></li>
                <li className="navbar-item"><a href="#productos">Productos</a></li>
                <li className="navbar-item"><a href="#historia">Historia</a></li>
                <li className="navbar-item"><a href="#turismo">Turismo</a></li>
                <li className="navbar-item"><a href="#contacto">Contacto</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;