import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck } from 'lucide-react';
import '../Css/CreateGroup.css'; // adjust path if needed

// Hardcoded joiners data declared outside so reference is stable
const JOINERS = [
  { id: 'ftefw67', name: 'John Doe', avatarUrl: '', location: 'Chennai', amount: 300, qty: 1 },
  { id: 'abc1234', name: 'Jane Smith', avatarUrl: '', location: 'Chennai', amount: 400, qty: 2 },
  { id: 'xyz7890', name: 'Bob Lee', avatarUrl: '', location: 'Chennai', amount: 500, qty: 1 },
  { id: 'pqr4567', name: 'Alice Ray', avatarUrl: '', location: 'Chennai', amount: 1200, qty: 3 }
];

export default function GroupPurchase() {
  const location = useLocation();
  const navigate = useNavigate();

  const demoUser = {
    id: 'DemoUser',
    name: 'John Doe',
    avatarUrl: '',
    location: 'Wonderland'
  };
  const demoItems = [
    { productId: '123', qty: 2 },
    { productId: '456', qty: 1 }
  ];
  const demoThreshold = 2000;

  // Safely extract Gecko & Canopy coin counts
  const rawCoins = location.state?.coins || {};
  const initialGeckoCoins = typeof rawCoins === 'number'
    ? rawCoins
    : rawCoins.totalGecko ?? 0;
  const initialCanopyCoins = rawCoins.totalCanopy ?? 0;

  const threshold = typeof location.state?.threshold === 'number'
    ? location.state.threshold
    : demoThreshold;

  const itemsInput = Array.isArray(location.state?.items) && location.state.items.length
    ? location.state.items
    : demoItems;

  // --- State for order details ---
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState('');

  // --- State for participants simulation ---
  const [participants, setParticipants] = useState([]);
  const [collectiveTotal, setCollectiveTotal] = useState(0);
  const [collectiveQty, setCollectiveQty] = useState(0);
  const [groupReady, setGroupReady] = useState(false);

  const timeoutsRef = useRef([]);

  // Fetch product details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      setDetailsError('');
      try {
        const details = [];
        for (const it of itemsInput) {
          try {
            const res = await axios.get(`${API_BASE}/api/products/${it.productId}`);
            const prod = res.data;
            details.push({
              productId: it.productId,
              name: prod.name || `Product ${it.productId}`,
              price: typeof prod.price === 'number' ? prod.price : 0,
              qty: it.qty
            });
          } catch {
            details.push({
              productId: it.productId,
              name: `Product ${it.productId}`,
              price: 0,
              qty: it.qty
            });
          }
        }
        setOrderItems(details);
      } catch (err) {
        console.error(err);
        setDetailsError('Failed to load product details.');
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [itemsInput]);

  // Initialize participants & schedule joiners
  useEffect(() => {
    if (loadingDetails || !orderItems.length) return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const baseAmt = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const baseQty = orderItems.reduce((sum, it) => sum + it.qty, 0);

    const initialParticipant = {
      id: demoUser.id,
      name: demoUser.name,
      avatarUrl: demoUser.avatarUrl,
      location: demoUser.location,
      amount: baseAmt,
      qty: baseQty
    };

    setParticipants([initialParticipant]);
    setCollectiveTotal(baseAmt);
    setCollectiveQty(baseQty);
    setGroupReady(baseAmt >= threshold);

    if (baseAmt >= threshold) return;

    const baseDelays = [2000, 3000, 2000, 2000];
    const delays = JOINERS.map((_, idx) => baseDelays[idx] ?? 2000);
    let cumDelay = 0;

    JOINERS.forEach((joiner, idx) => {
      cumDelay += delays[idx];
      const t = setTimeout(() => {
        setParticipants(prev => {
          if (prev.some(p => p.id === joiner.id)) return prev;
          const combined = [...prev, joiner];
          const totalAmt = combined.reduce((s, p) => s + p.amount, 0);
          const totalQty = combined.reduce((s, p) => s + p.qty, 0);
          setCollectiveTotal(totalAmt);
          setCollectiveQty(totalQty);
          if (totalAmt >= threshold) setGroupReady(true);
          return combined;
        });
      }, cumDelay);
      timeoutsRef.current.push(t);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [loadingDetails, orderItems, threshold]);

  // Place order
  const handlePlaceOrder = () => {
    navigate('/payment', {
      state: {
        items: orderItems,
        coins: {
          totalGecko: initialGeckoCoins + 20,
          totalCanopy: initialCanopyCoins
        },
        freeDelivery: true,
        participants
      }
    });
  };

  const totalGeckoCoins = initialGeckoCoins + 20;
  const totalCanopyCoins = initialCanopyCoins;

  // Render
  return (
    <div className="gp-container">
      <div className="gp-participants-panel">
        <h2 className="gp-heading">Group Participants</h2>
        <AnimatePresence>
          {participants.map((p, i) => {
            const isInitial = p.id === demoUser.id;
            const displayName = isInitial ? 'You' : p.name;
            return (
              <motion.div
                key={p.id + '-' + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`gp-card${isInitial ? ' gp-card-initial' : ''}`}>
                <div className="gp-avatar">
                  {p.avatarUrl
                    ? <img src={p.avatarUrl} alt={displayName} className="gp-avatar-img" />
                    : <span className="gp-avatar-placeholder">{displayName.charAt(0)}</span>
                  }
                </div>
                <div className="gp-info">
                  <div className="gp-info-top">
                    <span className="gp-name">{displayName}</span>
                    <span className="gp-amount">₹{p.amount}</span>
                  </div>
                  <div className="gp-info-mid">
                    <span className="gp-qty">Qty: {p.qty}</span>
                    <span className="gp-coins">+20 Gecko</span>
                  </div>
                  <div className="gp-info-bottom">
                    <MapPin className="gp-icon" />
                    <span className="gp-location">{p.location}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {!groupReady && <p className="gp-waiting">Waiting for participants...</p>}
      </div>

      <div className="gp-order-panel">
        <h2 className="gp-heading">Your Order</h2>
        {loadingDetails ? (
          <p>Loading...</p>
        ) : detailsError ? (
          <p className="gp-error">{detailsError}</p>
        ) : (
          <>
            <ul className="gp-order-list">
              {orderItems.map(it => (
                <li key={it.productId} className="gp-order-item">
                  <div>
                    <p className="gp-item-name">{it.name}</p>
                    <p className="gp-item-sub">Qty: {it.qty} × ₹{it.price.toFixed(2)}</p>
                  </div>
                  <p className="gp-item-total">₹{(it.qty * it.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="gp-summary">
              <div className="gp-summary-row">
                <span>Your Total:</span>
                <span>₹{participants[0]?.amount.toFixed(2)}</span>
              </div>
            </div>
            {groupReady ? (
              <div className="gp-ready-section">
                <div className="gp-ready-row"><Truck className="gp-icon" /><span>Free delivery applied</span></div>
                <div className="gp-ready-row"><span>+20 Gecko coins each</span></div>
                <div className="gp-ready-row"><span>Your total Gecko coins: 20 + {initialGeckoCoins} = {totalGeckoCoins}</span></div>
                <div className="gp-ready-row"><span>Your Canopy coins: {totalCanopyCoins}</span></div>
                <button onClick={handlePlaceOrder} className="gp-button">Place Order</button>
              </div>
            ) : (
              <p className="gp-summary-needed">
                Collective ₹{collectiveTotal} / ₹{threshold} needed.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
