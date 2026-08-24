import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Layout({ children }) {
  const { totalItems, cart, subtotal } = useCart();
  const { toast, hideToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  }

  function handleCategoryClick(cat) {
    if (cat === "All") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(cat)}`);
    }
  }

  // Categories list
  const categories = ["All", "Mixtures", "Murukku", "Chips", "Peanuts", "Sweets", "Halwa"];

  // Check if we are on the admin page so we can render a clean layout for the admin
  const isAdminPage = window.location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage ? (
        <header className="site-header">
          {/* Row 1: Main Bar */}
          <div className="header-row-primary">
            <div className="container header-inner-primary">
              {/* Brand Logo */}
              <Link className="brand" to="/">
                <span className="brand-mark">M</span>
                <span className="brand-text">
                  <strong>MS BHARATHI</strong>
                  <small>Fresh • Local • Fast</small>
                </span>
              </Link>

              {/* Location indicator */}
              <div className="location-indicator" onClick={() => navigate("/checkout")}>
                <span className="loc-icon">📍</span>
                <div>
                  <p style={{ fontSize: "11px", color: "#c8c3ba" }}>Deliver to</p>
                  <strong>Karur Shop Area</strong>
                </div>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-container">
                <input
                  className="search-input"
                  placeholder="Search fresh traditional snacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  🔍
                </button>
              </form>

              {/* Actions & Cart */}
              <div className="header-actions">
                <Link to="/track" className="header-link">
                  Track Order
                </Link>

                {/* Cart link with Mini Cart dropdown */}
                <div style={{ position: "relative" }}>
                  <Link to="/cart" className="cart-link-upgraded">
                    <span>🛒 Cart</span>
                    <span className="cart-badge-upgraded">{totalItems}</span>
                    
                    {/* Mini Cart Dropdown on hover */}
                    {cart.length > 0 && (
                      <div className="mini-cart-dropdown">
                        <strong style={{ display: "block", marginBottom: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                          Shopping Cart ({totalItems})
                        </strong>
                        {cart.slice(0, 3).map((item) => (
                          <div className="mini-cart-item" key={item.id}>
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                          </div>
                        ))}
                        {cart.length > 3 && (
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", margin: "8px 0", textAlign: "center" }}>
                            + {cart.length - 3} more item{cart.length - 3 > 1 ? "s" : ""}
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0", fontWeight: "700" }}>
                          <span>Subtotal:</span>
                          <span style={{ color: "var(--brand-orange)" }}>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Link to="/cart" className="button primary full" style={{ padding: "8px", fontSize: "12px" }}>
                          Checkout Cart
                        </Link>
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Category sub-nav bar */}
          <div className="header-row-secondary">
            <div className="container">
              <nav className="category-nav">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="category-nav-link"
                  >
                    {cat}
                  </button>
                ))}
                <span style={{ marginLeft: "auto" }}>
                  <NavLink to="/admin" className="category-nav-link" style={{ color: "var(--brand-gold)" }}>
                    Admin Panel
                  </NavLink>
                </span>
              </nav>
            </div>
          </div>
        </header>
      ) : (
        // Admin Specific Header
        <header className="admin-header-strip">
          <div className="container admin-header-inner">
            <Link className="brand" to="/admin">
              <span className="brand-mark" style={{ backgroundColor: "var(--brand-gold)", color: "var(--brand-dark)" }}>A</span>
              <span className="brand-text">
                <strong>MS BHARATHI</strong>
                <small style={{ color: "var(--brand-gold)" }}>Operational Dashboard</small>
              </span>
            </Link>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link to="/" className="header-link" style={{ fontSize: "13px" }}>
                ← Customer Shop
              </Link>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>

      <footer>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px" }}>
          <div>
            <strong style={{ fontSize: "18px", color: "var(--brand-gold)" }}>MS BHARATHI SNACKS</strong>
            <p style={{ fontSize: "13px", color: "#c8c3ba", marginTop: "6px", maxWidth: "300px" }}>
              Serving fresh, crispy, premium local snacks daily. Confirming availability, distance and ETA instantly.
            </p>
          </div>
          <div style={{ display: "flex", gap: "48px" }}>
            <div>
              <h5 style={{ color: "var(--brand-gold)", marginBottom: "8px", fontSize: "14px" }}>Quick Links</h5>
              <ul style={{ listStyle: "none", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><Link to="/products" style={{ color: "#eae6df" }}>Browse Snacks</Link></li>
                <li><Link to="/track" style={{ color: "#eae6df" }}>Track Order</Link></li>
                <li><Link to="/admin" style={{ color: "#eae6df" }}>Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: "var(--brand-gold)", marginBottom: "8px", fontSize: "14px" }}>Contact</h5>
              <p style={{ fontSize: "13px", color: "#eae6df" }}>Karur, Tamil Nadu</p>
              <p style={{ fontSize: "13px", color: "#eae6df", marginTop: "4px" }}>Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Floating Toast Alert renderer */}
      {toast && (
        <div className="toast-container">
          <div className={`toast-message ${toast.type}`}>
            <span className="toast-content-text">{toast.message}</span>
            <button className="toast-dismiss-btn" onClick={hideToast}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
