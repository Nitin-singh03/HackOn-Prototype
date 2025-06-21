// src/components/BuyOptions.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Css/BuyOptions.css';

export default function BuyOptions({ items: propItems, coins: propCoins, cost: propCost }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer props, fallback to location.state
  const items = Array.isArray(propItems) && propItems.length > 0
    ? propItems
    : (Array.isArray(location.state?.items) ? location.state.items : []);
  const coins = (propCoins && typeof propCoins.gecko === 'number' && typeof propCoins.canopy === 'number')
    ? propCoins
    : (location.state?.coins ?? { gecko: 0, canopy: 0 });
  const cost = propCost
    ? propCost
    : (location.state?.cost ?? { subtotal: 0, shipping: 0, total: 0 });

  // Redirect or warn if no items
  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) {
      console.warn('BuyOptions: no items provided in props or location.state');
      // Optionally: navigate back to checkout
    } else {
      console.log('BuyOptions: items, coins, cost:', items, coins, cost);
    }
  }, [items, coins, cost]);

  const handleBuyNow = () => {
    navigate('/payment', { state: { items, coins, cost } });
  };

  const handleCreateGroup = () => {
    navigate('/create-group', { state: { items, coins, cost } });
  };

  const handleJoinGroup = () => {
    navigate('/join-group', { state: { items, coins, cost } });
  };

  return (
    <div className="buyoptions-container">
      <h2>Choose Your Purchase Option</h2>
      {(!Array.isArray(items) || items.length === 0) ? (
        <p className="warning-text">No items selected. Please add items before proceeding.</p>
      ) : (
        <div className="options-grid">
          {/* Buy Individually */}
          <div
            className="option-card card-buy"
            onClick={handleBuyNow}
            style={{ cursor: 'pointer' }}
          >
            <span className="emoji">🛒</span>
            <div>
              <h3>Buy Individually</h3>
              <p>Purchase products on your own.</p>
            </div>
            <span className="btn blue-btn">Buy Now</span>
          </div>

          {/* Create Community Group */}
          <div
            className="option-card card-create"
            onClick={handleCreateGroup}
            style={{ cursor: 'pointer' }}
          >
            <span className="emoji">🌱</span>
            <div>
              <h3>Create Community Group</h3>
              <p>Start a group purchase with others.</p>
              <p className="highlight">
                Reduce carbon footprint & save more together!<br />
                Get 20 coins each when total reaches ₹2000 in community
              </p>
            </div>
            <span className="btn green-btn">Create Group</span>
          </div>

          {/* Join Community Group */}
          <div
            className="option-card card-join"
            onClick={handleJoinGroup}
            style={{ cursor: 'pointer' }}
          >
            <span className="emoji">🤝</span>
            <div>
              <h3>Join Community Group</h3>
              <p>Join an existing group purchase.</p>
              <p className="highlight">
                Be eco-friendly & enjoy group discounts!<br />
                Get 20 coins each when total reaches ₹2000 in community
              </p>
            </div>
            <span className="btn green-btn">Join Group</span>
          </div>
        </div>
      )}
    </div>
  );
}
