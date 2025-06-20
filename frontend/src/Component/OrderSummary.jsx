import React from 'react';

const OrderSummary = () => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="order-item">
        <img 
          src="https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
          alt="Product" 
          className="product-image"
        />
        <div className="item-details">
          <h3>Premium Wireless Headphones</h3>
          <p className="item-price">$149.99</p>
          <p className="item-qty">Qty: 1</p>
        </div>
      </div>
      
      <div className="price-breakdown">
        <div className="price-row">
          <span>Items:</span>
          <span>$149.99</span>
        </div>
        <div className="price-row">
          <span>Shipping & handling:</span>
          <span>FREE</span>
        </div>
        <div className="price-row">
          <span>Tax:</span>
          <span>$12.75</span>
        </div>
        <div className="price-row total">
          <span>Order total:</span>
          <span>$162.74</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;