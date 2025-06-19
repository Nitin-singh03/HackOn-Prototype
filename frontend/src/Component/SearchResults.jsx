import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Css/SearchPage.css';

const CERTIFICATE_OPTIONS = [
  'ISO 14001', 'Energy Star', 'Fair Trade', 'EU Ecolabel',
  'Rainforest Alliance', 'Forest Stewardship Council',
  'Cradle to Cradle', 'CarbonNeutral®', 'Green Seal', 'USDA Organic'
];

const COMPANY_OPTIONS = [
  'EcoBrand Co.', 'GreenGoods Inc.', 'Sustainify LLC', 'NatureFirst Ltd.'
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword')?.trim() || '';

  // Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // UI state
  const [showSort,   setShowSort]   = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Sort & Filter criteria
  const [sortCriteria, setSortCriteria]   = useState('ecoAsc');
  const [priceRange,   setPriceRange]     = useState([0, 1000]);
  const [ecoRange,     setEcoRange]       = useState([0, 100]);
  const [selectedCerts,     setSelectedCerts]     = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Close sort dropdown on outside click
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

  // Fetch products
  useEffect(() => {
    if (!keyword) {
      setProducts([]);
      setError('');
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(
          `/api/products/search?keyword=${encodeURIComponent(keyword)}`
        );
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  // Filter & sort
  const filtered = products
    .filter(p => {
      const eco   = p.eco?.ecoScore ?? 0;
      const price = p.price;
      const comp  = p.company || '';

      if (eco < ecoRange[0] || eco > ecoRange[1]) return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (selectedCerts.length > 0) {
        if (!p.certifications?.some(c => selectedCerts.includes(c))) return false;
      }
      if (selectedCompanies.length > 0) {
        if (!selectedCompanies.includes(comp)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'ecoAsc':    return a.eco.ecoScore - b.eco.ecoScore;
        case 'ecoDesc':   return b.eco.ecoScore - a.eco.ecoScore;
        case 'priceAsc':  return a.price - b.price;
        case 'priceDesc': return b.price - a.price;
        case 'companyAsc':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    });

  return (
    <div className="search-page-container">
      {/* Top‑bar */}
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
                <li onClick={() => { setSortCriteria('ecoAsc');    setShowSort(false); }}>
                  Eco Score: Low → High
                </li>
                <li onClick={() => { setSortCriteria('ecoDesc');   setShowSort(false); }}>
                  Eco Score: High → Low
                </li>
                <li onClick={() => { setSortCriteria('priceAsc');  setShowSort(false); }}>
                  Price: Low → High
                </li>
                <li onClick={() => { setSortCriteria('priceDesc'); setShowSort(false); }}>
                  Price: High → Low
                </li>
                <li onClick={() => { setSortCriteria('companyAsc'); setShowSort(false); }}>
                  Company: A → Z
                </li>
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

      {/* Filter Panel */}
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
            {/* Price */}
            <div className="filter-group">
              <label>Price: ₹{priceRange[0]} – ₹{priceRange[1]}</label>
              <input
                type="range"
                min="0" max="2000" step="10"
                value={priceRange[0]}
                onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="range"
                min="0" max="2000" step="10"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
              />
            </div>

            {/* Eco Score */}
            <div className="filter-group">
              <label>Eco Score: {ecoRange[0]}% – {ecoRange[1]}%</label>
              <input
                type="range"
                min="0" max="100"
                value={ecoRange[0]}
                onChange={e => setEcoRange([+e.target.value, ecoRange[1]])}
              />
              <input
                type="range"
                min="0" max="100"
                value={ecoRange[1]}
                onChange={e => setEcoRange([ecoRange[0], +e.target.value])}
              />
            </div>

            {/* Certificates */}
            <div className="filter-group">
              <label>Certificates</label>
              <div className="cert-list-panel">
                {CERTIFICATE_OPTIONS.map(name => (
                  <div key={name} className="cert-item-panel">
                    <input
                      type="checkbox"
                      id={`cert-${name}`}
                      checked={selectedCerts.includes(name)}
                      onChange={() => {
                        setSelectedCerts(prev =>
                          prev.includes(name)
                            ? prev.filter(c => c !== name)
                            : [...prev, name]
                        );
                      }}
                    />
                    <label htmlFor={`cert-${name}`}>{name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Companies */}
            <div className="filter-group">
              <label>Company</label>
              <select
                multiple
                value={selectedCompanies}
                onChange={e => {
                  const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                  setSelectedCompanies(opts);
                }}
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
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="search-results">
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-center">No products found for “{keyword}”.</p>
        )}
        <div className="product-grid">
          {filtered.map(p => {
            const rating = Math.floor(Math.random() * 5) + 1;
            const desc   = (p.description || '').slice(0, 100) + '…';
            return (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`} className="product-link">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                </Link>
                <p className="star-rating">
                  {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
                </p>
                <p className="prod-desc">{desc}</p>
                <p className="price">₹{p.price.toFixed(2)}</p>
                <p className="eco-score">Eco Score: {p.eco?.ecoScore ?? 0}</p>
                <button className="add-cart-btn">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
