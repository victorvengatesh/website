import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";


export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();


  if (!cart.length) {
    return (
      <section className="section">
        <div className="container narrow">
          <div className="empty-state">
            <h1>Your cart is empty</h1>
            <p>
              Add some snacks before checkout.
            </p>
            <Link
              className="button primary"
              to="/"
            >
              Browse snacks
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
          <div>
            <p className="eyebrow">
              CART
            </p>
            <h1>
              Review your order
            </h1>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-list">
            {cart.map(item => (
              <article
                className="cart-item"
                key={item.id}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                />

                <div className="cart-item-main">
                  <h3>{item.name}</h3>
                  <p>
                    ₹
                    {Number(
                      item.price,
                    ).toFixed(2)}{" "}
                    each
                  </p>

                  <div className="quantity-row">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                        )
                      }
                    >
                      −
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-side">
                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </strong>

                  <button
                    className="text-button danger"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="summary-card">
            <h2>Order summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>
                Calculated from distance
              </span>
            </div>

            <hr />

            <Link
              className="button primary full"
              to="/checkout"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
