import { useCart } from "../context/CartContext";


export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={
            product.image_url ||
            "https://placehold.co/600x400?text=Snack"
          }
          alt={product.name}
          className="product-image"
        />

        {product.stock <= 5 &&
          product.stock > 0 && (
            <span className="stock-warning">
              Only {product.stock} left
            </span>
          )}
      </div>

      <div className="product-content">
        <p className="eyebrow">
          {product.sku}
        </p>

        <h3>{product.name}</h3>

        <p className="muted">
          {product.description}
        </p>

        <div className="product-footer">
          <strong className="price">
            ₹{Number(product.price).toFixed(2)}
          </strong>

          <button
            className="button primary"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
          >
            {product.stock <= 0
              ? "Out of stock"
              : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
