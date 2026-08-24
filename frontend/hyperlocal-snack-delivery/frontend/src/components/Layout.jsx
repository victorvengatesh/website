import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function Layout({ children }) {
  const { totalItems } = useCart();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">S</span>
            <span>
              Snack Express
              <small>Fresh • Local • Fast</small>
            </span>
          </Link>

          <nav>
            <NavLink to="/">
              Shop
            </NavLink>

            <NavLink to="/track">
              Track Order
            </NavLink>

            <NavLink to="/admin">
              Admin
            </NavLink>

            <NavLink
              to="/cart"
              className="cart-link"
            >
              Cart
              <span className="cart-badge">
                {totalItems}
              </span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <div className="container">
          <strong>Snack Express</strong>
          <p>
            Hyper-local snack delivery MVP.
          </p>
        </div>
      </footer>
    </>
  );
}
