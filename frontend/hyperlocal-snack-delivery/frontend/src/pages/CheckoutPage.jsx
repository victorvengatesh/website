import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { apiFetch } from "../api/client";
import { useCart } from "../context/CartContext";


export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipient_name: "",
    phone: "",
    address_line: "",
    city: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });

  const [locationMessage, setLocationMessage] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }


  function handleChange(event) {
    const { name, value } = event.target;

    setForm(current => ({
      ...current,
      [name]: value,
    }));
  }


  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Geolocation is not supported by this browser.",
      );
      return;
    }

    setLocationMessage(
      "Getting your location...",
    );

    navigator.geolocation.getCurrentPosition(
      position => {
        setForm(current => ({
          ...current,
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude,
        }));

        setLocationMessage(
          "Precise location captured successfully.",
        );
      },
      error => {
        setLocationMessage(
          `Could not get location: ${error.message}`,
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      form.latitude === null ||
      form.longitude === null
    ) {
      setError(
        "Please capture your precise delivery location before placing the order.",
      );
      return;
    }

    setLoading(true);

    try {
      const order = await apiFetch(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            items: cart.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          }),
        },
      );

      clearCart();

      localStorage.setItem(
        "latest-order-id",
        order.id,
      );

      navigate(
        `/track/${order.id}`,
      );

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="section">
      <div className="container checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <p className="eyebrow">
            CHECKOUT
          </p>

          <h1>
            Delivery details
          </h1>

          <div className="form-grid">
            <label>
              Name
              <input
                required
                name="recipient_name"
                value={form.recipient_name}
                onChange={handleChange}
                placeholder="Customer name"
              />
            </label>

            <label>
              Phone
              <input
                required
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </label>

            <label className="full-field">
              Address
              <textarea
                required
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
                placeholder="House no, street, landmark"
                rows="4"
              />
            </label>

            <label>
              City
              <input
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Karur"
              />
            </label>

            <label>
              Pincode
              <input
                required
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="639001"
              />
            </label>
          </div>

          <div className="location-box">
            <div>
              <strong>
                Precise delivery location
              </strong>
              <p>
                We use this only to calculate
                the delivery distance.
              </p>
            </div>

            <button
              type="button"
              className="button secondary"
              onClick={captureLocation}
            >
              Use my location
            </button>
          </div>

          {locationMessage && (
            <p className="location-message">
              {locationMessage}
            </p>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <button
            className="button primary full"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Placing order..."
              : "Place order"}
          </button>
        </form>

        <aside className="summary-card">
          <h2>Your items</h2>

          {cart.map(item => (
            <div
              className="summary-row"
              key={item.id}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}
              </strong>
            </div>
          ))}

          <hr />

          <div className="summary-row">
            <strong>Subtotal</strong>
            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>
          </div>

          <p className="muted small">
            Delivery charge is calculated by
            the server after location distance
            is checked.
          </p>
        </aside>
      </div>
    </section>
  );
}
