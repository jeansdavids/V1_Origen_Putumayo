import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

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
    </main>
  );
};

export default Home;
