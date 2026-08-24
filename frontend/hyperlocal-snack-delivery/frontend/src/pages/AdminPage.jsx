import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { apiFetch } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";


const NEXT_STATUS_OPTIONS = {
  confirmed: [
    {
      value: "preparing",
      label: "Mark Preparing",
    },
  ],
  preparing: [
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
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


  const loadOrders = useCallback(
    async () => {
      try {
        const data = await apiFetch(
          "/admin/orders",
        );

        setOrders(data);
        setError("");

      } catch (error) {
        setError(error.message);

      } finally {
        setLoading(false);
      }
    },
    [],
  );


  useEffect(() => {
    loadOrders();

    const interval = setInterval(
      loadOrders,
      8000,
    );

    return () => clearInterval(interval);
  }, [loadOrders]);


  async function acceptOrder(orderId) {
    const eta = etas[orderId]?.trim();

    if (!eta) {
      alert(
        "Enter a delivery ETA first.",
      );
      return;
    }

    try {
      await apiFetch(
        `/admin/orders/${orderId}/accept`,
        {
          method: "PATCH",
          body: JSON.stringify({
            eta_text: eta,
          }),
        },
      );

      await loadOrders();

    } catch (error) {
      alert(error.message);
    }
  }


  async function changeStatus(
    orderId,
    status,
  ) {
    try {
      await apiFetch(
        `/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        },
      );

      await loadOrders();

    } catch (error) {
      alert(error.message);
    }
  }


  const pending = orders.filter(
    order =>
      order.status ===
      "pending_confirmation",
  );

  const active = orders.filter(
    order =>
      ![
        "pending_confirmation",
        "delivered",
        "rejected",
        "cancelled",
      ].includes(order.status),
  );


  return (
    <section className="section admin-page">
      <div className="container">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">
              SHOP ADMIN
            </p>

            <h1>
              Order dashboard
            </h1>
          </div>

          <div className="admin-stats">
            <div>
              <span>Pending</span>
              <strong>{pending.length}</strong>
            </div>

            <div>
              <span>Active</span>
              <strong>{active.length}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{orders.length}</strong>
            </div>
          </div>
        </div>

        {loading && (
          <p>Loading orders...</p>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <h2 className="admin-section-title">
          Pending confirmation
        </h2>

        {!pending.length &&
          !loading && (
            <div className="empty-admin">
              No pending orders.
            </div>
          )}

        <div className="admin-order-grid">
          {pending.map(order => (
            <article
              className="admin-order-card"
              key={order.id}
            >
              <div className="admin-card-head">
                <div>
                  <strong>
                    {order.recipient_name}
                  </strong>
                  <p>
                    {order.phone}
                  </p>
                </div>

                <OrderStatusBadge
                  status={order.status}
                />
              </div>

              <div className="distance-highlight">
                <span>
                  Delivery distance
                </span>
                <strong>
                  {order.distance_km} km
                </strong>
              </div>

              <p className="address">
                {order.address_line},{" "}
                {order.city} -{" "}
                {order.pincode}
              </p>

              <div className="order-items compact">
                {order.items.map(item => (
                  <div
                    className="summary-row"
                    key={item.id}
                  >
                    <span>
                      {item.product_name} ×{" "}
                      {item.quantity}
                    </span>

                    <span>
                      ₹
                      {Number(
                        item.line_total,
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <strong>Total</strong>
                <strong>
                  ₹
                  {Number(
                    order.total,
                  ).toFixed(2)}
                </strong>
              </div>

              <label>
                Delivery ETA
                <input
                  placeholder="Today by 7:30 PM"
                  value={
                    etas[order.id] || ""
                  }
                  onChange={event =>
                    setEtas(current => ({
                      ...current,
                      [order.id]:
                        event.target.value,
                    }))
                  }
                />
              </label>

              <div className="admin-actions">
                <button
                  className="button primary"
                  onClick={() =>
                    acceptOrder(order.id)
                  }
                >
                  Accept + Set ETA
                </button>

                <button
                  className="button danger-button"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "rejected",
                    )
                  }
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>

        <h2 className="admin-section-title">
          Active orders
        </h2>

        <div className="admin-order-grid">
          {active.map(order => (
            <article
              className="admin-order-card"
              key={order.id}
            >
              <div className="admin-card-head">
                <div>
                  <strong>
                    {order.recipient_name}
                  </strong>
                  <p>
                    {order.distance_km} km
                  </p>
                </div>

                <OrderStatusBadge
                  status={order.status}
                />
              </div>

              <p>
                ETA:{" "}
                <strong>
                  {order.eta_text ||
                    "Not set"}
                </strong>
              </p>

              {(
                NEXT_STATUS_OPTIONS[
                  order.status
                ] || []
              ).map(option => (
                <button
                  key={option.value}
                  className="button secondary full"
                  onClick={() =>
                    changeStatus(
                      order.id,
                      option.value,
                    )
                  }
                >
                  {option.label}
                </button>
              ))}
            </article>
          ))}
        </div>

        <h2 className="admin-section-title">
          Recent orders
        </h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Distance</th>
                <th>Total</th>
                <th>ETA</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>
                    {order.recipient_name}
                  </td>

                  <td>
                    <OrderStatusBadge
                      status={order.status}
                    />
                  </td>

                  <td>
                    {order.distance_km} km
                  </td>

                  <td>
                    ₹
                    {Number(
                      order.total,
                    ).toFixed(2)}
                  </td>

                  <td>
                    {order.eta_text || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
