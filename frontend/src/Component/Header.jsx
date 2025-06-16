// src/components/Header.js
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Css/Header.css'
import { useStateValue } from '../StateProvider'

function Header() {
  const [{ basket }, dispatch] = useStateValue()
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const submitHandler = e => {
    e.preventDefault()
    const trimmed = keyword.trim()
    if (trimmed) {
      // Navigate to /search?keyword=... (or /search/:keyword if you prefer)
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/')
    }
  }

  const handleLinkClick = () => {
    // Scroll to top when basket link clicked
    window.scrollTo(0, 0, { behavior: 'instant' })
  }

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__logo"
          src="../images/amazon.png"
          alt="amazon logo"
        />
      </Link>

      <form className="header__search" onSubmit={submitHandler}>
        <input
          className="header__searchInput"
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search products..."
        />
        <button type="submit" className="header__searchIconBtn">
          <img
            src="../images/search_icon.png"
            className="header__searchIcon"
            alt="search"
          />
        </button>
      </form>

      <div className="header__nav">
        <Link style={{ textDecoration: 'none' }} to="/login">
          <div className="header__option">
            <span className="header__optionLineOne">Hello Guest</span>
            <span className="header__optionLineTwo">Sign In</span>
          </div>
        </Link>

        <Link style={{ textDecoration: 'none' }} to="/orders">
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>

        <Link style={{ textDecoration: 'none' }} to="/dashboard">
          <div className="header__option">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Dashboard</span>
          </div>
        </Link>

        <Link
          style={{ textDecoration: 'none' }}
          to="/checkout"
          onClick={handleLinkClick}
        >
          <div className="header__optionBasket">
            <img
              src="../images/cart_icon.png"
              className="header__cartIcon"
              alt="cart"
            />
            <span className="header__optionLineTwo header__basketCount">
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Header
