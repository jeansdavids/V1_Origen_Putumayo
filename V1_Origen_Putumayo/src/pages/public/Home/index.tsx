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

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);

  // carrusel
  const [index, setIndex] = useState(0);

  // responsive
  const [visible, setVisible] = useState(3);
  const [cardW, setCardW] = useState(320);
  

  const GAP = 18;

  // detectar tamaño de pantalla
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;

      if (w < 640) {
        setVisible(1);
        setCardW(280);
      } else if (w < 1100) {
        setVisible(2);
        setCardW(300);
      } else {
        setVisible(3);
        setCardW(320);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // cargar productos
  useEffect(() => {
    getPublicProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error cargando productos públicos:", err);
        setProducts([]);
      });
  }, []);

  // destacados
  const topProducts = products.filter((p) => p && p.is_top === true);
  const featuredProducts = (topProducts.length ? topProducts : products).slice(
    0,
    10
  );

  // índice máximo real
  const maxIndex = useMemo(() => {
    return Math.max(0, featuredProducts.length - visible);
  }, [featuredProducts.length, visible]);

  // reajustar índice si cambia cantidad
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const getImg = (p) => {
    if (!p || !Array.isArray(p.images) || p.images.length === 0) {
      return "/home/placeholder.png";
    }
    return p.images[0];
  };

  const offset = index * (cardW + GAP);

  return (
    <main className="home">
      {/* HERO */}
      <section
        className="home-hero"
        style={{ backgroundImage: "url(../../assets/images/Home_Origen_Putumayo\ .png)" }}
      >
        <div className="home-hero__overlay" />
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            DESCUBRE LAS <br />
            RIQUEZAS DE NUESTRA <br />
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
          {/* flecha izquierda */}
          <button
            className="Destacado-arrow Destacado-arrow--left"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            ‹
          </button>

          <div className="Destacado-track">
            <div
              className="Destacado-rail"
              style={{ transform: `translateX(-${offset}px)` }}
            >
              {featuredProducts.map((product) => (
                <div
                  className="Destacado-card"
                  key={product.product_id ?? product.id}
                  style={{ width: cardW }}
                >
                  <ProductCard
                    product={product}
                    getImg={getImg}
                    linkBase="/products"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* flecha derecha */}
          <button
            className="Destacado-arrow Destacado-arrow--right"
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index >= maxIndex}
          >
            ›
          </button>
        </div>
      </section>

      {/* ECOTURISMO */}
      <section className="EcoturismoPutumayo">
        <div className="EcoturismoPutumayo-container">
          <h2 className="EcoturismoPutumayo-title">
            Explora el putumayo en <br />
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
            desde nuestras <br />
            <span>raices al mundo</span>
          </h2>
          <p className="hIStoria-text">
            Nacimos en la esencia de la naturaleza,
            <br />
            conectados profundamente con comunidades
            <br />
            que protegen y honran su entorno.
          </p>
          <Link className="hIStoria-btn" to="/history">
            conoce nuestra historia
          </Link>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto">
        <div className="contacto-container">
          <h2 className="contacto-title">
            Estamos para <br />
            <span>ayudarte</span>
          </h2>
          <p className="contacto-text">
            nuestro equipo esta listo para ayudarte
            <br />
            de forma clara y oportuna
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