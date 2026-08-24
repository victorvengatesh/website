import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import TrackOrderPage from "./pages/TrackOrderPage";


export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/cart"
            element={<CartPage />}
          />

          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          <Route
            path="/track"
            element={<TrackOrderPage />}
          />

          <Route
            path="/track/:orderId"
            element={<TrackOrderPage />}
          />

          <Route
            path="/admin"
            element={<AdminPage />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
