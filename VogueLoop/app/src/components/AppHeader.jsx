import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Search, Sun, Moon, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useListings } from '../context/ListingsContext';
import { useTheme } from '../context/ThemeContext';
import { getWebsiteUrl } from '../utils/config';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './AppHeader.css';

const POPULAR_SEARCHES = [
  { label: '⚡ Farewell Sarees', query: 'Saree', category: 'Saree' },
  { label: '✨ Festive Lehengas', query: 'Lehenga', category: 'Lehenga' },
  { label: '👑 Royal Sherwanis', query: 'Sherwani', category: 'Sherwani' },
  { label: '💼 Placement Suits', query: 'Suit', category: 'Western Formals' },
  { label: '🪔 Kurta Sets', query: 'Kurta', category: 'Kurta Set' },
];

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { searchQuery, setSearchQuery, wishlist, listings, setSelectedCategory } = useListings();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const trimmedQuery = (searchQuery || '').trim().toLowerCase();

  // Instant matching listings for live autocomplete
  const liveResults = trimmedQuery && Array.isArray(listings)
    ? listings.filter(item =>
        (item.title && item.title.toLowerCase().includes(trimmedQuery)) ||
        (item.category && item.category.toLowerCase().includes(trimmedQuery)) ||
        (item.occasion && item.occasion.toLowerCase().includes(trimmedQuery)) ||
        (item.locality && item.locality.toLowerCase().includes(trimmedQuery)) ||
        (item.description && item.description.toLowerCase().includes(trimmedQuery)) ||
        (item.owner && item.owner.toLowerCase().includes(trimmedQuery))
      ).slice(0, 4)
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowDropdown(false);
    if (setSelectedCategory) setSelectedCategory('All');
    const q = (searchQuery || '').trim();
    if (q) {
      navigate(`/browse?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/browse');
    }
  };

  const handleSelectListing = (id) => {
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  const handleSelectQuickSearch = (query, category) => {
    setSearchQuery(query);
    if (category && setSelectedCategory) setSelectedCategory(category);
    setShowDropdown(false);
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowDropdown(false);
    if (location.pathname === '/browse') {
      navigate('/browse');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleAuthToggle = () => {
    if (isAuthenticated) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-container">
        {/* Left Cluster: Brand Emblem */}
        <div className="app-header-left">
          <a href={getWebsiteUrl('/')} className="app-header-logo" title="VogueLoop Home">
            <div className="app-logo-emblem">VL</div>
            <div className="app-logo-text">
              <span className="app-logo-title">VOGUE<span className="gold-text">LOOP</span></span>
            </div>
          </a>
        </div>

        {/* Center: High-Utility Live Global Search Bar */}
        <div className="app-header-search-wrapper" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className={`app-header-search ${showDropdown ? 'focused' : ''}`}>
            <Search size={15} className="app-search-icon" />
            <input
              type="text"
              placeholder="Search occasion outfits, lehengas, sherwanis, size..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="app-search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="app-search-clear"
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Live Search Autocomplete Dropdown */}
          {showDropdown && (
            <div className="search-live-dropdown animate-fade-in" role="listbox">
              {trimmedQuery ? (
                <>
                  <div className="search-dropdown-header">
                    <span>MATCHING OUTFITS ({liveResults.length})</span>
                    {liveResults.length > 0 && (
                      <button type="button" onClick={handleSearchSubmit} className="search-view-all-link">
                        View all in Catalog <ArrowRight size={12} />
                      </button>
                    )}
                  </div>

                  {liveResults.length > 0 ? (
                    <div className="search-results-list">
                      {liveResults.map(item => (
                        <div
                          key={item.id}
                          className="search-result-item"
                          onClick={() => handleSelectListing(item.id)}
                          role="option"
                          tabIndex={0}
                        >
                          <img
                            src={(item.images && item.images[0]) || FALLBACK_IMAGE}
                            alt={item.title}
                            className="search-item-thumb"
                            onError={handleImageError}
                          />
                          <div className="search-item-info">
                            <div className="search-item-title-row">
                              <strong className="search-item-title">{item.title}</strong>
                              <span className="search-item-price">
                                ₹{item.rental3DayPrice || (item.pricePerDay * 3) || 799} <small>/ 3d</small>
                              </span>
                            </div>
                            <div className="search-item-meta-row">
                              <span className="search-meta-badge">{item.category}</span>
                              <span className="search-meta-bullet">•</span>
                              <span className="search-meta-text">{item.occasion}</span>
                              <span className="search-meta-bullet">•</span>
                              <span className="search-meta-locality">
                                <MapPin size={10} /> {item.locality || 'Campus'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="search-no-results">
                      <p>No outfits matching "<strong>{searchQuery}</strong>"</p>
                      <span className="search-hint">Try searching for lehengas, sarees, sherwanis, or fests.</span>
                    </div>
                  )}

                  <div className="search-dropdown-footer">
                    <button type="button" onClick={handleSearchSubmit} className="btn-search-full-catalog">
                      <Search size={13} />
                      <span>Search full campus catalog for "<strong>{searchQuery}</strong>"</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </>
              ) : (
                /* Empty Query: Popular Student Searches */
                <div className="search-popular-panel">
                  <div className="search-dropdown-header">
                    <span className="flex items-center gap-xs">
                      <Sparkles size={12} className="gold-sparkle" />
                      POPULAR CAMPUS SEARCHES
                    </span>
                  </div>
                  <div className="search-popular-chips">
                    {POPULAR_SEARCHES.map(item => (
                      <button
                        key={item.label}
                        type="button"
                        className="search-trend-chip"
                        onClick={() => handleSelectQuickSearch(item.query, item.category)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Cluster */}
        <div className="app-header-right">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="app-icon-button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Midnight Dark'} Theme`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} className="sun-icon" /> : <Moon size={17} className="moon-icon" />}
          </button>

          {/* Wishlist Link */}
          <Link to="/dashboard?tab=wishlist" className="app-icon-button" title="Saved Wishlist">
            <Heart size={18} />
            {wishlist?.length > 0 && <span className="app-counter-badge burgundy">{wishlist.length}</span>}
          </Link>

          {/* Escrow Rental Bag */}
          <Link to="/cart" className="app-icon-button" title="Escrow Rental Bag">
            <ShoppingBag size={18} />
            {itemCount > 0 && <span className="app-counter-badge navy">{itemCount}</span>}
          </Link>

          {/* Student Portal Profile Pill */}
          <div className="app-user-cluster">
            {isAuthenticated ? (
              <div className="app-user-pill">
                <Link to="/dashboard" className="app-user-name" title="View Dashboard">
                  <div className="app-user-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={13} />}
                  </div>
                  <span className="app-user-label">{user?.name?.split(' ')[0] || 'Student'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleAuthToggle}
                  className="app-user-logout"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="app-login-pill-btn">
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="app-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="app-mobile-drawer animate-fade-in">
          {/* Mobile Instant Search */}
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setMobileMenuOpen(false);
            }}
            className="app-mobile-search-form"
          >
            <Search size={15} className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search lehengas, sarees, suits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mobile-search-clear"
                aria-label="Clear mobile search"
              >
                <X size={14} />
              </button>
            )}
            <button type="submit" className="mobile-search-submit-btn">Go</button>
          </form>

          {/* Quick Trend Chips on Mobile */}
          <div className="app-mobile-quick-chips">
            {POPULAR_SEARCHES.map(item => (
              <button
                key={item.label}
                type="button"
                className="mobile-search-chip"
                onClick={() => {
                  handleSelectQuickSearch(item.query, item.category);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="app-mobile-nav-links">
            <Link to="/browse" className="app-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Browse All Outfits
            </Link>
            <Link to="/dashboard" className="app-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Student Dashboard (Renter & Host)
            </Link>
            <Link to="/upload" className="app-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              + List an Outfit to Closet
            </Link>
            <Link to="/cart" className="app-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Rental Bag ({itemCount})
            </Link>
            <a href={getWebsiteUrl('/')} className="app-mobile-link external" target="_blank" rel="noopener noreferrer">
              About VogueLoop & Policies ↗
            </a>
          </div>

          <div className="app-mobile-footer-actions">
            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => {
                  handleAuthToggle();
                  setMobileMenuOpen(false);
                }}
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
