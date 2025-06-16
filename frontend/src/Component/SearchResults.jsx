import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useStateValue } from '../StateProvider'
import '../Css/SearchPage.css'

const CERTIFICATE_OPTIONS = [
  'ISO 14001', 'Energy Star', 'Fair Trade', 'EU Ecolabel',
  'Rainforest Alliance', 'Forest Stewardship Council', 'Cradle to Cradle',
  'CarbonNeutral®', 'Green Seal', 'USDA Organic', 'Oeko‑Tex', 'WaterSense',
]

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const keyword         = searchParams.get('keyword')?.trim() || ''
  const [products, setProducts] = useState([])
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedCerts, setSelectedCerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [{}, dispatch] = useStateValue()
  const addToCart = product => dispatch({ type: 'ADD_TO_CART', item: product })

  useEffect(() => {
    if (!keyword) {
      setProducts([])
      setError('')
      return
    }
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(
          `/api/products/search?keyword=${encodeURIComponent(keyword)}`
        )
        setProducts(data)
      } catch (err) {
        const msg = err.response?.data?.message ?? err.message
        setError(msg || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [keyword])

  const toggleCert = name =>
    setSelectedCerts(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    )

  const filtered = products
    .filter(prod =>
      selectedCerts.length === 0 ||
      prod.certifications?.some(cert => selectedCerts.includes(cert))
    )
    .sort((a, b) =>
      sortAsc ? a.eco.ecoScore - b.eco.ecoScore : b.eco.ecoScore - a.eco.ecoScore
    )

  return (
    <div className="search-page-container">
      <div className="search-controls">
        <div className="sort-control">
          <label>Sort by Eco Score:</label>
          <select
            value={sortAsc ? 'asc' : 'desc'}
            onChange={e => setSortAsc(e.target.value === 'asc')}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div className="filter-control">
          <label>Filter by Certificates:</label>
          <div className="cert-list">
            {CERTIFICATE_OPTIONS.map(name => (
              <div key={name} className="cert-item">
                <input
                  type="checkbox"
                  id={name}
                  checked={selectedCerts.includes(name)}
                  onChange={() => toggleCert(name)}
                />
                <label htmlFor={name}>{name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="search-results">
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p>No products found for “{keyword}”.</p>
        )}

        <div className="product-grid">
          {filtered.map(prod => {
            const rating = Math.floor(Math.random() * 5) + 1
            const desc = prod.description
              ? prod.description.slice(0, 100) + '...'
              : ''
            return (
              <div key={prod._id} className="product-card">
                <Link to={`/product/${prod._id}`} className="product-link">
                  <img src={prod.image} alt={prod.name} />
                  <h3>{prod.name}</h3>
                </Link>
                <p className="star-rating">
                  {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
                </p>
                <p className="prod-desc">{desc}</p>
                <p className="price">₹{prod.price}</p>
                <p className="eco-score">Eco Score: {prod.eco.ecoScore}</p>
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(prod)}
                >
                  Add to Cart
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SearchResults