import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { showToast } = useToast();

  function handleQuantityChange(item, newQty) {
    if (newQty > item.stock) {
      showToast(`Cannot exceed available stock of ${item.stock}`, "info");
      return;
    }
    updateQuantity(item.id, newQty);
  }

  function handleRemove(item) {
    removeFromCart(item.id);
    showToast(`Removed ${item.name} from cart`);
  }

  if (!cart.length) {
    return (
      <section className="section">
        <div className="container narrow">
          <div className="empty-cart-container">
            <span className="empty-cart-icon">🛒</span>
            <h3>Your shopping cart is empty</h3>
            <p>Looks like you haven't added any traditional snacks to your cart yet.</p>
            <Link className="button primary" to="/products">
              Explore Traditional Snacks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Shopping Cart</h2>
          <p>Review and adjust the quantities of your selected snacks before checking out.</p>
        </div>

        <div className="cart-layout-upgraded">
          {/* Left Column: Items list */}
          <div className="cart-items-panel">
            <div className="cart-title-row">
              <span style={{ fontWeight: "700", color: "var(--brand-dark)" }}>Items</span>
              <span style={{ fontWeight: "700", color: "var(--brand-dark)" }}>Price</span>
            </div>

            {cart.map((item) => (
              <article className="cart-item-card" key={item.id}>
                <img
                  src={item.image_url || "https://placehold.co/600x400?text=Snack"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=Snack";
                  }}
                />

                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹{Number(item.price).toFixed(2)} each</p>

                  <div className="cart-item-actions">
                    {/* Quantity selectors */}
                    <div className="quantity-selector" style={{ transform: "scale(0.95)", transformOrigin: "left" }}>
                      <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>
                        +
                      </button>
                    </div>

                    <span style={{ color: "var(--border)" }}>|</span>

                    <button
                      className="text-button danger"
                      style={{ fontSize: "13px" }}
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-price-side">
                  <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: Sticky Summary Panel */}
          <aside className="sticky-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Items Subtotal ({totalItems}):</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery Charges:</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textAlign: "right" }}>
                Calculated in next step
              </span>
            </div>

            <div className="summary-row total">
              <span>Subtotal:</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <hr style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />

            <Link className="button primary full" to="/checkout">
              Proceed to Checkout
            </Link>

            <div style={{ marginTop: "16px", fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              🔒 Secure checkout process. Delivery fee is computed based on your GPS coordinates to our physical store.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
