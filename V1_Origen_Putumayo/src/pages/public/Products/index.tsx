import React, { useEffect, useMemo, useState } from "react";

/* ESTILOS */
import "../../../styles/Products.css/styles.css";

/* COMPONENTES / SERVICIOS */
import ProductCard from "../../../features/products/components/ProductCard";
import { getPublicProducts } from "../../../services/products.service";

import type { Product as ProductCardType } from "../../../features/products/components/ProductCard";

interface Product extends ProductCardType {
  product_id: string;
  name?: string;
  category?: string;
  location?: string;
  description?: string;
  availability?: string;
  company_name?: string;
  companyName?: string;
  images?: string[];
  variant_group?: string | null;
  weight_value?: number | null;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    getPublicProducts()
      .then((data: unknown) => {
        if (!alive) return;
        setProducts(Array.isArray(data) ? (data as Product[]) : []);
      })
      .catch((e: unknown) => {
        if (!alive) return;

        console.error("Error cargando productos públicos:", e);

        const message =
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Error cargando productos.";

        setErr(message);
        setProducts([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const getImg = (p: ProductCardType): string => {
    if (!p.images || p.images.length === 0) return "/home/placeholder.png";
    return p.images[0];
  };

  const categories = useMemo<string[]>(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const c = (p.category || "").trim();
      if (c) set.add(c);
    });

    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  /*
    🔥 AGRUPACIÓN POR VARIANT_GROUP
    - Si no tiene variant_group → se muestra normal
    - Si tiene variant_group → se muestra el de menor weight_value
  */
  const groupedProducts = useMemo<Product[]>(() => {
    const map = new Map<string, Product>();

    products.forEach((product) => {
      if (!product.variant_group) {
        map.set(product.product_id, product);
        return;
      }

      const key = product.variant_group;

      if (!map.has(key)) {
        map.set(key, product);
      } else {
        const existing = map.get(key)!;

        if (
          (product.weight_value ?? 0) <
          (existing.weight_value ?? 0)
        ) {
          map.set(key, product);
        }
      }
    });

    return Array.from(map.values());
  }, [products]);

  /*
    FILTRADO SOBRE LOS AGRUPADOS
  */
  const filtered = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();

    return groupedProducts.filter((p) => {
      const cat = (p.category || "").trim();
      const matchesCategory =
        activeCategory === "Todos" ? true : cat === activeCategory;

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
  }, [groupedProducts, query, activeCategory]);

  return (
    <main className="products">
      <section className="products-hero" aria-label="Productos">
        <h1 className="products-title">ENCUENTRA LO QUE NECESITES</h1>

        <div className="products-searchWrap">
          <div className="products-search">
            <i className="bi bi-search products-searchIcon" aria-hidden="true" />
            <input
              className="products-searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca productos..."
              aria-label="Buscar productos"
            />
          </div>
        </div>

        <div className="products-mobileSticky" aria-label="Filtros rápidos">
          <div className="products-mobileMetaRow">
            <span className="products-mobileMetaLabel">Resultados</span>
            <span className="products-badge">
              {filtered.length}
            </span>
          </div>

          <div className="products-mobileCatsRail">
            {categories.map((c) => {
              const isActive = c === activeCategory;
              return (
                <button
                  key={c}
                  type="button"
                  className={`products-catChip ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {err && <div className="products-error">Error: {err}</div>}
        </div>
      </section>

      <section className="products-content">
        <aside className="products-sidebar">
          <div className="products-sidebarBox">
            <h2 className="products-sidebarTitle">CATEGORÍAS</h2>

            <div className="products-categories">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`products-categoryBtn ${
                    c === activeCategory ? "is-active" : ""
                  }`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="products-sidebarMeta">
              <div className="products-sidebarRow">
                <span>Resultados</span>
                <span className="products-badge">
                  {filtered.length}
                </span>
              </div>

              {err && <div className="products-error">Error: {err}</div>}
            </div>
          </div>
        </aside>

        <div className="products-gridWrap">
          {loading ? (
            <div className="products-empty">
              <p className="products-emptyTitle">Cargando...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <p className="products-emptyTitle">
                No encontramos resultados
              </p>
              <p className="products-emptyText">
                Prueba con otro término o cambia la categoría.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((product) => (
                <div
                  key={product.product_id}
                  className="products-cardCell"
                >
                  <ProductCard
                    product={product}
                    getImg={getImg}
                    linkBase="/products"
                  />
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
