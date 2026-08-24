import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";

const NEXT_STATUS_OPTIONS = {
  confirmed: [
    {
      value: "preparing",
      label: "Start Preparing",
    },
  ],
  preparing: [
    {
      value: "out_for_delivery",
      label: "Ship (Out for Delivery)",
    },
  ],
  out_for_delivery: [
    {
      value: "delivered",
      label: "Mark Delivered",
    },
  ],
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [etas, setEtas] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const data = await apiFetch("/admin/orders");
      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  async function acceptOrder(orderId) {
    const eta = etas[orderId]?.trim();
    if (!eta) {
      alert("Please enter or select a delivery ETA before accepting.");
      return;
    }

    try {
      await apiFetch(`/admin/orders/${orderId}/accept`, {
        method: "PATCH",
        body: JSON.stringify({ eta_text: eta }),
      });
      await loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  async function changeStatus(orderId, status) {
    if (status === "rejected" || status === "cancelled") {
      const confirmDestructive = window.confirm(
        `Are you sure you want to change this order status to ${status.toUpperCase()}? This will return items to inventory and refund the user's wallet.`
      );
      if (!confirmDestructive) return;
    }

    try {
      await apiFetch(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadOrders();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleQuickEtaSelect(orderId, etaText) {
    setEtas((current) => ({
      ...current,
      [orderId]: etaText,
    }));
  }

  const pending = orders.filter((o) => o.status === "pending_confirmation");
  const active = orders.filter(
    (o) => !["pending_confirmation", "delivered", "rejected", "cancelled"].includes(o.status)
  );
  
  // Calculate completed orders today
  const deliveredToday = orders.filter(
    (o) => o.status === "delivered" && new Date(o.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="admin-dashboard-wrap">
      <div className="container">
        
        {/* Admin Operational Stats */}
        <div className="admin-stats-strip">
          <div className="admin-stat-card">
            <span>Pending Approvals</span>
            <strong>{pending.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Active Deliveries</span>
            <strong>{active.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Delivered Today</span>
            <strong>{deliveredToday}</strong>
          </div>
        </div>

        {error && <div className="alert error">{error}</div>}

        {/* Section 1: Pending Orders */}
        <div className="section-heading">
          <h2>Pending Orders ({pending.length})</h2>
          <p>Orders awaiting inventory availability and distance feasibility checks.</p>
        </div>

        {!pending.length && !loading && (
          <div className="empty-admin" style={{ marginBottom: "32px" }}>
            ✓ All caught up! There are no pending orders.
          </div>
        )}

        <div className="admin-orders-grid" style={{ marginBottom: "48px" }}>
          {pending.map((order) => (
            <article className="admin-card-upgraded" key={order.id}>
              <div className="admin-card-top">
                <div>
                  <span className="admin-card-cust-name">{order.recipient_name}</span>
                  <p className="admin-card-cust-phone">📞 {order.phone}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="admin-distance-badge">
                <span>Calculated Distance</span>
                <strong>{order.distance_km} km</strong>
              </div>

              <div className="admin-card-details">
                <p><strong>Address:</strong> {order.address_line}, {order.city} - {order.pincode}</p>
              </div>

              <div className="order-items compact" style={{ padding: "8px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", marginBottom: "12px" }}>
                {order.items.map((item) => (
                  <div key={item.id} className="summary-row" style={{ fontSize: "12px" }}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>₹{Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row" style={{ marginBottom: "16px" }}>
                <strong>Subtotal: ₹{Number(order.subtotal).toFixed(2)}</strong>
                <strong>Total: ₹{Number(order.total).toFixed(2)}</strong>
              </div>

              {/* Delivery ETA selection panel */}
              <div className="admin-eta-selector-wrap">
                <label style={{ fontSize: "12px", fontWeight: "700" }}>Assign Delivery ETA:</label>
                <div className="quick-eta-buttons">
                  <button type="button" className="quick-eta-btn" onClick={() => handleQuickEtaSelect(order.id, "30 minutes")}>
                    30 mins
                  </button>
                  <button type="button" className="quick-eta-btn" onClick={() => handleQuickEtaSelect(order.id, "45 minutes")}>
                    45 mins
                  </button>
                  <button type="button" className="quick-eta-btn" onClick={() => handleQuickEtaSelect(order.id, "1 hour")}>
                    1 hour
                  </button>
                  <button type="button" className="quick-eta-btn" onClick={() => handleQuickEtaSelect(order.id, "Today evening")}>
                    Today Eve
                  </button>
                  <button type="button" className="quick-eta-btn" onClick={() => handleQuickEtaSelect(order.id, "Tomorrow morning")}>
                    Tmw Morning
                  </button>
                </div>
                <input
                  style={{ marginTop: "6px" }}
                  placeholder="Type or click quick option above"
                  value={etas[order.id] || ""}
                  onChange={(e) =>
                    setEtas((current) => ({
                      ...current,
                      [order.id]: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="admin-actions">
                <button className="button primary" style={{ flex: 1 }} onClick={() => acceptOrder(order.id)}>
                  Accept & Set ETA
                </button>
                <button className="button danger-button" onClick={() => changeStatus(order.id, "rejected")}>
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Section 2: Active Orders */}
        <div className="section-heading">
          <h2>Active Deliveries ({active.length})</h2>
          <p>Orders in preparation or shipping phase.</p>
        </div>

        {!active.length && !loading && (
          <div className="empty-admin" style={{ marginBottom: "32px" }}>
            No active deliveries in progress.
          </div>
        )}

        <div className="admin-orders-grid" style={{ marginBottom: "48px" }}>
          {active.map((order) => (
            <article className="admin-card-upgraded" key={order.id}>
              <div className="admin-card-top">
                <div>
                  <span className="admin-card-cust-name">{order.recipient_name}</span>
                  <p className="admin-card-cust-phone">Distance: {order.distance_km} km</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="admin-card-details" style={{ marginBottom: "14px" }}>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>ETA:</strong> <span style={{ color: "var(--brand-orange)", fontWeight: "700" }}>{order.eta_text || "Not assigned"}</span></p>
                <p style={{ marginTop: "4px" }}><strong>Items:</strong> {order.items.map((i) => `${i.product_name} (${i.quantity})`).join(", ")}</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {(NEXT_STATUS_OPTIONS[order.status] || []).map((option) => (
                  <button
                    key={option.value}
                    className="button primary"
                    style={{ flex: 1 }}
                    onClick={() => changeStatus(order.id, option.value)}
                  >
                    {option.label}
                  </button>
                ))}
                <button className="button danger-button" onClick={() => changeStatus(order.id, "cancelled")}>
                  Cancel Order
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Section 3: Recent Order History log */}
        <div className="section-heading">
          <h2>Order History Log</h2>
          <p>Chronological listing of all orders placed at this outlet.</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Distance</th>
                <th>Revenue</th>
                <th>ETA Note</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.recipient_name}</strong></td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>{order.distance_km} km</td>
                  <td style={{ fontWeight: "700" }}>₹{Number(order.total).toFixed(2)}</td>
                  <td>{order.eta_text || "—"}</td>
                  <td style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
