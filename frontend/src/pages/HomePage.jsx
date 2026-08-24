import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import ProductCard from "../components/ProductCard";
import { ALL_CATEGORIES } from "../utils/category";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Category Icons Mapping
  const categoryIcons = {
    Mixtures: "🥣",
    Murukku: "🌀",
    Chips: "🍌",
    Peanuts: "🥜",
    Sweets: "🍡",
    Halwa: "🍮",
  };

  // Best Sellers (first 4 items in seeded database)
  const bestSellers = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Popular Snacks (e.g., items priced under ₹80, or just sorted by price)
  const popularSnacks = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 4);
  }, [products]);

  function handleCategorySelect(catName) {
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  }

  return (
    <>
      {/* Video Hero Section */}
      <section className="hero-wrapper">
        <video
          className="hero-video"
          src="/videos/hero-snacks.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="hero-gradient-overlay"></div>
        <div className="container hero-content-inner">
          <div className="hero-text-block">
            <p className="hero-tagline">⚡ Traditional & Fresh</p>
            <h1 className="hero-title">
              Fresh snacks. <br />
              Delivered nearby.
            </h1>
            <p className="hero-desc">
              Traditional taste from our local shop, delivered directly to your door with a shop-confirmed ETA.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="button primary">
                Shop Snacks
              </Link>
              <Link to="/track" className="button secondary" style={{ color: "var(--brand-dark)" }}>
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Cards Strip */}
      <section className="promo-strip">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-item">
              <span className="promo-icon">🛵</span>
              <div className="promo-info">
                <h4>Free Delivery</h4>
                <p>On orders within 3 km</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon">🌟</span>
              <div className="promo-info">
                <h4>Fresh Stock</h4>
                <p>Prepared every day</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon">⏱️</span>
              <div className="promo-info">
                <h4>Verified ETA</h4>
                <p>Quick confirmation by shop</p>
              </div>
            </div>
            <div className="promo-item">
              <span className="promo-icon">💳</span>
              <div className="promo-info">
                <h4>Secure Payments</h4>
                <p>Fast wallet ordering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="category-strip">
        <div className="container">
          <div className="section-heading" style={{ textAlign: "center" }}>
            <h2>Shop by Category</h2>
            <p>Select a category to discover your favorite traditional snacks</p>
          </div>

          <div className="category-strip-grid">
            {ALL_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="category-card"
                onClick={() => handleCategorySelect(cat)}
              >
                <span className="category-card-icon">{categoryIcons[cat] || "😋"}</span>
                <span className="category-card-name">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container">
          <div className="section-heading">
            <h2>Best Sellers</h2>
            <p>Our most popular and highly rated snacks</p>
          </div>

          {loading && (
            <div className="product-grid-row">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-image skeleton-shimmer" />
                  <div className="skeleton-content">
                    <div className="skeleton-bar skeleton-shimmer" style={{ width: "40%" }} />
                    <div className="skeleton-bar skeleton-shimmer" style={{ width: "80%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert error">{error}</div>}

          {!loading && (
            <div className="product-grid-row">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Snacks Section */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Popular Snacks</h2>
            <p>Sweet & savory favorites under affordable pricing</p>
          </div>

          {loading && (
            <div className="product-grid-row">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-image skeleton-shimmer" />
                  <div className="skeleton-content">
                    <div className="skeleton-bar skeleton-shimmer" style={{ width: "40%" }} />
                    <div className="skeleton-bar skeleton-shimmer" style={{ width: "80%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert error">{error}</div>}

          {!loading && (
            <div className="product-grid-row">
              {popularSnacks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="section" style={{ backgroundColor: "var(--brand-dark)", color: "#ffffff", textAlign: "center", padding: "64px 0" }}>
        <div className="container" style={{ maxWidth: "600px" }}>
          <h3 style={{ fontSize: "24px", color: "var(--brand-gold)", marginBottom: "12px", fontWeight: "800" }}>
            The Taste of Tradition
          </h3>
          <p style={{ color: "#eae6df", fontSize: "14px", lineHeight: "1.6" }}>
            At MS BHARATHI, we use pure ingredients and traditional recipes passed down through generations. 
            All snacks are prepared daily under hygienic conditions to ensure that you get the freshest taste.
          </p>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "24px" }}>
            <div>
              <strong style={{ display: "block", fontSize: "20px", color: "var(--brand-orange)" }}>100%</strong>
              <span style={{ fontSize: "12px", color: "#c8c3ba" }}>Fresh Ingredients</span>
            </div>
            <div style={{ width: "1px", backgroundColor: "var(--brand-dark-soft)" }}></div>
            <div>
              <strong style={{ display: "block", fontSize: "20px", color: "var(--brand-orange)" }}>Daily</strong>
              <span style={{ fontSize: "12px", color: "#c8c3ba" }}>Stock Refresh</span>
            </div>
            <div style={{ width: "1px", backgroundColor: "var(--brand-dark-soft)" }}></div>
            <div>
              <strong style={{ display: "block", fontSize: "20px", color: "var(--brand-orange)" }}>Hyperlocal</strong>
              <span style={{ fontSize: "12px", color: "#c8c3ba" }}>Quick Delivery</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
