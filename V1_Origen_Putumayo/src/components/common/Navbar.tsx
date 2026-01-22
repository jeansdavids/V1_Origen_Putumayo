import "../styles/Navbar.css";




const Navbar = () => {
    return (
        <nav className="navbar">
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