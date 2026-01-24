import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import "./destacados.css";
import "./turismo.css";
import "./Historia.css";
import "./contacto.css";

const Home: React.FC = () => {
  return (
    <main className="home">

      <section
        className="home-hero"
        style={{ backgroundImage: "url(/home/hero.jpg)" }}
        aria-label="Sección principal"
      >
        <div className="home-hero__overlay" />

        <div className="home-hero__content">
          <h1 className="home-hero__title">
            DESCUBRE LAS
            <br />
            RIQUEZAS DE NUESTRA
            <br />
            TIERRA
          </h1>

          <p className="home-hero__subtitle">
            DESCUBRE PRODUCTOS QUE REFLEJAN LA RIQUEZA NATURAL,
            <br />
            CULTURAL Y HUMANA DE NUESTROS TERRITORIOS
          </p>

          <Link className="home-hero__btn" to="/catalog">
            COMPRA AQUÍ
          </Link>
        </div>
      </section>

      <section className="Destacado">
        <div className="Destacado-container">
          <h2 className="Destacado-title">
            PRODUCTOS <br />
            <span>DESTACADOS</span>
          </h2>

          <p className="Destacado-text">
            DESCUBRE NUESTROS NUEVOS PRODUCTOS <br />
            CREADOS DESDE EL ORIGEN
          </p>
        </div>
      </section>

      <section className="EcoturismoPutumayo">
        <div className="EcoturismoPutumayo-container">
          <h2 className="EcoturismoPutumayo-title">
            Explora el putumayo en<br />
            <span>Ecoturismo putumayo</span>
          </h2>
          <p className="EcoturismoPutumayo-text">
           descubre las maravillas del putumayo, un paraiso <br />
            natural lleno de aventuras y biodiversidad
          </p>
          <Link className="EcoturismoPutumayo-btn" to="/ecoturismo">
            Turismo
          </Link>
        </div>
        

        
      </section>

      <section className="hIStoria">
        <div className="hIStoria-container">
          <h2 className="hIStoria-title">
            desde nuestras<br />
            <span>raices al mundo </span>
          </h2>
          <p className="hIStoria-text">
            Nacimos en la esencia de la naturaleza,<br /> conectados profundamente con<br /> comunidades que protegen y honran su<br /> entorno. Desde el origen, creamos<br /> oportunidades que dejan huella en los territorios<br /> y en las personas.
          </p>
          <Link className="hIStoria-btn" to="/historia">
            conoce nuestra historia
          </Link>
        </div>

      </section>

      <section className="contacto">
        <div className="contacto-container">
          <h2 className="contacto-title">
            Estamos para <br />
            <span>ayudarte</span>
          </h2>
          <p className="contacto-text">
            nuestro equipo esta listo para ayudarte de forma clara, <br />
            cerca y oportuna cuando lo necesites
          </p>
          <Link className="contacto-btn" to="/contacto">
            contacto
          </Link>
        </div>
      </section>

      


    </main>
  );
};

export default Home;
