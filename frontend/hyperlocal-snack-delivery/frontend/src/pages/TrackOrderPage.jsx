import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { apiFetch } from "../api/client";
import OrderStatusBadge from "../components/OrderStatusBadge";


const STEPS = [
  "pending_confirmation",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];


export default function TrackOrderPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState(
    params.orderId ||
      localStorage.getItem(
        "latest-order-id",
      ) ||
      "",
  );

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function loadOrder(id) {
    if (!id) {
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch(
        `/orders/${id}`,
      );

      setOrder(data);
      setError("");

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (!params.orderId) {
      return;
    }

    setOrderId(params.orderId);
    loadOrder(params.orderId);

    const interval = setInterval(
      () => loadOrder(params.orderId),
      8000,
    );

    return () => clearInterval(interval);
  }, [params.orderId]);


  function submitLookup(event) {
    event.preventDefault();

    if (!orderId.trim()) {
      return;
    }

    navigate(
      `/track/${orderId.trim()}`,
    );
  }


  const activeIndex = order
    ? STEPS.indexOf(order.status)
    : -1;


  return (
    <section className="section">
      <div className="container narrow">
        <p className="eyebrow">
          ORDER TRACKING
        </p>

        <h1>
          Track your order
        </h1>

        <form
          className="lookup-form"
          onSubmit={submitLookup}
        >
          <input
            value={orderId}
            onChange={event =>
              setOrderId(
                event.target.value,
              )
            }
            placeholder="Paste your order ID"
          />

          <button className="button primary">
            Track
          </button>
        </form>

        {loading && (
          <p>Checking order...</p>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {order && (
          <div className="tracking-card">
            <div className="tracking-top">
              <div>
                <p className="muted small">
                  Order ID
                </p>

                <code>
                  {order.id}
                </code>
              </div>

              <OrderStatusBadge
                status={order.status}
              />
            </div>

            {order.status ===
              "pending_confirmation" && (
              <div className="alert info">
                Your order reached the shop.
                The admin is checking the
                delivery distance and
                availability.
              </div>
            )}

            {order.eta_text && (
              <div className="eta-card">
                <span>
                  Confirmed delivery ETA
                </span>
                <strong>
                  {order.eta_text}
                </strong>
              </div>
            )}

            {order.admin_note && (
              <div className="alert info">
                Shop note: {order.admin_note}
              </div>
            )}

            {![
              "rejected",
              "cancelled",
            ].includes(order.status) && (
              <div className="timeline">
                {STEPS.map(
                  (step, index) => (
                    <div
                      className={`timeline-step ${
                        index <= activeIndex
                          ? "active"
                          : ""
                      }`}
                      key={step}
                    >
                      <span className="timeline-dot">
                        {index < activeIndex
                          ? "✓"
                          : index + 1}
                      </span>

                      <span>
                        {step
                          .replaceAll("_", " ")
                          .replace(
                            /\b\w/g,
                            char =>
                              char.toUpperCase(),
                          )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="order-info-grid">
              <div>
                <span>Distance</span>
                <strong>
                  {order.distance_km} km
                </strong>
              </div>

              <div>
                <span>Subtotal</span>
                <strong>
                  ₹{Number(
                    order.subtotal,
                  ).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Delivery fee</span>
                <strong>
                  ₹{Number(
                    order.delivery_fee,
                  ).toFixed(2)}
                </strong>
              </div>

              <div>
                <span>Total</span>
                <strong>
                  ₹{Number(
                    order.total,
                  ).toFixed(2)}
                </strong>
              </div>
            </div>

            <h3>Items</h3>

            <div className="order-items">
              {order.items.map(item => (
                <div
                  className="summary-row"
                  key={item.id}
                >
                  <span>
                    {item.product_name} ×{" "}
                    {item.quantity}
                  </span>

                  <strong>
                    ₹{Number(
                      item.line_total,
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
