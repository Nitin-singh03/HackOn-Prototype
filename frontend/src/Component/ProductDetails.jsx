import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Leaf,
  Truck,
  Package,
  Award,
  ShoppingCart,
  Zap,
} from "lucide-react";
import axios from "axios";
import { getRecommendations } from "../services/recommendationService";
import "../Css/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [ratingCount] = useState(
    () => Math.floor(Math.random() * (5000 - 200) + 200)
  );
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Fetch product and recommendations
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        setError("Failed to load product details.");
      }
      loadRecommendations();
    })();
  }, [id]);

  const loadRecommendations = async () => {
    try {
      setLoadingRecs(true);
      const data = await getRecommendations(id);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  if (error && !product)
    return <div className="pd__error">{error}</div>;
  if (!product) return <div className="pd__loading">Loading…</div>;

  const {
    name,
    image,
    price,
    description,
    countInStock,
    brand,
    category,
    rating,
    materialComposition = [],
    certifications = [],
    eco: {
      ecoScore = 0,
      matScore = 0,
      manufScore = 0,
      transScore = 0,
      pkgScore = 0,
      bonusScore = 0,
    } = {},
  } = product;

  // Eco‐coin percentages per ₹100
  const per100 = {
    gecko:
      ecoScore >= 90
        ? 15
        : ecoScore >= 75
        ? 12
        : ecoScore >= 60
        ? 8
        : ecoScore >= 40
        ? 4
        : 0,
    canopy:
      ecoScore >= 90
        ? 15
        : ecoScore >= 75
        ? 12
        : ecoScore >= 60
        ? 8
        : ecoScore >= 40
        ? 4
        : 0,
  };
  const totalGecko = Math.floor((price * per100.gecko) / 100);
  const totalCanopy = Math.floor((price * per100.canopy) / 100);

  const shippingFee = 28.44;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const deliveryStr = deliveryDate.toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const addToCart = async () => {
    if (countInStock === 0) return;
    setAdding(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setError("Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  // ── Prepare payloads ─────────────────────────────────────────
  // items: an array of { productId, qty }
  const itemsPayload = [
    { productId: id, qty },
    // You can include more items here if you maintain a cart array
  ];

  const coinsPayload = { totalGecko, totalCanopy };

  const costPayload = {
    subtotal: +(price * qty).toFixed(2),
    shipping: +shippingFee.toFixed(2),
    total: +((price * qty) + shippingFee).toFixed(2),
  };

  const handleBuyNow = () => {
    navigate("/buyOptions", {
      state: {
        items: itemsPayload,
        coins: coinsPayload,
        cost: costPayload,
      },
    });
  };
  // ──────────────────────────────────────────────────────────────

  const handleAlternativeClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="pd-container">
      <div className="pd pd--amazon">
        {/* IMAGE */}
        <div className="pd__col pd__col--image">
          <img src={image_url} alt={name} className="pd__image" />
        </div>

        {/* DETAILS & ECO */}
        <div className="pd__col pd__col--details">
          <h1 className="pd__title">{name}</h1>
          {brand && <div className="pd__brand">Brand: {brand}</div>}
          {category && (
            <div className="pd__category">Category: {category}</div>
          )}

          <div className="pd__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`pd__star ${i < rating ? "filled" : ""}`}
                size={18}
                fill={i < rating ? "#f0c14b" : "none"}
                color={i < rating ? "#f0c14b" : "#ccc"}
              />
            ))}
            <span className="pd__ratingCount">
              {ratingCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="pd__priceLarge">₹{price.toFixed(2)}</div>
          <div
            className={`pd__stock ${
              countInStock > 0 ? "in" : "out"
            }`}
          >
            {countInStock > 0 ? "In Stock" : "Out of Stock"}
          </div>

          <p className="pd__desc">{description}</p>

          {/* ECO PANEL */}
          <section className="pd__eco pd__panel">
            <h3 className="pd__ecoHeading">
              <Leaf className="eco-icon" size={20} />
              Eco Score:{" "}
              <span className={`pd__ecoGrade`}>
                {ecoScore.toFixed(1)}
              </span>
            </h3>
            <div className="pd__ecoGrid">
              <div className="pd__ecoMetric">
                <Leaf size={16} />
                Material: {(matScore * 100).toFixed(0)}%
              </div>
              <div className="pd__ecoMetric">
                <Package size={16} />
                Manufacturing: {(manufScore * 100).toFixed(0)}%
              </div>
              <div className="pd__ecoMetric">
                <Truck size={16} />
                Transport: {(transScore * 100).toFixed(0)}%
              </div>
              <div className="pd__ecoMetric">
                <Package size={16} />
                Packaging: {(pkgScore * 100).toFixed(0)}%
              </div>
              <div className="pd__ecoMetric">
                <Award size={16} />
                Bonus: {(bonusScore * 100).toFixed(0)}%
              </div>
            </div>
          </section>

          {/* COINS PANEL */}
          <section className="pd__coins pd__panel">
            <div className="pd__coinItem">
              <div className="coin-icon gecko">🦎</div>
              <div>
                <span className="pd__coinCount">{totalGecko}</span>
                <small>Gecko Coins ({per100.gecko}%/₹100)</small>
              </div>
            </div>
            <div className="pd__coinItem">
              <div className="coin-icon canopy">🌳</div>
              <div>
                <span className="pd__coinCount">{totalCanopy}</span>
                <small>Canopy Coins ({per100.canopy}%/₹100)</small>
              </div>
            </div>
          </section>
        </div>

        {/* BUY BOX */}
        <div className="pd__col pd__col--buy amazon-panel">
          <div className="ap__price">₹{price.toFixed(2)}</div>
          <div className="ap__subtext">
            ₹{shippingFee.toFixed(2)} Shipping & Import Fees Deposit
            <button className="ap__detailsBtn">Details ▾</button>
          </div>
          <div className="ap__delivery">
            Delivery <strong>{deliveryStr}</strong>. Order within{" "}
            <strong>18 hrs 7 mins</strong>
          </div>
          <div
            className={`ap__stock ${
              countInStock > 0 ? "in" : "out"
            }`}
          >
            {countInStock > 0 ? "In Stock" : "Out of Stock"}
          </div>

          {countInStock > 0 && (
            <div className="ap__qty">
              <label htmlFor="qty">Quantity:</label>
              <select
                id="qty"
                value={qty}
                onChange={(e) => setQty(+e.target.value)}
              >
                {[...Array(Math.min(countInStock, 5)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="ap__btn ap__btn--cart"
            disabled={countInStock === 0 || adding}
            onClick={addToCart}
          >
            <ShoppingCart size={16} />
            {adding ? "Adding…" : added ? "✓ Added!" : "Add to Cart"}
          </button>

          <button
            className="ap__btn ap__btn--buy"
            disabled={countInStock === 0}
            onClick={handleBuyNow}
          >
            <Zap size={16} />
            Buy Now
          </button>

          {error && <div className="pd__error">{error}</div>}

          <div className="ap__infoRow">
            <span className="ap__infoLabel">Ships from</span>
            <span className="ap__infoValue">Amazon.com</span>
          </div>
          <div className="ap__infoRow">
            <span className="ap__infoLabel">Sold by</span>
            <span className="ap__infoValue">Amazon.com</span>
          </div>
          <div className="ap__infoRow">
            <span className="ap__infoLabel">Returns</span>
            <button className="ap__linkBtn">30-day refund/replacement</button>
          </div>
          <div className="ap__infoRow">
            <span className="ap__infoLabel">Payment</span>
            <button className="ap__linkBtn">Secure transaction</button>
          </div>

          {certifications.length > 0 && (
            <div className="ap__certs">
              {certifications.map(cert => (
                <span key={cert.name} className="ap__cert">
                  <Award size={12} />
                  {cert.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GREEN ALTERNATIVES SECTION */}
      <section className="recommendations-section">
        <div className="rec-header">
          <div className="rec-title">
            <Leaf className="rec-icon" size={28} />
            <h2>Greener Alternatives</h2>
            <span className="rec-subtitle">Better for you, better for the planet</span>
          </div>
          {recommendations?.gecko_coins_earned && (
            <div className="bonus-coins">
              <span className="bonus-text">Earn up to</span>
              <span className="bonus-amount">{recommendations.gecko_coins_earned}</span>
              <span className="bonus-label">bonus coins</span>
            </div>
          )}
        </div>

        {loadingRecs ? (
          <div className="rec-loading">
            <div className="loading-spinner"></div>
            <p>Finding greener alternatives...</p>
          </div>
        ) : recommendations?.alternatives ? (
          <div className="alternatives-grid">
            {recommendations.alternatives.map((alt, index) => (
              <div
                key={alt.product_id}
                className="alternative-card"
                onClick={() => handleAlternativeClick(alt.product_id)}
              >
                <div className="alt-badge">
                  <Leaf size={12} />
                  {Math.round(alt.green_score * 100)}% Green
                </div>
                
                <div className="alt-image-container">
                  <img src={alt.image_url} alt={alt.name} className="alt-image" />
                  <div className="alt-overlay">
                    <span className="view-product">View Product</span>
                  </div>
                </div>

                <div className="alt-content">
                  <h3 className="alt-name">{alt.name}</h3>
                  
                  <div className="alt-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < alt.rating ? "#f0c14b" : "none"}
                        color={i < alt.rating ? "#f0c14b" : "#ccc"}
                      />
                    ))}
                    <span className="alt-rating-text">{alt.rating}</span>
                  </div>

                  <div className="alt-price">₹{alt.price.toFixed(2)}</div>

                  <div className="alt-benefits">
                    <div className="benefit-item">
                      <div className="benefit-icon sustainability">🌱</div>
                      <span>Sustainability: {alt.sustainability_score}%</span>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon carbon">🌍</div>
                      <span>{alt.savings}</span>
                    </div>
                  </div>

                  <div className="alt-footer">
                    <span className="carbon-footprint">
                      Carbon: {alt.carbon_emission_kg}kg CO₂
                    </span>
                    <div className="alt-cta">
                      <ShoppingCart size={14} />
                      <span>Switch & Save</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rec-empty">
            <Leaf size={48} className="empty-icon" />
            <p>No green alternatives found for this product.</p>
          </div>
        )}
      </section>
    </div>
  );
}