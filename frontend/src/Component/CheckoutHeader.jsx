import React from 'react';

const CheckoutHeader = () => {
  return (
    <header className="checkout-header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="amazon-logo">amazon</h1>
          <span className="checkout-text">Checkout</span>
        </div>
        <div className="security-badge">
          <span className="lock-icon">🔒</span>
          <span>Secure Checkout</span>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;