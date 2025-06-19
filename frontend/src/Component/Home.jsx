import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Css/Home.css";
import ImageSlider from "./ImageSlider";

function ProductCard({ product, onAddToCart, adding, added }) {
  const rating = product.rating ?? 0; // use rating from product data

  return (
    <div className="product-card">
      {/* Link wraps image + title to go to details page */}
      <Link to={`/product/${product._id}`} className="product-card__link">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
        <h3 className="product-card__title">{product.name}</h3>
      </Link>

      {product.brand && (
        <p className="product-card__brand">By {product.brand}</p>
      )}

      {product.description && (
        <p className="product-card__desc">{product.description}</p>
      )}

      <div className="product-card__info">
        <span className="product-card__price">
          ₹{product.price.toFixed(2)}
        </span>
        <span className="product-card__rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
              ★
            </span>
          ))}
        </span>
      </div>

      <button
        className="product-card__btn"
        onClick={() => onAddToCart(product._id)}
        disabled={adding}
      >
        {adding
          ? "Adding…"
          : added
          ? "✓ Added!"
          : "Add to Cart"}
      </button>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // track per-product adding/added state
  const [cartState, setCartState] = useState({}); 

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = async (productId) => {
    setCartState(prev => ({
      ...prev,
      [productId]: { adding: true, added: false }
    }));

    try {
      const { data: updatedCart } = await axios.post("/api/cart", {
        productId,
        qty: 1
      });

      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: updatedCart })
      );

      setCartState(prev => ({
        ...prev,
        [productId]: { adding: false, added: true }
      }));

      setTimeout(() => {
        setCartState(prev => ({
          ...prev,
          [productId]: { adding: false, added: false }
        }));
      }, 1500);

    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartState(prev => ({
        ...prev,
        [productId]: { adding: false, added: false }
      }));
    }
  };

  return (
    <div className="home">
      <div className="home__container">
        <ImageSlider />

        {loading && <div className="home__loading">Loading…</div>}
        {error   && <div className="home__error">{error}</div>}

        {!loading && !error && (
          <div className="home__row">
            {products.map((p) => {
              const state = cartState[p._id] || {};
              return (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  adding={state.adding}
                  added={state.added}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}