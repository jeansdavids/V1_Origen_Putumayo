// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* ESTILOS */
import "../../../styles/Home.css/styles.css";
import "../../../styles/Home.css/destacados.css";
import "../../../styles/Home.css/turismo.css";
import "../../../styles/Home.css/Historia.css";
import "../../../styles/Home.css/contacto.css";

/* COMPONENTES / SERVICIOS */
import ProductCard from "../../../features/products/components/ProductCard";
import { getPublicProducts } from "../../../services/products.service";

/**
 * Home
 * - Diseño completo
 * - Productos destacados dinámicos desde Supabase
 * Autor: Kaleth
 */
const Home: React.FC = () => {
  const [products, setProducts] = useState([]);

  // Carrusel destacados
  const [index, setIndex] = useState(0);

  // Deben coincidir con tu CSS (desktop)
  const CARD_W = 320; // .Destacado-card flex-basis
  const GAP = 18;     // .Destacado-rail gap

  // cantidad visible (desktop)
  const VISIBLE = 3;

  useEffect(() => {
    getPublicProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error cargando productos públicos:", err);
        setProducts([]);
      });
  }, []);

  // Supabase devuelve snake_case
  const topProducts = products.filter((p) => p && p.is_top === true);

  // Puedes subir este número si quieres más items en el carrusel
  const featuredProducts = (topProducts.length ? topProducts : products).slice(0, 10);

  // maxIndex correcto para “3 visibles”
  const maxIndex = useMemo(() => {
    return Math.max(0, featuredProducts.length - VISIBLE);
  }, [featuredProducts.length]);

  // Reajusta el índice si cambia la cantidad de productos
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const getImg = (p) => {
    if (!p || !Array.isArray(p.images) || p.images.length === 0) {
      return "/home/placeholder.png";
    }
    return p.images[0];
  };

  const offset = index * (CARD_W + GAP);

  return (
    <main className="home">
      {/* HERO */}
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

          <Link className="home-hero__btn" to="/products">
            COMPRA AQUÍ
          </Link>
        </div>
      </section>

      {/* DESTACADOS */}
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

        <div className="Destacado-carousel">
          <button
            className="Destacado-arrow Destacado-arrow--left"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="Destacado-track">
            <div
              className="Destacado-rail"
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {featuredProducts.map((product) => (
                // ✅ IMPORTANTE: envolver en .Destacado-card
                <div className="Destacado-card" key={product.product_id ?? product.id}>
                  <ProductCard
                    product={product}
                    getImg={getImg}
                    linkBase="/products"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="Destacado-arrow Destacado-arrow--right"
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index >= maxIndex}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </section>

      {/* ECOTURISMO */}
      <section className="EcoturismoPutumayo">
        <div className="EcoturismoPutumayo-container">
          <h2 className="EcoturismoPutumayo-title">
            Explora el putumayo en
            <br />
            <span>Ecoturismo putumayo</span>
          </h2>
          <p className="EcoturismoPutumayo-text">
            descubre las maravillas del putumayo, un paraiso
            <br />
            natural lleno de aventuras y biodiversidad
          </p>
          <Link className="EcoturismoPutumayo-btn" to="/ecoturismo">
            Turismo
          </Link>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="hIStoria">
        <div className="hIStoria-container">
          <h2 className="hIStoria-title">
            desde nuestras
            <br />
            <span>raices al mundo</span>
          </h2>
          <p className="hIStoria-text">
            Nacimos en la esencia de la naturaleza,
            <br />
            conectados profundamente con
            <br />
            comunidades que protegen y honran su entorno.
            <br />
            Desde el origen, creamos oportunidades que dejan
            <br />
            huella en los territorios y en las personas.
          </p>
          <Link className="hIStoria-btn" to="/historia">
            conoce nuestra historia
          </Link>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto">
        <div className="contacto-container">
          <h2 className="contacto-title">
            Estamos para
            <br />
            <span>ayudarte</span>
          </h2>
          <p className="contacto-text">
            nuestro equipo esta listo para ayudarte de forma clara,
            <br />
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
