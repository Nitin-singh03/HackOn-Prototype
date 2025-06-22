import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckoutHeader from './CheckoutHeader';
import OrderSummary from './OrderSummary';
import PaymentOptions from './PaymentOptions';
import DeliveryDatePicker from './DeliveryDatePicker';
import BillingAddress from './BillingAddress';
const API_BASE = import.meta.env.BACKEND_URL;

import '../App.css';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract items, coins object, and optional passed cost
  const { items: itemsInput = [], coins: rawCoins = {}, cost: passedCost } = location.state || {};

  // Safely unpack Gecko and Canopy
  const geckoFromState = typeof rawCoins === 'number'
    ? rawCoins
    : rawCoins.totalGecko ?? 0;
  const canopyFromState = rawCoins.totalCanopy ?? 0;

  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch product details
  useEffect(() => {
    if (!itemsInput.length) return;
    setLoadingDetails(true);
    setDetailsError('');

    (async () => {
      try {
        const details = await Promise.all(
          itemsInput.map(async ({ productId, qty = 1 }) => {
            try {
              const { data: prod } = await axios.get(`${API_BASE}/api/products/${productId}`);
              return {
                productId,
                name: prod.name || `Product ${productId}`,
                price: typeof prod.price === 'number' ? prod.price : 0,
                qty,
                image: prod.imageUrl || ''
              };
            } catch {
              return { productId, name: `Product ${productId}`, price: 0, qty, image: '' };
            }
          })
        );
        setOrderItems(details);
      } catch (err) {
        console.error(err);
        setDetailsError('Failed to load product details.');
      } finally {
        setLoadingDetails(false);
      }
    })();
  }, [itemsInput]);

  // Compute cost client-side to match server, then force into a Number
  const computedCost = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const costToSend = Number(passedCost !== undefined ? passedCost : computedCost);

  // debug log so you can inspect in the console
  console.log('🧮 costToSend is a', typeof costToSend, costToSend);

  const handlePlaceOrder = async () => {
    setSubmitError('');

    try {
      const response = await axios.post(`${API_BASE}/api/bought`, {
        items: orderItems,
        coins: {
          totalGecko: geckoFromState + 20,
          totalCanopy: canopyFromState
        },
        cost: costToSend
      });
      alert('Order placed successfully!');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Purchase error:', err.response || err.message);
      setSubmitError(
        err.response?.data?.error || 'Failed to place order. Please try again.'
      );
    }
  };

  return (
    <div className="App">
      {/* <CheckoutHeader /> */}
      <div className="checkout-container">
        <div className="checkout-main">
          <div className="checkout-form">
            <PaymentOptions />
            <DeliveryDatePicker />
            <BillingAddress />
          </div>
        </div>
        <div className="checkout-sidebar">
          <OrderSummary
            items={orderItems}
            loading={loadingDetails}
            error={detailsError}
            coins={{ totalGecko: geckoFromState, totalCanopy: canopyFromState }}
            cost={costToSend}
          />

          {submitError && <p className="error">{submitError}</p>}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loadingDetails || !orderItems.length}
          >
            {loadingDetails ? 'Loading...' : 'Place your order'}
          </button>

          <div className="order-disclaimer">
            By placing your order, you agree to Amazon's{' '}
            <a href="#">privacy notice</a> and{' '}
            <a href="#">conditions of use</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
