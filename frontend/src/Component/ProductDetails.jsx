import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError]   = useState("");
  const [rating] = useState(() => Math.floor(Math.random() * 5) + 1);
  const [ratingCount] = useState(
    () => Math.floor(Math.random() * (5000 - 200) + 200)
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        setError("Failed to load product details.");
      }
    })();
  }, [id]);

  if (error)   return <div className="pd__error">{error}</div>;
  if (!product) return <div className="pd__loading">Loading…</div>;

  const {
    name,
    image,
    price,
    description,
    countInStock,
    brand,
    category,
    materialComposition = [],
    certifications = [],
    eco: {
      ecoScore = 0,
      matScore = 0,
      manufScore = 0,
      transScore = 0,
      pkgScore = 0,
      bonusScore = 0,
    } = {}
  } = product;

  // Eco grade
  const ecoGrade =
    ecoScore >= 90 ? "A+" :
    ecoScore >= 75 ? "A"  :
    ecoScore >= 60 ? "B"  :
    ecoScore >= 40 ? "C"  : "D";

  // coin percentages
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
      ecoScore >= 40 ? 4  : 0,
  };

  const totalGecko  = Math.floor((price * per100.gecko)  / 100);
  const totalCanopy = Math.floor((price * per100.canopy) / 100);

  // simulate shipping & delivery
  const shippingFee = 28.44;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const deliveryStr = deliveryDate.toLocaleString("default", {
    month: "long", day: "numeric"
  });

  return (
    <div className="pd pd--amazon">
      {/* IMAGE COLUMN */}
      <div className="pd__col pd__col--image">
        <img src={image} alt={name} className="pd__image" />
      </div>

      {/* DETAILS + ECO/COINS COLUMN */}
      <div className="pd__col pd__col--details">
        <h1 className="pd__title">{name}</h1>
        {brand && <div className="pd__brand">Brand: {brand}</div>}
        {category && <div className="pd__category">Category: {category}</div>}

        <div className="pd__rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`pd__star ${i < rating ? "filled" : ""}`}>★</span>
          ))}
          <span className="pd__ratingCount">{ratingCount.toLocaleString()} ratings</span>
        </div>

        <div className="pd__priceLarge">₹{price.toFixed(2)}</div>
        <div className={`pd__stock ${countInStock>0?"in":"out"}`}>
          {countInStock>0?"In Stock":"Out of Stock"}
        </div>

        <p className="pd__desc">{description}</p>

        {/* ECO BREAKDOWN */}
        <section className="pd__eco pd__panel">
          <h3 className="pd__ecoHeading">
            🌱 Eco Score: <span className={`pd__ecoGrade grade-${ecoGrade}`}>{ecoGrade}</span> ({ecoScore.toFixed(1)})
          </h3>
          <div className="pd__ecoGrid">
            <div className="pd__ecoMetric">🌿 Material: {(matScore*100).toFixed(0)}%</div>
            <div className="pd__ecoMetric">🏭 Manufacturing: {(manufScore*100).toFixed(0)}%</div>
            <div className="pd__ecoMetric">🚚 Transport: {(transScore*100).toFixed(0)}%</div>
            <div className="pd__ecoMetric">📦 Packaging: {(pkgScore*100).toFixed(0)}%</div>
            <div className="pd__ecoMetric">✨ Bonus: {(bonusScore*100).toFixed(0)}%</div>
          </div>

          <h4 className="pd__subheading">Composition</h4>
          <ul className="pd__comp">
            {materialComposition.map((c,i) => (
              <li key={i}>
                <strong>{c.name}</strong>: {(c.ratio*100).toFixed(0)}% <em>(footprint {(c.footprint*100).toFixed(0)}%)</em>
              </li>
            ))}
          </ul>

          {certifications.length>0 && (
            <>
              <h4 className="pd__subheading">Certifications</h4>
              <div className="pd__certsHorizontal">
                {certifications.map((cert,i) => <span key={i} className="pd__certBox">🏅 {cert}</span>)}
              </div>
            </>
          )}
        </section>

        {/* COINS PANEL */}
        <section className="pd__coins pd__panel">
          <div className="pd__coinItem">
            <img src="/images/gecko_coin.png" alt="Gecko Coin" />
            <div>
              <span className="pd__coinCount">{totalGecko}</span>
              <small>Gecko Coins ({per100.gecko}% per ₹100)</small>
            </div>
          </div>
          <div className="pd__coinItem">
            <img src="/images/canopy_coin.png" alt="Canopy Coin" />
            <div>
              <span className="pd__coinCount">{totalCanopy}</span>
              <small>Canopy Coins ({per100.canopy}% per ₹100)</small>
            </div>
          </div>
        </section>
      </div>

      {/* AMAZON‑STYLE BUY BOX */}
      <div className="pd__col pd__col--buy amazon-panel">
        <div className="ap__price">₹{price.toFixed(2)}</div>
        <div className="ap__subtext">
          ₹{shippingFee.toFixed(2)} Shipping & Import Fees Deposit
          <button className="ap__detailsBtn">Details ▾</button>
        </div>
        <div className="ap__delivery">
          Delivery <strong>{deliveryStr}</strong>. Order within <strong>18 hrs 7 mins</strong>
        </div>
        <div className={`ap__stock ${countInStock>0?"in":"out"}`}>
          {countInStock>0?"In Stock":"Out of Stock"}
        </div>
        {countInStock>0 && (
          <div className="ap__qty">
            <label htmlFor="qty">Quantity:</label>
            <select id="qty" value={qty} onChange={e=>setQty(+e.target.value)}>
              {[...Array(Math.min(countInStock,5)).keys()].map(x=>(
                <option key={x+1} value={x+1}>{x+1}</option>
              ))}
            </select>
          </div>
        )}
        <button
          className="ap__btn ap__btn--cart"
          disabled={countInStock===0}
          onClick={()=>navigate(`/cart/${id}?qty=${qty}`)}
        >
          Add to Cart
        </button>
        <button
          className="ap__btn ap__btn--buy"
          disabled={countInStock===0}
          onClick={()=>navigate(`/checkout/${id}?qty=${qty}`)}
        >
          Buy Now
        </button>
        <div className="ap__infoRow"><span className="ap__infoLabel">Ships from</span><span className="ap__infoValue">Amazon.com</span></div>
        <div className="ap__infoRow"><span className="ap__infoLabel">Sold by</span><span className="ap__infoValue">Amazon.com</span></div>
        <div className="ap__infoRow"><span className="ap__infoLabel">Returns</span><button className="ap__linkBtn">30-day refund/replacement</button></div>
        <div className="ap__infoRow"><span className="ap__infoLabel">Payment</span><button className="ap__linkBtn">Secure transaction</button></div>
        {certifications.length>0 && (
          <div className="ap__certs">
            {certifications.map(cert=>(
              <span key={cert} className="ap__cert">{cert}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}