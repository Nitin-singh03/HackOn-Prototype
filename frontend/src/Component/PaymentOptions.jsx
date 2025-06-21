import React, { useState } from 'react';

const PaymentOptions = () => {
  const [selectedPayment, setSelectedPayment] = useState('card');

  return (
    <div className="payment-section">
      <h2>Payment Method</h2>
      
      <div className="payment-options">
        <div 
          className={`payment-option ${selectedPayment === 'card' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('card')}
        >
          <input 
            type="radio" 
            name="payment" 
            value="card" 
            checked={selectedPayment === 'card'}
            onChange={() => setSelectedPayment('card')}
          />
          <div className="payment-info">
            <div className="payment-title">Credit or debit card</div>
            <div className="card-icons">
              <span className="card-icon visa">VISA</span>
              <span className="card-icon mastercard">MC</span>
              <span className="card-icon amex">AMEX</span>
            </div>
          </div>
        </div>

        <div 
          className={`payment-option ${selectedPayment === 'amazon-pay' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('amazon-pay')}
        >
          <input 
            type="radio" 
            name="payment" 
            value="amazon-pay" 
            checked={selectedPayment === 'amazon-pay'}
            onChange={() => setSelectedPayment('amazon-pay')}
          />
          <div className="payment-info">
            <div className="payment-title">Amazon Pay</div>
            <div className="payment-subtitle">Use your Amazon account</div>
          </div>
        </div>

        <div 
          className={`payment-option ${selectedPayment === 'gift-card' ? 'selected' : ''}`}
          onClick={() => setSelectedPayment('gift-card')}
        >
          <input 
            type="radio" 
            name="payment" 
            value="gift-card" 
            checked={selectedPayment === 'gift-card'}
            onChange={() => setSelectedPayment('gift-card')}
          />
          <div className="payment-info">
            <div className="payment-title">Gift card</div>
            <div className="payment-subtitle">Apply gift card balance</div>
          </div>
        </div>
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