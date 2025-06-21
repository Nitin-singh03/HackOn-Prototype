// src/components/Checkout.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Checkout.css";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart]       = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Fetch cart on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/cart");
        // Expect data shape: { items: [ { product: {...}, quantity: n }, ... ] }
        // Defensive: check data.items is array
        if (data && Array.isArray(data.items)) {
          setCart(data);
        } else {
          console.warn("Checkout: unexpected cart data:", data);
          setCart({ items: [] });
        }
      } catch (err) {
        console.error("Checkout: failed to load cart", err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update an item in cart via API
  const updateItem = async (productId, qty) => {
    try {
      const { data } = await axios.post("/api/cart", { productId, qty });
      if (data && Array.isArray(data.items)) {
        setCart(data);
      } else {
        console.warn("Checkout.updateItem: unexpected response:", data);
      }
    } catch (err) {
      console.error("Checkout: could not update cart", err);
      setError("Could not update cart.");
    }
  };

  const removeItem = id => updateItem(id, 0);
  const changeQty  = (id, qty) => updateItem(id, qty);

  // Totals: defensive checks
  const itemCount = Array.isArray(cart.items)
    ? cart.items.reduce((sum, i) => {
        const q = typeof i.quantity === 'number' && !isNaN(i.quantity) ? i.quantity : 0;
        return sum + q;
      }, 0)
    : 0;

  const subtotal = Array.isArray(cart.items)
    ? cart.items.reduce((sum, i) => {
        const price = i.product && typeof i.product.price === 'number' && !isNaN(i.product.price)
          ? i.product.price
          : 0;
        const q = typeof i.quantity === 'number' && !isNaN(i.quantity) ? i.quantity : 0;
        return sum + price * q;
      }, 0)
    : 0;

  const shipping = itemCount === 0 || subtotal > 1000 ? 0 : 50;

  // Compute total coins across all items
  const { totalGecko, totalCanopy } = Array.isArray(cart.items)
    ? cart.items.reduce(
        (totals, { product, quantity }) => {
          const price = product && typeof product.price === 'number' && !isNaN(product.price)
            ? product.price
            : 0;
          // defensive ecoScore
          const ecoScore = product && product.eco && typeof product.eco.ecoScore === 'number'
            ? product.eco.ecoScore
            : 0;
          const per100 =
            ecoScore >= 90 ? 15 :
            ecoScore >= 75 ? 12 :
            ecoScore >= 60 ? 8  :
            ecoScore >= 40 ? 4  : 0;
          const unit = Math.floor((price * per100) / 100);
          const q = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 0;
          totals.totalGecko  += unit * q;
          totals.totalCanopy += unit * q;
          return totals;
        },
        { totalGecko: 0, totalCanopy: 0 }
      )
    : { totalGecko: 0, totalCanopy: 0 };

  // Handler for Place Order button
  const handlePlaceOrder = () => {
    // Build itemsPayload with consistent field 'qty'
    const itemsPayload = Array.isArray(cart.items)
      ? cart.items.map(item => {
          const productId = item.product && item.product._id ? item.product._id : null;
          const qty = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 0;
          if (!productId) {
            console.warn("Checkout.handlePlaceOrder: missing productId in item", item);
          }
          return { productId, qty };
        }).filter(it => it.productId != null)
      : [];

    const coinsPayload = { totalGecko, totalCanopy };

    // Optionally include costs:
    const costPayload = {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping,
      total: parseFloat((subtotal + shipping).toFixed(2))
    };

    console.log("Checkout: navigating to BuyOptions with", { itemsPayload, coinsPayload, costPayload });

    navigate('/buyOptions', {
      state: {
        items: itemsPayload,
        coins: coinsPayload,
        cost: costPayload
      }
    });
  };

  return (
    <div className="checkout">
      <div className="checkout__left">
        <Link to="/" className="checkout__backLink">← Continue Shopping</Link>
        <h2 className="checkout__title">Your Shopping Basket</h2>

        {loading && <p>Loading cart…</p>}
        {error   && <p className="checkout__error">{error}</p>}

        {!loading && Array.isArray(cart.items) && cart.items.length === 0 && (
          <div className="checkout__empty">
            <h3>Your Cart is empty</h3>
            <p>
              You have no items in your cart.{" "}
              <Link to="/">Go back to shopping.</Link>
            </p>
          </div>
        )}

        {!loading && Array.isArray(cart.items) && cart.items.length > 0 && (
          <div className="checkout__items">
            {cart.items.map(item => (
              <CheckoutProduct
                key={item.product?._id || Math.random()}
                product={item.product}
                quantity={item.quantity}
                onRemove={() => item.product?._id && removeItem(item.product._id)}
                onQtyChange={newQty => item.product?._id && changeQty(item.product._id, newQty)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="checkout__right">
        <div className="checkout__summary">
          <h3>Order Summary</h3>
          <p>
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
            <strong>₹{subtotal.toFixed(2)}</strong>
          </p>
          <p>
            Estimated Shipping:{" "}
            <strong>
              ₹{shipping.toFixed(2)}{shipping === 0 ? " (Free)" : ""}
            </strong>
          </p>
          <hr/>
          <p className="checkout__total">
            Order Total: <strong>₹{(subtotal + shipping).toFixed(2)}</strong>
          </p>
          <hr/>

          {/* Show total coins with icons */}
          <div className="summary__coins">
            <img className="coin-icon" src="/images/gecko_coin.png" alt="Gecko Coin"/>
            <span>{totalGecko}</span>
            <img className="coin-icon" src="/images/canopy_coin.png" alt="Canopy Coin"/>
            <span>{totalCanopy}</span>
          </div>

          <button
            className="checkout__placeOrderBtn"
            disabled={!Array.isArray(cart.items) || cart.items.length === 0}
            onClick={handlePlaceOrder}
          >
            Place your Order
          </button>
        </div>
      </div>
    </div>
  );
}
