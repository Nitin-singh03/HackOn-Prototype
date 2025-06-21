import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Css/Homegreen.css";
import ImageSliderGreen from "./Imageslidegreen";

function Productgreen({
  product,
  onAddToCart,
  adding,
  added
}) {
  const [hover, setHover] = useState(false);
  const [pos, setPos]     = useState({ x: 0, y: 0 });

  const { eco, description, certifications = [] } = product;
  const ecoScore = eco?.ecoScore ?? 0;
  const ecoGrade =
    ecoScore >= 90 ? "A+" :
    ecoScore >= 75 ? "A"  :
    ecoScore >= 60 ? "B"  :
    ecoScore >= 40 ? "C"  : "D";

  const per100 = {
    gecko:
      ecoScore >= 90 ? 15 :
      ecoScore >= 75 ? 12 :
      ecoScore >= 60 ? 8  :
      ecoScore >= 40 ? 4  : 0,
    canopy:
      ecoScore >= 90 ? 15 :
      ecoScore >= 75 ? 12 :
      ecoScore >= 60 ? 8  :
      ecoScore >= 40 ? 4  : 0
  };

  const totalGecko  = Math.floor((product.price * per100.gecko)  / 100);
  const totalCanopy = Math.floor((product.price * per100.canopy) / 100);

  const breakdown = [
    { label: "🌿 Material",       value: eco?.matScore   || 0 },
    { label: "🏭 Manufacturing",  value: eco?.manufScore || 0 },
    { label: "🚚 Transport",      value: eco?.transScore || 0 },
    { label: "📦 Packaging",      value: eco?.pkgScore   || 0 }
  ];

  return (
    <div className="productgreen clickable-card">
      {/* IMAGE LINK */}
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="pg-image" />
      </Link>

      {/* TITLE LINK */}
      <Link to={`/product/${product._id}`} className="pg-titleLink">
        <h3 className="pg-title">{product.name}</h3>
      </Link>

      <p className="pg-desc">{description}</p>

      <div className="pg-info-row">
        <span className="pg-price">₹{product.price.toFixed(2)}</span>
        <div className="pg-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < product.rating ? "filled" : ""}`}>★</span>
          ))}
        </div>
        {/* ECO-SCORE BADGE WITH HOVER HANDLERS */}
        <span
          className="pg-ecoscore-small"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
        >
          🌱 {ecoScore} ({ecoGrade})
        </span>
      </div>

      <button
        className="pg-btn"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(product._id);
        }}
        disabled={adding}
      >
        { adding ? "Adding…" : added ? "✓ Added!" : "Add to Cart" }
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
          {certifications.map(cert => (
            <span key={cert.name} className="pg-cert">
              {cert.name} ({Math.round(cert.weight * 100)}%)
            </span>
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
                {item.label}: {item.value * 100}%
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
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [cartState, setCartState] = useState({});

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

  const handleAddToCart = async (productId) => {
    setCartState(prev => ({ ...prev, [productId]: { adding: true, added: false } }));
    try {
      const { data: updatedCart } = await axios.post("/api/cart", { productId, qty: 1 });
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart }));
      setCartState(prev => ({ ...prev, [productId]: { adding: false, added: true } }));
      setTimeout(() => {
        setCartState(prev => ({ ...prev, [productId]: { adding: false, added: false } }));
      }, 1500);
    } catch {
      setCartState(prev => ({ ...prev, [productId]: { adding: false, added: false } }));
    }
  };

  const visibleProducts = products.filter(p => (p.eco?.ecoScore ?? 0) >= 40);

  return (
    <div className="homeg">
      <div className="home__containerg">
        <ImageSliderGreen />
      </div>
      <br/><br/><br/><br/><br/>
      {loading && <div className="home__loadingg">Loading…</div>}
      {error   && <div className="home__errorg">{error}</div>}

      {!loading && !error && (
        <div className="home__gridg">
          {visibleProducts.map(p => (
            <Productgreen
              key={p._id}
              product={p}
              onAddToCart={handleAddToCart}
              adding={cartState[p._id]?.adding}
              added={cartState[p._id]?.added}
            />
          ))}
        </div>
      )}
    </div>
  );
}
