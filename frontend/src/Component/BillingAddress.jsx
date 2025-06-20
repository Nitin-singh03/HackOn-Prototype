import React, { useState } from 'react';

const BillingAddress = () => {
  const [sameAsShipping, setSameAsShipping] = useState(true);

  return (
    <div className="billing-section">
      <h2>Billing Address</h2>
      
      <div className="address-option">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
          />
          <span className="checkmark"></span>
          Use shipping address as billing address
        </label>
      </div>

      {!sameAsShipping && (
        <div className="address-form">
          <div className="form-row">
            <input type="text" placeholder="Full name" className="address-input" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Address line 1" className="address-input" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Address line 2 (optional)" className="address-input" />
          </div>
          <div className="form-row-split">
            <input type="text" placeholder="City" className="address-input" />
            <select className="address-input">
              <option>State</option>
              <option>CA</option>
              <option>NY</option>
              <option>TX</option>
            </select>
            <input type="text" placeholder="ZIP code" className="address-input" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;