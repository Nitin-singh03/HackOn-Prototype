import React, { useState } from 'react';

const PaymentOptions = () => {
  const [selectedPayment, setSelectedPayment] = useState('card');

  const paymentMethods = [
    {
      key: 'card',
      title: 'Credit or debit card',
      icons: ['VISA', 'MC', 'AMEX']
    },
    {
      key: 'amazon-pay',
      title: 'Amazon Pay',
      subtitle: 'Use your Amazon account'
    },
    {
      key: 'gift-card',
      title: 'Gift card',
      subtitle: 'Apply gift card balance'
    }
  ];

  return (
    <div className="payment-section">
      <h2>Payment Method</h2>
      <div className="payment-options">
        {paymentMethods.map(({ key, title, subtitle, icons }) => (
          <div
            key={key}
            className={`payment-option ${selectedPayment === key ? 'selected' : ''}`}
            onClick={() => setSelectedPayment(key)}
          >
            <div className="payment-info">
              <div className="payment-title">{title}</div>
              {subtitle && <div className="payment-subtitle">{subtitle}</div>}
              {icons && (
                <div className="card-icons">
                  {icons.map((icon) => (
                    <span key={icon} className={`card-icon ${icon.toLowerCase()}`}>
                      {icon}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPayment === 'card' && (
        <div className="card-form">
          <div className="form-row">
            <input type="text" placeholder="Card number" className="card-input" />
          </div>
          <div className="form-row-split">
            <input type="text" placeholder="MM/YY" className="card-input small" />
            <input type="text" placeholder="CVV" className="card-input small" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Name on card" className="card-input" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
