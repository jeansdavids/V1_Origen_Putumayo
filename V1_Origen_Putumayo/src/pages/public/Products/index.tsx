// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";

/* ESTILOS */
import "../../../styles/Products.css/styles.css";


/* COMPONENTES / SERVICIOS */
import ProductCard from "../../../features/products/components/ProductCard";
import { getPublicProducts } from "../../../services/products.service";

const Products: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);

    getPublicProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error("Error cargando productos públicos:", e);
        setErr(e?.message || "Error cargando productos.");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getImg = (p) => {
    if (!p || !Array.isArray(p.images) || p.images.length === 0) {
      return "/home/placeholder.png";
    }
    return p.images[0];
  };

  const categories = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      const c = (p?.category || "").trim();
      if (c) set.add(c);
    });
    return ["Todos", ...Array.from(set).sort((a: any, b: any) => String(a).localeCompare(String(b)))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();

    return (products || []).filter((p) => {
      if (!p) return false;

      const cat = (p.category || "").trim();
      const matchesCategory = activeCategory === "Todos" ? true : cat === activeCategory;

      if (!q) return matchesCategory;

      const haystack = [
        p.name || "",
        p.category || "",
        p.location || "",
        p.description || "",
        p.availability || "",
        p.company_name || "",
        p.companyName || "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(q);
    });
  }, [products, query, activeCategory]);

  return (
    <main className="products">
      {/* Header simple */}
      <section className="products-hero" aria-label="Productos">
        <h1 className="products-title">ENCUENTRA LO QUE NECESITAS</h1>

        <div className="products-searchWrap">
          <div className="products-search">
            <input
              className="products-searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Buscar productos"
            />
            <span className="products-searchIcon" aria-hidden="true">
              
            </span>
          </div>
        </div>
      </section>

      <section className="products-content">
        {/* Sidebar */}
        <aside className="products-sidebar" aria-label="Categorías">
          <div className="products-sidebarBox">
            <h2 className="products-sidebarTitle">CATEGORÍAS</h2>

            <div className="products-categories">
              {categories.map((c: any) => (
                <button
                  key={c}
                  className={`products-categoryBtn ${c === activeCategory ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="products-sidebarMeta">
              <div className="products-sidebarRow">
                <span>Resultados</span>
                <span className="products-badge">{filtered.length}</span>
              </div>

              {err && <div className="products-error">⚠ {err}</div>}

              <button
                className="products-clearBtn"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("Todos");
                }}
                disabled={query.trim() === "" && activeCategory === "Todos"}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="products-gridWrap">
          {loading ? (
            <div className="products-empty">
              <p className="products-emptyTitle">Cargando...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <p className="products-emptyTitle">No encontramos resultados</p>
              <p className="products-emptyText">Probá con otro término o cambiá la categoría.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((product: any) => (
                <div key={product.product_id} className="products-cardCell">
                  <ProductCard product={product} getImg={getImg} linkBase="/products" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Products;
