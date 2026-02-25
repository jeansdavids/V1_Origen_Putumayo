import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import heroImage from "../../../assets/images/ImgHome/Home_Principal.webp";
import historiaImg from "../../../assets/images/Historia_home.png";


/* ESTILOS */
import "../../../styles/Home.css/styles.css";
import "../../../styles/Home.css/destacados.css";
import "../../../styles/Home.css/turismo.css";
import "../../../styles/Home.css/Historia.css";
import "../../../styles/Home.css/contacto.css";

/* COMPONENTES / SERVICIOS */
import ProductCard from "../../../features/products/components/ProductCard";
import type { Product } from "../../../features/products/components/ProductCard";
import { getPublicProducts } from "../../../services/products.service";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  /* =========================================================
     CARRUSEL STATE
  ========================================================= */
  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<number>(3);
  const [cardW, setCardW] = useState<number>(320);

  const GAP = 18;

  /* =========================================================
     RESPONSIVE
  ========================================================= */
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

  /* =========================================================
     CARGAR PRODUCTOS
  ========================================================= */
  useEffect(() => {
    getPublicProducts()
      .then((data: Product[]) =>
        setProducts(Array.isArray(data) ? data : [])
      )
      .catch((err: unknown) => {
        console.error("Error cargando productos públicos:", err);
        setProducts([]);
      });
  }, []);

  /* =========================================================
     DESTACADOS
  ========================================================= */
  const topProducts = products.filter((p) => p?.is_top === true);

  const featuredProducts = (
    topProducts.length ? topProducts : products
  ).slice(0, 10);

  const maxIndex = useMemo<number>(() => {
    return Math.max(0, featuredProducts.length - visible);
  }, [featuredProducts.length, visible]);

  // TEMPORAL: Se transforma la URL para usar el endpoint de optimización de Supabase Storage.
  // Esto es un parche mientras se refactoriza el modelo de datos para guardar solo
  // la ruta relativa en BD y construir la URL completa desde el código.
  const getImg = (p: Product): string => {
    if (!p?.images || p.images.length === 0) {
      return "/home/placeholder.png";
    }
    const url = p.images[0];
    return url.replace("/object/public/", "/render/image/public/") + "?quality=75"; // PARCHE: solo compresión, sin resize para evitar recorte. Pendiente migrar a solución definitiva (guardar ruta relativa en BD y construir URL con parámetros controlados desde el código).
  };

  const offset = index * (cardW + GAP);

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <main className="home">
      <Helmet>
        <title>Origen Putumayo</title>
        <meta name="description" content="Descubre productos amazónicos 100% naturales del Putumayo, Colombia: Sacha Inchi, Copoazú, vinos artesanales, Chontaduro y más. Directo de los productores locales." />
        <link rel="canonical" href="https://www.origenputumayo.com/" />
      </Helmet>
      {/* ================= HERO ================= */}
     <section
  className="home-hero"
  style={{ backgroundImage: `url(${heroImage})` }}
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

          <Link className="home-hero__btn" to="/productos">
        COMPRA AQUÍ
          </Link>
        </div>
      </section>

      {/* ================= DESTACADOS ================= */}
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
          {/* Flecha izquierda */}
          <button
            className="Destacado-arrow Destacado-arrow--left"
            onClick={() =>
              setIndex((i) =>
                Math.max(0, Math.min(i - 1, maxIndex))
              )
            }
            disabled={index === 0}
          >
            ‹
          </button>

          <div className="Destacado-track">
            <div
              className="Destacado-rail"
              style={{
                transform: `translateX(-${offset}px)`,
                transition: "transform 0.4s ease",
              }}
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
                    linkBase="/productos"
                    mode="home"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            className="Destacado-arrow Destacado-arrow--right"
            onClick={() =>
              setIndex((i) =>
                Math.max(0, Math.min(i + 1, maxIndex))
              )
            }
            disabled={index >= maxIndex}
          >
            ›
          </button>
        </div>
      </section>

      {/* ================= ECOTURISMO ================= */}
      <section className="EcoturismoPutumayo">
        <div className="EcoturismoPutumayo-container">
          <h2 className="EcoturismoPutumayo-title">
            Explora el Putumayo en <br />
            <span>Ecoturismo Putumayo</span>
          </h2>

          <p className="EcoturismoPutumayo-text">
            Descubre las maravillas del Putumayo, un paraíso
            <br />
            natural lleno de aventuras y biodiversidad
          </p>

          <a
            className="EcoturismoPutumayo-btn"
            href="https://www.ecoturismoputumayo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Turismo
          </a>
        </div>
      </section>

      {/* ================= HISTORIA ================= */}
      <section className="hIStoria">
        <div className="hIStoria-container">
          <h2 className="hIStoria-title">
            Desde nuestras <br />
            <span>raíces al mundo</span>
          </h2>

          <p className="hIStoria-text">
            Nacimos en la esencia de la naturaleza,
            <br />
            conectados profundamente con comunidades
            <br />
            que protegen y honran su entorno.
          </p>

          <Link className="hIStoria-btn" to="/historia">
            Conoce nuestra historia
          </Link>
        </div>

        <img
          className="hIStoria-img"
          src={historiaImg}
          alt="Historia Putumayo"
        />
      </section>

      {/* ================= CONTACTO ================= */}
      {/* ================= CONTACTO ================= */}
<section className="contacto">
  <div className="contacto-container">

    <div className="contacto-content">
      
      <h2 className="contacto-title">
        Estamos para <br />
        <span>ayudarte</span>
      </h2>

      <p className="contacto-text">
        Nuestro equipo está listo para ayudarte
        <br />
        de forma clara y oportuna
      </p>

      <Link className="contacto-btn" to="/contacto">
        Contacto
      </Link>

    </div>

  </div>
</section>

    </main>
  );
};

export default Home;
