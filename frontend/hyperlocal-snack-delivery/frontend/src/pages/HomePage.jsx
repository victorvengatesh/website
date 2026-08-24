import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api/client";
import ProductCard from "../components/ProductCard";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);


  return (
    <>
      <section className="video-hero">
        <video
          className="video-hero-media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source
            src="/videos/hero-snacks.mp4"
            type="video/mp4"
          />
        </video>

        <div className="video-hero-overlay" />
        <div className="video-hero-glow" />

        <div className="container video-hero-content">
          <div className="video-hero-copy">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              Fresh from our local shop
            </div>

            <p className="video-kicker">
              CRUNCH • SWEET • SPICY • LOCAL
            </p>

            <h1>
              Fresh snacks.
              <br />
              <span>Delivered nearby.</span>
            </h1>

            <p className="video-hero-description">
              Order your favourite traditional snacks in minutes.
              We confirm your delivery distance, availability and ETA
              before your order leaves the shop.
            </p>

            <div className="video-hero-actions">
              <a
                className="button hero-primary"
                href="#products"
              >
                Shop Snacks
                <span aria-hidden="true">→</span>
              </a>

              <Link
                className="button hero-secondary"
                to="/track"
              >
                Track Order
              </Link>
            </div>

            <div className="hero-trust-row">
              <div>
                <strong>Fresh</strong>
                <span>Daily stock</span>
              </div>

              <div className="hero-trust-divider" />

              <div>
                <strong>Local</strong>
                <span>Nearby delivery</span>
              </div>

              <div className="hero-trust-divider" />

              <div>
                <strong>Fast</strong>
                <span>Confirmed ETA</span>
              </div>
            </div>
          </div>

          <div className="hero-floating-card">
            <div className="floating-icon">⚡</div>

            <div>
              <span className="floating-label">
                HOW IT WORKS
              </span>

              <strong>
                Order → Confirm → Deliver
              </strong>

              <p>
                Your shop verifies distance and sends a realistic ETA.
              </p>
            </div>
          </div>
        </div>

        <a
          href="#products"
          className="hero-scroll-cue"
          aria-label="Scroll to snacks"
        >
          <span>Explore</span>
          <i>↓</i>
        </a>
      </section>

      <section
        className="section premium-products-section"
        id="products"
      >
        <div className="container">
          <div className="section-heading premium-section-heading">
            <div>
              <p className="eyebrow">
                OUR FAVOURITES
              </p>

              <h2>
                Pick something
                <span className="accent-text"> delicious.</span>
              </h2>

              <p className="section-description">
                Fresh local snacks selected for quick neighbourhood delivery.
              </p>
            </div>

            <div className="section-mini-badge">
              <span>✦</span>
              Made for local delivery
            </div>
          </div>

          {loading && (
            <div className="premium-loading">
              Loading fresh snacks...
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="container home-benefits-grid">
          <article>
            <span>01</span>
            <h3>Choose your favourites</h3>
            <p>
              Browse the shop catalogue and add fresh snacks to your cart.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Share your location</h3>
            <p>
              We calculate delivery distance securely on the backend.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Get a confirmed ETA</h3>
            <p>
              The shop checks feasibility and sends a realistic delivery time.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
