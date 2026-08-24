import { useParams, Link } from "react-router-dom";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <section className="section">
      <div className="container narrow">
        <div className="success-page-card">
          <div className="success-icon-wrap">✓</div>
          
          <h1>Order Placed Successfully!</h1>
          <p className="sub">
            Your snack order has been sent to our shop and is currently pending confirmation.
          </p>

          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Order ID
            </span>
            <div className="success-order-id-box">{orderId}</div>
          </div>

          <div className="success-info-panel">
            <h4>What happens next?</h4>
            <ol>
              <li>The shop checks real-time product stock.</li>
              <li>We verify your precise delivery distance.</li>
              <li>Once accepted, the shop assigns an ETA and begins preparation.</li>
              <li>You can monitor updates live on the tracking page.</li>
            </ol>
          </div>

          <div className="success-actions">
            <Link to={`/track/${orderId}`} className="button primary">
              Track Live Status
            </Link>
            <Link to="/" className="button secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
