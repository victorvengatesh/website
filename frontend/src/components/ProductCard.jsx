import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductCategory } from "../utils/category";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const category = getProductCategory(product);
  const mockOriginalPrice = (Number(product.price) * 1.15).toFixed(2);
  const isLowStock = product.stock <= 5 && product.stock > 0;

  function handleAdd(e) {
    e.preventDefault(); // Prevents navigation if wrapped in a Link, though we'll use Link on specific elements.
    if (product.stock > 0) {
      addToCart(product);
      showToast(`Added ${product.name} to cart`);
    }
  }

  return (
    <article className="product-card-upgraded">
      <Link to={`/products/${product.id}`} className="product-image-container">
        <img
          src={product.image_url || "https://placehold.co/600x400?text=Snack"}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Snack";
          }}
        />

        {product.stock <= 0 ? (
          <span className="card-badge-stock" style={{ backgroundColor: "#565959" }}>
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="card-badge-stock">
            Only {product.stock} left
          </span>
        ) : null}

        {product.stock > 40 && (
          <span className="card-badge-bestseller">Best Seller</span>
        )}
      </Link>

      <div className="product-details-wrap">
        <span className="product-category-label">{category}</span>
        
        <Link to={`/products/${product.id}`} className="product-card-title-link">
          <strong>{product.name}</strong>
        </Link>

        {/* Product Rating Mock */}
        <div className="product-rating-row">
          <span>★ 4.8</span>
          <span className="product-rating-count">(Verified)</span>
        </div>

        <p className="product-desc-short">{product.description || "Traditional snack prepared daily for premium taste."}</p>

        <div className="product-pricing-line">
          <span className="product-actual-price">₹{Number(product.price).toFixed(2)}</span>
          <span className="product-strike-price">₹{mockOriginalPrice}</span>
          <span className="product-discount-label">(13% OFF)</span>
        </div>

        <button
          className="button primary full"
          style={{ marginTop: "auto" }}
          disabled={product.stock <= 0}
          onClick={handleAdd}
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
