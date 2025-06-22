import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Css/SearchPage.css';

const CERTIFICATE_OPTIONS = [
  'ISO 14001','Energy Star','EU Ecolabel','Forest Stewardship Council',
  'Rainforest Alliance','Green Seal','CarbonNeutral®','USDA Organic',
  'FSC Certified','FSC Recycled','GOTS Certified','Global Recycled Standard',
  'USDA Biobased','EPA Safer Choice','Fair Trade Certified','Cradle to Cradle Certified'
];

const COMPANY_OPTIONS = [
  'EcoBrand Co.', 'GreenGoods Inc.', 'Sustainify LLC', 'NatureFirst Ltd.'
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword')?.trim() || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [cartState, setCartState] = useState({});

  const [showSort, setShowSort]     = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [sortCriteria, setSortCriteria]   = useState('ecoAsc');
  const [priceRange, setPriceRange]       = useState([0, 2000]);
  const [ecoRange, setEcoRange]           = useState([0, 100]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const sortRef = useRef();
  useEffect(() => {
    function onClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!keyword) return setProducts([]);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/products/search?keyword=${encodeURIComponent(keyword)}`
        );
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  function computeCoins(p) {
    const ecoScore = p.eco?.ecoScore ?? 0;
    const pct = ecoScore >= 90 ? 15
      : ecoScore >= 75 ? 12
      : ecoScore >= 60 ? 8
      : ecoScore >= 40 ? 4
      : 0;
    return Math.floor((p.price * pct) / 100);
  }

  const filtered = products
    .filter(p => {
      const eco = p.eco?.ecoScore ?? 0;
      if (eco < ecoRange[0] || eco > ecoRange[1]) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (
        selectedCerts.length &&
        !p.certifications?.some(c => selectedCerts.includes(c.name))
      ) return false;
      if (
        selectedCompanies.length &&
        !selectedCompanies.includes(p.company)
      ) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'ecoAsc':
          return (a.eco?.ecoScore || 0) - (b.eco?.ecoScore || 0);
        case 'ecoDesc':
          return (b.eco?.ecoScore || 0) - (a.eco?.ecoScore || 0);
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'companyAsc':
          return (a.company || '').localeCompare(b.company || '');
        case 'geckoDesc':
        case 'canopyDesc':
          return computeCoins(b) - computeCoins(a);
        default:
          return 0;
      }
    });

  const handleAddToCart = async (productId) => {
    setCartState(prev => ({
      ...prev,
      [productId]: { adding: true, added: false }
    }));

    try {
      const { data: updatedCart } = await axios.post("/api/cart", {
        productId,
        qty: 1
      });
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: updatedCart })
      );
      setCartState(prev => ({
        ...prev,
        [productId]: { adding: false, added: true }
      }));
      setTimeout(() => {
        setCartState(prev => ({
          ...prev,
          [productId]: { adding: false, added: false }
        }));
      }, 1500);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartState(prev => ({
        ...prev,
        [productId]: { adding: false, added: false }
      }));
    }
  };

  return (
    <div className="search-page-container">
      <div className="top-bar">
        <div ref={sortRef} className="sort-wrapper">
          <button
            className="top-bar__btn"
            onClick={() => setShowSort(!showSort)}
          >
            Sort ▾
          </button>
          {showSort && (
            <div className="sort-dropdown">
              <ul>
                {[
                  ['ecoAsc', 'Eco Score: Low → High'],
                  ['ecoDesc', 'Eco Score: High → Low'],
                  ['priceAsc', 'Price: Low → High'],
                  ['priceDesc', 'Price: High → Low'],
                  ['companyAsc', 'Company: A → Z'],
                  ['geckoDesc', 'Gecko Coins: High → Low'],
                  ['canopyDesc', 'Canopy Coins: High → Low']
                ].map(([key, label]) => (
                  <li
                    key={key}
                    onClick={() => {
                      setSortCriteria(key);
                      setShowSort(false);
                    }}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          className="top-bar__btn"
          onClick={() => setShowFilter(true)}
        >
          Filter ▸
        </button>
      </div>

      {showFilter && (
        <div className="filter-panel">
          <div className="filter-panel__header">
            <h2>Filter Products</h2>
            <button
              className="close-btn"
              onClick={() => setShowFilter(false)}
            >
              ✕
            </button>
          </div>
          <div className="filter-panel__body">
            <div className="filter-group">
              <label>Price: ₹{priceRange[0]} – ₹{priceRange[1]}</label>
              <input
                type="range" min="0" max="2000" step="10"
                value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="range" min="0" max="2000" step="10"
                value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
              />
            </div>
            <div className="filter-group">
              <label>Eco Score: {ecoRange[0]}% – {ecoRange[1]}%</label>
              <input
                type="range" min="0" max="100"
                value={ecoRange[0]} onChange={e => setEcoRange([+e.target.value, ecoRange[1]])}
              />
              <input
                type="range" min="0" max="100"
                value={ecoRange[1]} onChange={e => setEcoRange([ecoRange[0], +e.target.value])}
              />
            </div>
            <div className="filter-group">
              <label>Certificates</label>
              <div className="cert-list-panel">
                {CERTIFICATE_OPTIONS.map(name => (
                  <div key={name} className="cert-item-panel">
                    <input
                      type="checkbox"
                      id={`cert-${name}`}
                      checked={selectedCerts.includes(name)}
                      onChange={() => setSelectedCerts(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name])}
                    />
                    <label htmlFor={`cert-${name}`}>{name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Company</label>
              <select
                multiple
                value={selectedCompanies}
                onChange={e => setSelectedCompanies(
                  Array.from(e.target.selectedOptions).map(o => o.value)
                )}
              >
                {COMPANY_OPTIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-panel__footer">
            <button
              className="apply-btn"
              onClick={() => setShowFilter(false)}
            >Apply Filters</button>
          </div>
        </div>
      )}

      <div className="search-results">
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && !filtered.length && (
          <p>No products found for “{keyword}”.</p>
        )}

        <div className="product-grid">
          {filtered.map(p => {
            const rating = p.rating ?? 0;
            const geckoTotal = computeCoins(p);
            const canopyTotal = computeCoins(p);
            const state = cartState[p._id] || {};
            return (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`} className="product-link">
                  <img src={p.image_url} alt={p.name} />
                  <h3>{p.name}</h3>
                </Link>
                <div className="star-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rating ? 'filled' : ''}>★</span>
                  ))}
                </div>
                <p className="prod-desc">{(p.description || '').slice(0, 100) + '…'}</p>
                <p className="price">₹{p.price.toFixed(2)}</p>
                <p className="eco-score">Eco Score: {p.eco?.ecoScore ?? 0}</p>
                <div className="coins-container">
                  <div className="coin-item">
                    <img src="/images/gecko_coin.png" alt="Gecko Coin" className="coin-img" />
                    <span>{geckoTotal}</span>
                  </div>
                  <div className="coin-item">
                    <img src="/images/canopy_coin.png" alt="Canopy Coin" className="coin-img" />
                    <span>{canopyTotal}</span>
                  </div>
                </div>
                {p.certifications?.length > 0 && (
                  <div className="certificates">
                    {p.certifications.map(c => (
                      <span key={c.name} className="cert-box">{c.name}</span>
                    ))}
                  </div>
                )}
                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(p._id)}
                  disabled={state.adding}
                >
                  {state.adding ? 'Adding…' : state.added ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}