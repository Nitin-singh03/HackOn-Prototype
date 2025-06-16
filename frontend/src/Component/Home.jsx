// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Home.css";
import ImageSlider from "./ImageSlider";

function ProductCard({ product, onAddToCart }) {
  const [rating] = useState(() => Math.floor(Math.random() * 5) + 1);

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
            <span
              key={i}
              className={`star ${i < rating ? "filled" : ""}`}
            >
              ★
            </span>
          ))}
        </span>
      </div>

      <button
        className="product-card__btn"
        onClick={() => onAddToCart(product._id)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  // now uses React Router navigation
  const handleAddToCart = (id) => {
    navigate(`/cart/${id}`);
  };

  return (
    <div className="home">
      <div className="home__container">
        <ImageSlider />

        {loading && <div className="home__loading">Loading…</div>}
        {error && <div className="home__error">{error}</div>}

        {!loading && !error && (
          <div className="home__row">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
