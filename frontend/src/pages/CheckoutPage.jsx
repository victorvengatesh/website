import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    recipient_name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });

  const [locationMessage, setLocationMessage] = useState("");
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);

  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function checkWallet() {
    if (!form.phone || form.phone.length < 8) return;
    try {
      const res = await apiFetch(`/users/${form.phone}/wallet`);
      setWalletBalance(res.balance);
    } catch (err) {
      console.error(err);
    }
  }

  async function topupWallet() {
    if (!form.phone) return;
    try {
      const res = await apiFetch(`/users/${form.phone}/wallet/topup`, {
        method: "POST",
        body: JSON.stringify({ amount: 500 }),
      });
      setWalletBalance(res.balance);
      showToast("Wallet topped up by ₹500.00 successfully!");
    } catch (err) {
      console.error(err);
      showToast("Could not top up wallet", "error");
    }
  }

  function captureLocation() {
    setLocationError("");
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setLocationMessage("Acquiring GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationMessage("Precise delivery location captured successfully.");
        showToast("GPS coordinates captured!");
      },
      (err) => {
        let msg = "Could not get location. ";
        if (err.code === 1) {
          msg += "Location access was denied. Please enable permission and try again.";
        } else {
          msg += err.message;
        }
        setLocationError(msg);
        setLocationMessage("");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.latitude === null || form.longitude === null) {
      setError("Please capture your precise delivery location before placing the order.");
      return;
    }

    setLoading(true);

    try {
      const order = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      clearCart();
      localStorage.setItem("latest-order-id", order.id);
      showToast("Order placed successfully!");
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Checkout failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Secure Checkout</h2>
          <p>Complete the details below to submit your hyperlocal delivery request.</p>
        </div>

        <div className="checkout-steps-layout">
          <form className="checkout-steps-panel" onSubmit={handleSubmit}>
            
            {/* Step 1: Delivery Details */}
            <div className="checkout-step-section">
              <div className="checkout-step-header">
                <span className="step-number">1</span>
                <h3>Delivery Details</h3>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="recipient_name">Full Name</label>
                  <input
                    id="recipient_name"
                    required
                    name="recipient_name"
                    value={form.recipient_name}
                    onChange={handleChange}
                    placeholder="Recipient's Name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={checkWallet}
                    placeholder="Mobile Number (e.g. 9876543210)"
                  />
                </div>

                {/* Wallet Balance Integration */}
                {walletBalance !== null && (
                  <div className="checkout-wallet-card">
                    <div className="wallet-details">
                      <strong>Wallet Balance: ₹{walletBalance.toFixed(2)}</strong>
                      <p>Snacks amount is deducted directly from your local shop wallet.</p>
                    </div>
                    <button type="button" className="button secondary" onClick={topupWallet} style={{ padding: "6px 12px", fontSize: "12px" }}>
                      💳 Add ₹500
                    </button>
                  </div>
                )}

                <div className="form-group full-field">
                  <label htmlFor="address_line">Delivery Address</label>
                  <textarea
                    id="address_line"
                    required
                    name="address_line"
                    value={form.address_line}
                    onChange={handleChange}
                    placeholder="House/Flat No, Apartment, Street name, Landmark"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Karur"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    id="pincode"
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="639001"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Location Access */}
            <div className="checkout-step-section">
              <div className="checkout-step-header">
                <span className="step-number">2</span>
                <h3>GPS Delivery Location</h3>
              </div>

              <div className="location-action-box">
                <div>
                  <strong style={{ fontSize: "14px", display: "block" }}>Capture Current Location</strong>
                  <p>We require your exact coordinates to compute delivery feasibility and distance fee.</p>
                </div>
                <button
                  type="button"
                  className="button secondary"
                  onClick={captureLocation}
                  style={{ gap: "6px" }}
                >
                  📍 Get GPS
                </button>
              </div>

              {locationMessage && (
                <div className="alert info" style={{ marginTop: "16px", marginBottom: 0 }}>
                  ✓ {locationMessage}
                </div>
              )}

              {locationError && (
                <div className="alert error" style={{ marginTop: "16px", marginBottom: 0 }}>
                  ⚠️ {locationError}
                </div>
              )}
            </div>

            {/* Step 3: Review & Submit */}
            <div className="checkout-step-section">
              <div className="checkout-step-header">
                <span className="step-number">3</span>
                <h3>Review & Place Order</h3>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                By clicking Place Order, your details will be sent directly to the local shop. 
                ETA and exact delivery charges will be confirmed by the admin post review.
              </p>

              {error && <div className="alert error">{error}</div>}

              <button
                className="button primary full"
                disabled={loading || form.latitude === null}
                type="submit"
                style={{ fontSize: "16px", padding: "14px" }}
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </div>

          </form>

          {/* Right Sidebar: Items review */}
          <aside className="sticky-summary-card">
            <h3 className="summary-title">Review Items</h3>

            {cart.map((item) => (
              <div className="summary-row" key={item.id} style={{ fontSize: "13px", padding: "6px 0" }}>
                <span>
                  {item.name} <span style={{ color: "var(--text-muted)" }}>× {item.quantity}</span>
                </span>
                <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
              </div>
            ))}

            <hr style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />

            <div className="summary-row total">
              <span>Items Total:</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px", lineHeight: "1.4" }}>
              💡 Delivery fee is calculated based on distance from the shop. Distance limit: 15 km.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
