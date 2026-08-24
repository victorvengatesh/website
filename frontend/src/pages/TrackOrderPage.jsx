import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";

const STEPS = [
  { value: "pending_confirmation", label: "Order Placed", desc: "Sent to the shop for feasibility check." },
  { value: "confirmed", label: "Order Confirmed", desc: "Accepted by shop. ETA assigned." },
  { value: "preparing", label: "Preparing Snacks", desc: "Crispy packing in progress." },
  { value: "out_for_delivery", label: "Out for Delivery", desc: "Rider is heading your way." },
  { value: "delivered", label: "Snacks Delivered", desc: "Enjoy your traditional treats!" },
];

export default function TrackOrderPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const savedOrderId = localStorage.getItem("latest-order-id") || "";

  async function loadOrder(id) {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/orders/${id}`);
      setOrder(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  // Handle URL parameter change & polling
  useEffect(() => {
    if (!params.orderId) {
      setOrder(null);
      return;
    }
    
    loadOrder(params.orderId);
    
    // Poll order status every 8 seconds
    const interval = setInterval(() => {
      loadOrder(params.orderId);
    }, 8000);

    return () => clearInterval(interval);
  }, [params.orderId]);

  function handleLookupSubmit(e) {
    e.preventDefault();
    const cleanId = orderIdInput.trim();
    if (!cleanId) return;
    navigate(`/track/${cleanId}`);
  }

  const activeIndex = order
    ? STEPS.findIndex((step) => step.value === order.status)
    : -1;

  // Render specific status styling rules
  const isRejectedOrCancelled = order && ["rejected", "cancelled"].includes(order.status);

  return (
    <section className="section">
      <div className="container">
        <div className="tracking-wrapper">
          
          {/* Left Column: Tracking Content */}
          <div>
            <div className="section-heading">
              <h2>Order Tracking</h2>
              <p>Check the live progress of your snack delivery.</p>
            </div>

            {/* Tracking Lookup Form */}
            <div className="checkout-step-section" style={{ marginBottom: "24px" }}>
              <form onSubmit={handleLookupSubmit} className="lookup-form">
                <input
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Enter Order ID (e.g. 123e4567-e89b...)"
                />
                <button type="submit" className="button primary">
                  Locate Order
                </button>
              </form>

              {/* LocalStorage Shortcut */}
              {savedOrderId && (
                <div style={{ marginTop: "12px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "700" }}>
                    Recent Order Shortcut
                  </span>
                  <Link to={`/track/${savedOrderId}`} className="shortcut-link-btn">
                    <span>📋 Track Last Order ({savedOrderId.slice(0, 8)}...)</span>
                    <span style={{ color: "var(--brand-orange)" }}>Track →</span>
                  </Link>
                </div>
              )}
            </div>

            {loading && !order && <p>Searching order history...</p>}
            {error && <div className="alert error">{error}</div>}

            {order && (
              <div className="tracking-main-panel">
                <div className="tracking-id-header">
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", uppercase: true }}>
                      ORDER NUMBER
                    </span>
                    <h2 style={{ fontFamily: "monospace", fontSize: "16px", marginTop: "2px" }}>{order.id}</h2>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Confirmed Delivery ETA Jumbotron */}
                {order.eta_text && !isRejectedOrCancelled && (
                  <div className="tracking-eta-jumbo">
                    <span>Estimated Delivery</span>
                    <strong>{order.eta_text}</strong>
                  </div>
                )}

                {order.admin_note && (
                  <div className="alert info">
                    <strong>Shop Message:</strong> {order.admin_note}
                  </div>
                )}

                {/* Rejected/Cancelled display */}
                {isRejectedOrCancelled ? (
                  <div className="alert error" style={{ padding: "24px", textAlign: "center" }}>
                    <span style={{ fontSize: "36px" }}>⚠️</span>
                    <h3 style={{ marginTop: "12px" }}>Order {order.status === "rejected" ? "Rejected" : "Cancelled"}</h3>
                    <p style={{ marginTop: "6px" }}>
                      {order.status === "rejected" 
                        ? "The shop rejected this order. Any wallet deduction will be automatically restored."
                        : "This order was cancelled by the shop or customer."}
                    </p>
                  </div>
                ) : (
                  /* Vertical Timeline Upgraded */
                  <div className="upgraded-timeline">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx < activeIndex;
                      const isCurrent = idx === activeIndex;
                      let stepClass = "";
                      if (isCompleted) stepClass = "completed";
                      if (isCurrent) stepClass = "current";

                      return (
                        <div key={step.value} className={`upgraded-timeline-step ${stepClass}`}>
                          <div className="timeline-icon-box">
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <div className="timeline-step-content">
                            <span className="timeline-step-label">{step.label}</span>
                            <span className="timeline-step-desc">{step.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Right Column: Order Details Summary */}
          {order && (
            <aside className="sticky-summary-card">
              <h3 className="summary-title">Delivery Details</h3>

              <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                <span style={{ display: "block", fontWeight: "700", color: "var(--brand-dark)" }}>Recipient</span>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>{order.recipient_name} ({order.phone})</p>
              </div>

              <div style={{ marginBottom: "16px", fontSize: "13px" }}>
                <span style={{ display: "block", fontWeight: "700", color: "var(--brand-dark)" }}>Address</span>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  {order.address_line}, {order.city} - {order.pincode}
                </p>
              </div>

              <div className="summary-row">
                <span>Distance:</span>
                <strong>{order.distance_km} km</strong>
              </div>

              <hr style={{ borderTop: "1px solid var(--border)", margin: "12px 0" }} />

              {/* Items List */}
              <div style={{ margin: "12px 0" }}>
                <span style={{ display: "block", fontWeight: "700", color: "var(--brand-dark)", fontSize: "13px", marginBottom: "6px" }}>
                  Items Ordered
                </span>
                {order.items.map((item) => (
                  <div key={item.id} className="summary-row" style={{ fontSize: "12px", padding: "4px 0" }}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>₹{Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr style={{ borderTop: "1px solid var(--border)", margin: "12px 0" }} />

              <div className="summary-row">
                <span>Items Subtotal:</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Charge:</span>
                <span>₹{Number(order.delivery_fee).toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total Paid:</span>
                <strong>₹{Number(order.total).toFixed(2)}</strong>
              </div>
            </aside>
          )}

        </div>
      </div>
    </section>
  );
}
