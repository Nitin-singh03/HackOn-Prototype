import React from "react";
import { Link } from "react-router-dom";
import "../Css/Checkout.css";

export default function CheckoutProduct({
  product,
  quantity,
  onRemove,
  onQtyChange
}) {
  const maxQty = Math.min(5, product.countInStock);

  // eco coins calc
  const ecoScore = product.eco?.ecoScore ?? 0;
  const per100   =
    ecoScore >= 90 ? 15 :
    ecoScore >= 75 ? 12 :
    ecoScore >= 60 ? 8  :
    ecoScore >= 40 ? 4  : 0;
  const unitCoins = Math.floor((product.price * per100) / 100);

  // fake rating for checkout list (or use product.rating if you have it)
  const ratingCount = product.ratingCount ||  Math.floor(Math.random() * 1000) + 50;

  return (
    <div className="checkoutProduct-card">
      <Link to={`/product/${product._id}`}>
        <img
          className="checkoutProduct-card__image"
          src={product.image_url}
          alt={product.name}
        />
      </Link>

      <div className="checkoutProduct-card__body">
        <Link to={`/product/${product._id}`} className="checkoutProduct-card__title">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="checkoutProduct-card__rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
          ))}
          <small>({ratingCount})</small>
        </div>

        {/* Short description */}
        <p className="checkoutProduct-card__desc">
          {product.description?.slice(0, 100)}…
        </p>

        <div className="checkoutProduct-card__footer">
          <div className="price-coins">
            <span className="price">₹{product.price.toFixed(2)}</span>
            <span className="coins">
              <img src="/images/gecko_coin.png" alt="G" className="coin-icon"/> {unitCoins}
            </span>
          </div>

          <div className="actions">
            <label>
              Qty:
              <select
                value={quantity}
                onChange={e => onQtyChange(Number(e.target.value))}
              >
                {[...Array(maxQty).keys()].map(x => (
                  <option key={x+1} value={x+1}>{x+1}</option>
                ))}
              </select>
            </label>
            <button
              className="remove-btn"
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
