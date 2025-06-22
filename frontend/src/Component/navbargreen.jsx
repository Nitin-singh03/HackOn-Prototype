import React, { useEffect, useState } from 'react';
import '../Css/navbargreen.css';
import { Menu, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const AmazonNavigationBar = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  const closePopover = () => {
    setShowPopover(false);
    // Store in localStorage that user has seen the popover
    localStorage.setItem('greenovationPopoverSeen', 'true');
  };

  useEffect(() => {
    // Check if popover has been shown before
    const hasSeenPopover = localStorage.getItem('greenovationPopoverSeen');
    
    if (!hasSeenPopover) {
      // Only show popover if it hasn't been seen before
      const item = document.getElementById('itemToTrack');

      const handleScroll = () => {
        if (hasShownBefore) return; // Don't show again if already shown in this session

        const itemRect = item?.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (itemRect && itemRect.top < windowHeight && itemRect.bottom > 70) {
          setShowPopover(true);
          setHasShownBefore(true); // Mark as shown in this session
        }
      };

      // Show immediately if button is already visible
      const checkInitialVisibility = () => {
        if (item && !hasShownBefore) {
          const itemRect = item.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (itemRect.top < windowHeight && itemRect.bottom > 70) {
            setShowPopover(true);
            setHasShownBefore(true);
          }
        }
      };

      // Check initial visibility after a short delay to ensure DOM is ready
      setTimeout(checkInitialVisibility, 100);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasShownBefore]);

  return (
    <nav className="amazon-nav">
      <div className="amazon-nav-container">
        <div className="amazon-nav-section">
          <ul className="amazon-nav-list">
            <li className="nav-item">
              <Link to="/green" className="nav-link home-link">
                <Menu size={14} />
                <span>All</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">Today's Deals</Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">Amazon Pay</Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">Amazon miniTV</Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link">Personal Care</Link>
            </li>
            <li className="nav-item glazed-item">
              <Link to="/redeem" className="nav-link glazed-link">
                <span className="glazed-text">Redeem Coins</span>
                <div className="glazed-shimmer"></div>
              </Link>
            </li>
            <li className="nav-item glazed-item">
              <Link to="/return" className="nav-link glazed-link">
                <span className="glazed-text">Return Packging boxes</span>
                <div className="glazed-shimmer"></div>
              </Link>
            </li>
            <li className="nav-item glazed-item">
              <Link to="/education" className="nav-link glazed-link">
                <span className="glazed-text">Educational Section</span>
                <div className="glazed-shimmer"></div>
              </Link>
            </li>
            <li className="nav-item glazed-item">
              <Link to="/sustainability" className="nav-link glazed-link">
                <span className="glazed-text">Sustainability Reports</span>
                <div className="glazed-shimmer"></div>
              </Link>
            </li>
          </ul>

        </div>

        <div className='popover-trigger-nav'>
          <Link to="/green" style={{ textDecoration: 'none' }}>
            <button id='itemToTrack' className="greenovation-button">
              <span className="button-text">Greenovation Zone</span>
              <div className="button-shimmer"></div>
            </button>
          </Link>

          {showPopover && (
            <div className='popover-content-nav'>
              <div className='popover-triangle'></div>
              <div className="popover-header">
                <h3>🌱 New Feature!</h3>
              </div>
              <p>Introducing our brand new section<br/>Greenovation Zone</p>
              <button onClick={closePopover} className='got-it-button'>
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AmazonNavigationBar;