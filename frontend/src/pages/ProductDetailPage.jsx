import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductCategory } from "../utils/category";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/products`)
      .then((products) => {
        const found = products.find((p) => p.id === productId);
        if (found) {
          setProduct(found);
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // Check if item is already in cart to manage quantity bounds
  const cartItem = cart.find((item) => item.id === productId);
  const currentCartQty = cartItem ? cartItem.quantity : 0;
  const maxAvailable = product ? product.stock - currentCartQty : 0;

  function handleQuantityChange(amount) {
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, product.stock)));
  }

  function handleAddToCart() {
    if (!product || product.stock <= 0) return;
    
    // Add multiple quantity of the product to the cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    showToast(`Added ${quantity} × ${product.name} to cart`);
    setQuantity(1);
  }

  function handleBuyNow() {
    if (!product || product.stock <= 0) return;
    // Add to cart and immediately go to checkout
    addToCart(product);
    navigate("/checkout");
  }

  if (loading) {
    return (
      <div className="container section">
        <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
          <div className="skeleton-bar skeleton-shimmer" style={{ width: "20%", height: "20px" }} />
          <div className="product-details-grid">
            <div className="skeleton-card skeleton-shimmer" style={{ height: "400px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="skeleton-bar skeleton-shimmer" style={{ width: "60%", height: "40px" }} />
              <div className="skeleton-bar skeleton-shimmer" style={{ width: "30%", height: "24px" }} />
              <div className="skeleton-bar skeleton-shimmer" style={{ width: "80%", height: "100px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section">
        <div className="empty-cart-container" style={{ padding: "60px 24px" }}>
          <span className="empty-cart-icon">⚠️</span>
          <h3>Product unavailable</h3>
          <p>{error || "This snack could not be loaded."}</p>
          <Link to="/products" className="button primary">
            Back to Snacks
          </Link>
        </div>
      </div>
    );
  }

  const category = getProductCategory(product);
  const mockOriginalPrice = (Number(product.price) * 1.15).toFixed(2);
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <section className="section">
      <div className="container">
        {/* Breadcrumb navigation */}
        <div style={{ marginBottom: "20px", fontSize: "14px", fontWeight: "600" }}>
          <Link to="/" style={{ color: "var(--brand-orange)" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "var(--text-muted)" }}>/</span>
          <Link to="/products" style={{ color: "var(--brand-orange)" }}>Snacks</Link>
          <span style={{ margin: "0 8px", color: "var(--text-muted)" }}>/</span>
          <span style={{ color: "var(--text-muted)" }}>{product.name}</span>
        </div>

        <div className="product-details-grid">
          {/* Left Column: Image */}
          <div className="product-detail-media">
            <div className="product-detail-image-wrap">
              <img
                src={product.image_url || "https://placehold.co/600x400?text=Snack"}
                alt={product.name}
                className="product-detail-img"
              />
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="product-detail-info">
            <span className="product-category-label">{category}</span>
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-rating-row">
              <span>★ 4.8</span>
              <span className="product-rating-count">(Verified Snack Reviews)</span>
              <span style={{ margin: "0 8px", color: "var(--border)" }}>|</span>
              <span className="product-detail-sku">SKU: {product.sku}</span>
            </div>

            <p className="product-detail-desc">{product.description || "Fresh, crispy, and prepared using traditional recipes. The perfect snack for any time of day."}</p>

            <div className="detail-pricing-box">
              <div style={{ display: "flex", gap: "12px", alignItems: "baseline", marginBottom: "12px" }}>
                <span className="product-actual-price" style={{ fontSize: "28px" }}>
                  ₹{Number(product.price).toFixed(2)}
                </span>
                <span className="product-strike-price" style={{ fontSize: "16px" }}>
                  ₹{mockOriginalPrice}
                </span>
                <span className="product-discount-label" style={{ fontSize: "14px" }}>
                  (13% OFF)
                </span>
              </div>

              {/* Stock status indicator */}
              <div style={{ marginBottom: "16px" }}>
                {product.stock <= 0 ? (
                  <span className="badge" style={{ backgroundColor: "#fee2e2", color: "var(--danger)" }}>
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="badge warning">
                    Only {product.stock} left - order soon!
                  </span>
                ) : (
                  <span className="badge success">
                    ✓ In stock (Ready to pack)
                  </span>
                )}
              </div>

              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="qty-control-row">
                  <label>Quantity:</label>
                  <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      −
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="product-detail-actions">
                <button
                  className="button primary"
                  style={{ flex: 1 }}
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="button secondary"
                  style={{ flex: 1, backgroundColor: "var(--brand-gold)", border: "none", color: "var(--brand-dark)" }}
                  disabled={product.stock <= 0}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery Note */}
              <div className="delivery-note-card">
                <span>📍</span>
                <div>
                  <strong>Local Delivery Available</strong>
                  <p style={{ marginTop: "2px" }}>Delivery fee and shop ETA will be calculated and confirmed after checkout.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
