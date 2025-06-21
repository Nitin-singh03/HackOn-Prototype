import React from 'react';

const OrderSummary = ({ items = [], loading, error, coins = 0, cost = 0 }) => {
  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  const itemsTotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = 0;
  const tax = parseFloat((itemsTotal * 0.1).toFixed(2)); // 10% example
  const orderTotal = (itemsTotal + shipping + tax).toFixed(2);

  const renderCoinRows = () => {
    if (coins && typeof coins === 'object' && !Array.isArray(coins)) {
      return Object.entries(coins).map(([type, amount]) => (
        <div className="price-row coins-earned" key={type}>
          <span>{type.charAt(0).toUpperCase() + type.slice(1)} Coins Earned:</span>
          <span>{amount}</span>
        </div>
      ));
    }
    return (
      <div className="price-row coins-earned">
        <span>Coins Earned:</span>
        <span>{coins}</span>
      </div>
    );
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {items.map((it) => (
        <div className="order-item" key={it.productId}>
          <img
            src={it.image || 'https://via.placeholder.com/80'}
            alt={it.name}
            className="product-image"
          />
          <div className="item-details">
            <h3>{it.name}</h3>
            <p className="item-price">₹{it.price.toFixed(2)}</p>
            <p className="item-qty">Qty: {it.qty}</p>
          </div>
        </div>
      ))}
      <div className="price-breakdown">
        <div className="price-row">
          <span>Items:</span>
          <span>{itemsTotal.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span>Shipping & handling:</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
        <div className="price-row">
          <span>Tax:</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="price-row total">
          <span>Order total:</span>
          <span>₹{orderTotal}</span>
        </div>
        {renderCoinRows()}
      </div>
    </div>
  );
};

export default OrderSummary;
