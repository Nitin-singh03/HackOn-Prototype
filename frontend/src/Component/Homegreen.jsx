// File: src/components/Homegreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Homegreen.css";
import ImageSliderGreen from "./Imageslidegreen"; // adjust path/name if needed

function Productgreen({ product, onAddToCart }) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rating] = useState(() => Math.floor(Math.random() * 5) + 1);
  const navigate = useNavigate();

  const { eco, description, certifications = [] } = product;
  const ecoScore = eco?.ecoScore ?? 0;
  const ecoGrade =
    ecoScore >= 90 ? "A+" :
    ecoScore >= 75 ? "A"  :
    ecoScore >= 60 ? "B"  :
    ecoScore >= 40 ? "C"  :
                     "D";

  const per100 = {
    gecko:
      ecoScore >= 90 ? 15 :
      ecoScore >= 75 ? 12 :
      ecoScore >= 60 ? 8  :
      ecoScore >= 40 ? 4  :
                       0,
    canopy:
      ecoScore >= 90 ? 15 :
      ecoScore >= 75 ? 12 :
      ecoScore >= 60 ? 8  :
      ecoScore >= 40 ? 4  :
                       0
  };

  const totalGecko  = Math.floor((product.price * per100.gecko)  / 100);
  const totalCanopy = Math.floor((product.price * per100.canopy) / 100);

  const breakdown = [
    { label: "🌿 Material",       value: eco?.matScore   || 0 },
    { label: "🏭 Manufacturing",  value: eco?.manufScore || 0 },
    { label: "🚚 Transport",      value: eco?.transScore || 0 },
    { label: "📦 Packaging",      value: eco?.pkgScore   || 0 }
  ];

  // Handler when clicking the card (except on button)
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="productgreen clickable-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        setPos({ x: e.clientX, y: e.clientY });
      }}
      onClick={handleCardClick}
    >
      <img
        src={product.image}
        alt={product.name}
        className="pg-image"
      />

      <h3 className="pg-title">{product.name}</h3>
      <p className="pg-desc">{description}</p>

      <div className="pg-info-row">
        <span className="pg-price">₹{product.price.toFixed(2)}</span>
        <div className="pg-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
              ★
            </span>
          ))}
        </div>
        <span className="pg-ecoscore-small">
          🌱 {ecoScore} ({ecoGrade})
        </span>
      </div>

      <button
        className="pg-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onAddToCart) {
            onAddToCart(product._id);
          }
        }}
      >
        Add to Cart
      </button>

      <div className="pg-coins">
        <div className="coin-item">
          <img src="/images/gecko_coin.png" alt="Gecko Coin" />
          <span>{totalGecko} Gecko</span>
        </div>
        <div className="coin-item">
          <img src="/images/canopy_coin.png" alt="Canopy Coin" />
          <span>{totalCanopy} Canopy</span>
        </div>
      </div>

      {certifications.length > 0 && (
        <div className="pg-certs">
          {certifications.map(c => (
            <span key={c} className="pg-cert">{c}</span>
          ))}
        </div>
      )}

      {hover && (
        <div
          className="pg-float-overlay"
          style={{ top: pos.y + 12, left: pos.x + 12 }}
        >
          {breakdown.map(item => (
            <div key={item.label} className="pg-bar-container">
              <span className="pg-bar-label">
                {item.label}: {item.value}
              </span>
              <div className="pg-bar">
                <div
                  className="pg-bar-fill"
                  style={{ width: `${item.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Homegreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // only show products with ecoScore >= 40 (C and above)
  const visibleProducts = products.filter(p => {
    const score = p.eco?.ecoScore ?? 0;
    return score >= 40;
  });

  const handleAddToCart = (id) => {
    // Example: navigate or add to cart logic
    navigate(`/cart/${id}`);
  };

  return (
    <div className="homeg">
      <div className="home__containerg">
        <ImageSliderGreen />
      </div>

      {loading && <div className="home__loadingg">Loading…</div>}
      {error   && <div className="home__errorg">{error}</div>}
      <br/><br/><br/><br/><br/><br/>
      {!loading && !error && (
        <div className="home__gridg">
          {visibleProducts.map(p => (
            <Productgreen
              key={p._id}
              product={p}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
