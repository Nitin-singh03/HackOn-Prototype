import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Checkout.css";
import CheckoutProduct from "./CheckoutProduct";
import { Link } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart]       = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/cart");
        setCart(data);
      } catch {
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateItem = async (productId, qty) => {
    try {
      const { data } = await axios.post("/api/cart", { productId, qty });
      setCart(data);
    } catch {
      setError("Could not update cart.");
    }
  };

  const removeItem = id => updateItem(id, 0);
  const changeQty  = (id, qty) => updateItem(id, qty);

  // Totals
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping  = itemCount === 0 || subtotal > 1000 ? 0 : 50;

  // Compute total coins across all items
  const { totalGecko, totalCanopy } = cart.items.reduce(
    (totals, { product, quantity }) => {
      const ecoScore = product.eco?.ecoScore ?? 0;
      const per100   =
        ecoScore >= 90 ? 15 :
        ecoScore >= 75 ? 12 :
        ecoScore >= 60 ? 8  :
        ecoScore >= 40 ? 4  : 0;

      const unit = Math.floor((product.price * per100) / 100);
      totals.totalGecko  += unit * quantity;
      totals.totalCanopy += unit * quantity;
      return totals;
    },
    { totalGecko: 0, totalCanopy: 0 }
  );

  return (
    <div className="checkout">
      <div className="checkout__left">
        <Link to="/" className="checkout__backLink">← Continue Shopping</Link>
        <h2 className="checkout__title">Your Shopping Basket</h2>

        {loading && <p>Loading cart…</p>}
        {error   && <p className="checkout__error">{error}</p>}

        {!loading && cart.items.length === 0 && (
          <div className="checkout__empty">
            <h3>Your Cart is empty</h3>
            <p>
              You have no items in your cart.{" "}
              <Link to="/">Go back to shopping.</Link>
            </p>
          </div>
        )}

        {!loading && cart.items.length > 0 && (
          <div className="checkout__items">
            {cart.items.map(item => (
              <CheckoutProduct
                key={item.product._id}
                product={item.product}
                quantity={item.quantity}
                onRemove={() => removeItem(item.product._id)}
                onQtyChange={newQty => changeQty(item.product._id, newQty)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="checkout__right">
        <div className="checkout__summary">
          <h3>Order Summary</h3>
          <p>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <strong>₹{subtotal.toFixed(2)}</strong></p>
          <p>Estimated Shipping: <strong>₹{shipping.toFixed(2)}{shipping === 0 ? " (Free)" : ""}</strong></p>
          <hr/>
          <p className="checkout__total">Order Total: <strong>₹{(subtotal + shipping).toFixed(2)}</strong></p>
          <hr/>

          {/* show total coins with icons */}
          <div className="summary__coins">
            <img className="coin-icon" src="/images/gecko_coin.png" alt="Gecko Coin"/>
            <span>{totalGecko}</span>
            <img className="coin-icon" src="/images/canopy_coin.png" alt="Canopy Coin"/>
            <span>{totalCanopy}</span>
          </div>

          <button
            className="checkout__placeOrderBtn"
            disabled={cart.items.length === 0}
          >
            Place your Order
          </button>
        </div>
      </div>
    </div>
  );
}
