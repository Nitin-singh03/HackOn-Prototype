// File: RedeemPage.jsx
import React, { useState } from 'react';
import '../Css/Redeem.css'; // your styling

// Add your own image URLs below (replace placeholder URLs)
const REDEEM_OPTIONS = [
  {
    id: 1,
    title: '₹100 Amazon Coupon',
    cost: 100,
    image: 'https://www.extensiv.com/hubfs/Skubana/Blog%20Pages/Imported_Blog_Media/amazon%20coupons-4.jpg',
    description: 'Get a ₹100 off coupon for your next Amazon purchase.',
  },
  {
    id: 2,
    title: '₹250 Amazon Coupon',
    cost: 250,
    image: 'https://www.extensiv.com/hubfs/Skubana/Blog%20Pages/Imported_Blog_Media/amazon%20coupons-4.jpg',
    description: 'Get a ₹250 off coupon for your next Amazon purchase.',
  },
  {
    id: 3,
    title: 'Amazon Prime 1-Month',
    cost: 300,
    image: 'https://genflix.in/cdn/shop/files/1744640238012.jpg?v=1744648574',
    description: 'Enjoy one month of Amazon Prime membership.',
  },
  {
    id: 4,
    title: '₹500 Amazon Coupon',
    cost: 500,
    image: 'https://www.extensiv.com/hubfs/Skubana/Blog%20Pages/Imported_Blog_Media/amazon%20coupons-4.jpg',
    description: 'Get a ₹500 off coupon for your next Amazon purchase.',
  },
  {
    id: 5,
    title: '₹100 Gift Card',
    cost: 150,
    image: 'https://globalvisacards.com/yfoarist/2021/07/amazon-gift-cards.png',
    description: 'Redeem for a ₹100 store gift card.',
  },
  {
    id: 6,
    title: '₹200 Gift Card',
    cost: 300,
    image: 'https://globalvisacards.com/yfoarist/2021/07/amazon-gift-cards.png',
    description: 'Redeem for a ₹200 store gift card.',
  },
  {
    id: 7,
    title: 'Charity Donation',
    cost: 400,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB7_N9oSbfEsv8iG0RvB1L7pOVNCUeeyYiyA&s',
    description: 'Donate to an environmental charity on your behalf.',
  },
  {
    id: 8,
    title: 'Mystery Box',
    cost: 500,
    image: 'https://u-mercari-images.mercdn.net/photos/m34066328833_1.jpg',
    description: 'Get a surprise eco-friendly gift box.',
  },
];

export default function Redeem() {
  const [loadingMap, setLoadingMap] = useState({});
  const [redeemedMap, setRedeemedMap] = useState({});

  const handleRedeem = (id) => {
    if (loadingMap[id] || redeemedMap[id]) return;

    setLoadingMap(prev => ({ ...prev, [id]: true }));
    // Simulate API call / processing delay
    setTimeout(() => {
      setLoadingMap(prev => ({ ...prev, [id]: false }));
      setRedeemedMap(prev => ({ ...prev, [id]: true }));
      // TODO: call your backend redemption endpoint here
    }, 2000);
  };

  return (
    <div className="redeem-container">
      <h1>Redeem Your Gecko Points</h1>
      <div className="redeem-grid">
        {REDEEM_OPTIONS.map(opt => (
          <div key={opt.id} className="redeem-card">
            <img src={opt.image} alt={opt.title} className="card-image" />
            <div className="card-body">
              <h2>{opt.title}</h2>
              <p>{opt.description}</p>
              <div className="card-footer">
                <span className="cost">{opt.cost} pts</span>
                <button
                  className="redeem-btn"
                  onClick={() => handleRedeem(opt.id)}
                  disabled={loadingMap[opt.id] || redeemedMap[opt.id]}
                >
                  {loadingMap[opt.id]
                    ? 'Redeeming…'
                    : redeemedMap[opt.id]
                      ? 'Redeemed'
                      : 'Redeem'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
