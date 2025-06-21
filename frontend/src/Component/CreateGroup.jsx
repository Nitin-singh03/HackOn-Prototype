// GroupPurchase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck } from 'lucide-react';
import '../Css/CreateGroup.css'; // adjust path if needed

// Hardcoded joiners data declared outside so reference is stable
const JOINERS = [
  { id: 'ftefw67', name: 'John Doe',    avatarUrl: '', location: 'Chennai',   amount: 300, qty: 1 },
  { id: 'abc1234', name: 'Jane Smith',  avatarUrl: '', location: 'Chennai',    amount: 400, qty: 2 },
  { id: 'xyz7890', name: 'Bob Lee',     avatarUrl: '', location: 'Chennai',     amount: 500, qty: 1 },
  { id: 'pqr4567', name: 'Alice Ray',   avatarUrl: '', location: 'Chennai', amount: 1200, qty: 3 }
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

  // Use passed state or fallback
  const initialUser = location.state?.user || demoUser;
  const itemsInput = Array.isArray(location.state?.items) && location.state.items.length
    ? location.state.items
    : demoItems;
  const threshold = typeof location.state?.threshold === 'number'
    ? location.state.threshold
    : demoThreshold;

  // --- State for order details ---
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState('');

  // --- State for participants simulation ---
  const [participants, setParticipants] = useState([]);
  const [collectiveTotal, setCollectiveTotal] = useState(0);
  const [collectiveQty, setCollectiveQty] = useState(0);
  const [groupReady, setGroupReady] = useState(false);

  // Ref for tracking timeouts so we can clear on cleanup
  const timeoutsRef = useRef([]);

  // --- 1. Fetch product details ---
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      setDetailsError('');
      try {
        const details = [];
        for (const it of itemsInput) {
          try {
            const res = await axios.get(`/api/products/${it.productId}`);
            const prod = res.data;
            details.push({
              productId: it.productId,
              name: prod.name || `Product ${it.productId}`,
              price: typeof prod.price === 'number' ? prod.price : 0,
              qty: it.qty
            });
          } catch {
            // On error fetching a product, use placeholder with price 0
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

  // --- 2. Initialize participants & schedule joiners once after details load ---
  useEffect(() => {
    // Only run when loading finishes and we have orderItems
    if (loadingDetails) return;
    if (!orderItems.length) return;

    // Clear any previous timeouts (e.g., if re-running due to initialUser/items change)
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Compute base amount & qty for initial user
    const baseAmt = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const baseQty = orderItems.reduce((sum, it) => sum + it.qty, 0);

    const initialParticipant = {
      id: initialUser.id,
      name: initialUser.name,
      avatarUrl: initialUser.avatarUrl,
      location: initialUser.location,
      amount: baseAmt,
      qty: baseQty
    };

    // Set initial participant
    setParticipants([initialParticipant]);
    setCollectiveTotal(baseAmt);
    setCollectiveQty(baseQty);
    setGroupReady(baseAmt >= threshold);

    // If initial alone meets threshold, skip scheduling
    if (baseAmt >= threshold) {
      return;
    }

    // Schedule joiners in sequence
    const baseDelays = [2000, 3000, 2000, 2000]; // ms for each joiner
    // If JOINERS length differs, fallback to 2000ms for extra
    const delays = JOINERS.map((_, idx) => baseDelays[idx] ?? 2000);

    let cumDelay = 0;
    JOINERS.forEach((joiner, idx) => {
      cumDelay += delays[idx];
      const t = setTimeout(() => {
        setParticipants(prev => {
          // Prevent duplicate if same ID already added
          if (prev.some(p => p.id === joiner.id)) return prev;

          const combined = [...prev, joiner];
          // Recalculate totals
          const totalAmt = combined.reduce((s, p) => s + p.amount, 0);
          const totalQty = combined.reduce((s, p) => s + p.qty, 0);
          setCollectiveTotal(totalAmt);
          setCollectiveQty(totalQty);

          // If threshold now met or exceeded, mark ready.
          if (totalAmt >= threshold) {
            setGroupReady(true);
            // Optionally clear remaining scheduled joiners:
            // timeoutsRef.current.forEach(clearTimeout);
          }
          return combined;
        });
      }, cumDelay);
      timeoutsRef.current.push(t);
    });

    // Cleanup when effect is re-run or component unmounts
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  // Depend on loadingDetails, orderItems, initialUser.id, threshold:
  // - loadingDetails: we wait until loading finishes.
  // - orderItems: when product details change, re-run initialization.
  // - initialUser.id (or initialUser): if initial user changes, re-init.
  // - threshold: if threshold changes, re-init and re-check.
  }, [loadingDetails, orderItems, initialUser.id, threshold]);

  // --- Handler to place order ---
  const handlePlaceOrder = () => {
    navigate('/buy', {
      state: {
        items: orderItems,
        coins: { gecko: 20 },
        freeDelivery: true,
        participants
      }
    });
  };

  const totalCoins = participants.length * 20;

  // --- Render UI ---
  return (
    <div className="gp-container">
      {/* Participants Panel */}
      <div className="gp-participants-panel">
        <h2 className="gp-heading">Group Participants</h2>
        <AnimatePresence>
          {participants.map((p, i) => {
            const isInitial = p.id === initialUser.id;
            const displayName = isInitial ? 'You' : p.name;
            return (
              <motion.div
                key={p.id + '-' + i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`gp-card${isInitial ? ' gp-card-initial' : ''}`}
              >
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

      {/* Order Panel */}
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
                <div className="gp-ready-row"><span>Total Gecko coins: {totalCoins}</span></div>
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
