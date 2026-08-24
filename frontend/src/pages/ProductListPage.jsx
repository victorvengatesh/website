import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import ProductCard from "../components/ProductCard";
import { ALL_CATEGORIES, getProductCategory } from "../utils/category";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const activeSearch = searchParams.get("search") || "";

  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter products based on search, category, price, and stock
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (activeCategory !== "All") {
        const cat = getProductCategory(product);
        if (cat !== activeCategory) return false;
      }

      // Search Filter
      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase();
        const category = getProductCategory(product).toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query) || false;
        const matchesCat = category.includes(query);
        
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // Price Filter
      const priceVal = Number(product.price);
      if (priceRange.min !== "" && priceVal < Number(priceRange.min)) return false;
      if (priceRange.max !== "" && priceVal > Number(priceRange.max)) return false;

      // Stock Filter
      if (onlyInStock && product.stock <= 0) return false;

      return true;
    });
  }, [products, activeCategory, activeSearch, priceRange, onlyInStock]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price_asc") {
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "price_desc") {
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sortBy === "name_asc") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // "featured" default sorting by name or database order
    return list;
  }, [filteredProducts, sortBy]);

  function handleCategoryClick(cat) {
    const nextParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", cat);
    }
    setSearchParams(nextParams);
  }

  function handleResetFilters() {
    setPriceRange({ min: "", max: "" });
    setOnlyInStock(false);
    setSortBy("featured");
    setSearchParams({});
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>
            {activeCategory === "All" ? "All Traditional Snacks" : activeCategory}
          </h2>
          <p>
            {activeSearch
              ? `Showing results for "${activeSearch}"`
              : "Freshly made crispy snacks delivered directly from our shop."}
          </p>
        </div>

        <div className="product-listing-layout">
          {/* Sidebar Filter Panel */}
          <aside className="listing-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Categories</h3>
              <ul className="sidebar-list">
                <li
                  className={`sidebar-link ${activeCategory === "All" ? "active" : ""}`}
                  onClick={() => handleCategoryClick("All")}
                >
                  All Snacks
                </li>
                {ALL_CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className={`sidebar-link ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Price Filter (₹)</h3>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Availability</h3>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", fontSize: "13px" }}>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  style={{ width: "auto" }}
                />
                In Stock Only
              </label>
            </div>

            <button
              className="button secondary full"
              style={{ marginTop: "12px" }}
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </aside>

          {/* Main Product List */}
          <div>
            {/* Sorting Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>
                Showing {sortedProducts.length} snack{sortedProducts.length !== 1 ? "s" : ""}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap" }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "auto", padding: "6px 12px" }}
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="product-grid-row">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-image skeleton-shimmer" />
                    <div className="skeleton-content">
                      <div className="skeleton-bar skeleton-shimmer" style={{ width: "40%" }} />
                      <div className="skeleton-bar skeleton-shimmer" style={{ width: "80%" }} />
                      <div className="skeleton-bar skeleton-shimmer" style={{ width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <div className="alert error">{error}</div>}

            {!loading && sortedProducts.length === 0 && (
              <div className="empty-cart-container" style={{ padding: "80px 24px" }}>
                <span className="empty-cart-icon">🔍</span>
                <h3>No snacks found</h3>
                <p>We couldn't find any snacks matching your filter criteria.</p>
                <button className="button primary" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {!loading && sortedProducts.length > 0 && (
              <div className="product-grid-row" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
