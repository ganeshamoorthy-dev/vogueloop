import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, RefreshCw, X, Filter, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import ClothingCard from '../components/ClothingCard';
import MobileBottomNav from '../components/MobileBottomNav';
import './Browse.css';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getFilteredListings,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedOccasion,
    setSelectedOccasion,
    selectedLocality,
    setSelectedLocality,
    categories,
    occasions,
    localities,
    wishlist,
  } = useListings();

  const [priceRange, setPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedGender, setSelectedGender] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL parameters on load
  useEffect(() => {
    const cat = searchParams.get('category');
    const occ = searchParams.get('occasion');
    const q = searchParams.get('search');
    const wl = searchParams.get('wishlist');
    const size = searchParams.get('size');
    const price = searchParams.get('price');
    const loc = searchParams.get('locality');
    const gen = searchParams.get('gender');

    if (cat && categories.includes(cat)) setSelectedCategory(cat);
    if (occ && occasions.includes(occ)) setSelectedOccasion(occ);
    if (loc && localities.includes(loc)) setSelectedLocality(loc);
    if (q !== null) {
      setSearchQuery(q);
    }
    if (wl === 'true') setShowWishlistOnly(true);
    if (size) setSelectedSize(size);
    if (price) setPriceRange(price);
    if (gen) setSelectedGender(gen);
  }, [searchParams]);

  let filteredListings = getFilteredListings().filter(item => {
    const item3DayPrice = item.rental3DayPrice || (item.pricePerDay ? item.pricePerDay * 3 : 799);

    // Price filter (3-day student pricing)
    let priceMatch = true;
    if (priceRange === 'under700') priceMatch = item3DayPrice < 700;
    else if (priceRange === '700to900') priceMatch = item3DayPrice >= 700 && item3DayPrice <= 900;
    else if (priceRange === 'above900') priceMatch = item3DayPrice > 900;

    // Size filter
    let sizeMatch = true;
    if (selectedSize !== 'all') {
      sizeMatch = (item.sizes && item.sizes.includes(selectedSize)) || item.primarySize === selectedSize;
    }

    // Wishlist filter
    let wishlistMatch = true;
    if (showWishlistOnly) {
      wishlistMatch = wishlist.includes(item.id);
    }

    // Gender / Department filter
    let genderMatch = true;
    if (selectedGender === 'Women') {
      genderMatch = ['Lehenga', 'Saree', 'Anarkali', 'Indo-Western'].includes(item.category) || item.gender === 'Women';
    } else if (selectedGender === 'Men') {
      genderMatch = ['Sherwani', 'Kurta', 'Suit'].includes(item.category) || item.gender === 'Men';
    } else if (selectedGender === 'Unisex') {
      genderMatch = ['Indo-Western', 'Kurta'].includes(item.category) || item.gender === 'Unisex';
    }

    return priceMatch && sizeMatch && wishlistMatch && genderMatch;
  });

  // Sorting logic
  filteredListings = [...filteredListings].sort((a, b) => {
    const priceA = a.rental3DayPrice || a.pricePerDay * 3;
    const priceB = b.rental3DayPrice || b.pricePerDay * 3;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'distance-asc') return (a.distanceKm || 1) - (b.distanceKm || 1);
    if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    return 0; // featured default
  });

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedLocality('All Localities');
    setPriceRange('all');
    setSelectedSize('all');
    setSelectedGender('All');
    setSortBy('featured');
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedOccasion !== 'All',
    selectedLocality !== 'All Localities',
    priceRange !== 'all',
    selectedSize !== 'all',
    selectedGender !== 'All',
    showWishlistOnly,
    Boolean(searchQuery),
  ].filter(Boolean).length;

  return (
    <div className="app-browse-page">
      {/* Streamlined Catalog Header with Subtle Gradient */}
      <div className="browse-catalog-header">
        <div className="container">
          <div className="catalog-header-content">
            <div className="catalog-header-top-row">
              <h1 className="catalog-title">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedCategory !== 'All'
                    ? selectedCategory
                    : 'Explore Campus Outfits'}
              </h1>
              <span className="catalog-count-pill">
                {filteredListings.length} {filteredListings.length === 1 ? 'outfit' : 'outfits'}
              </span>
            </div>
            <p className="catalog-header-desc">
              {searchQuery
                ? `Showing verified outfits matching "${searchQuery}" available for student pickup.`
                : 'Rent festive and occasion wear directly from verified student peers around your campus.'}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Discovery Toolbar */}
      <div className="app-browse-controls-bar">
        <div className="container">
          <div className="controls-flex-row">
            {/* Horizontal Scrollable Category Chips */}
            <div className="category-chips-scroller">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`app-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? 'All Outfits' : cat}
                </button>
              ))}
            </div>

            {/* Right Cluster: Campus Zone Selector, Filters Button & Sort */}
            <div className="controls-right-cluster">
              {/* Locality Dropdown Pill */}
              <div className="toolbar-locality-pill" title="Filter by Campus Zone">
                <MapPin size={13} className="toolbar-pin-icon" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="toolbar-locality-select"
                  aria-label="Filter by Campus Zone"
                >
                  {localities.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Filter Drawer Trigger */}
              <button
                type="button"
                className={`app-filter-toggle-btn ${activeFilterCount > 0 ? 'active' : ''} ${showMobileFilters ? 'open' : ''}`}
                onClick={() => setShowMobileFilters(prev => !prev)}
                aria-label="Toggle Extended Filters"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="app-sort-select"
                aria-label="Sort outfits"
              >
                <option value="featured">Sort: Featured</option>
                <option value="distance-asc">Sort: Closest First</option>
                <option value="price-asc">Sort: Price Low-to-High</option>
                <option value="price-desc">Sort: Price High-to-Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-lg">
        {/* Expandable Filter Drawer Panel */}
        {showMobileFilters && (
          <div className="app-filter-tray open animate-fade-in">
            <div className="app-filter-tray-header">
              <div className="tray-title">
                <Filter size={15} className="burgundy-icon" />
                <span>Extended Catalog Filters</span>
              </div>
              <div className="flex items-center gap-sm">
                <button
                  type="button"
                  className={`wishlist-pill-btn ${showWishlistOnly ? 'active' : ''}`}
                  onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                >
                  <Heart size={14} fill={showWishlistOnly ? '#7A263A' : 'none'} />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </button>
                <button
                  type="button"
                  className="filter-close-btn"
                  onClick={() => setShowMobileFilters(false)}
                  aria-label="Close filters"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="app-filter-tray-grid">
              {/* Campus Locality */}
              <div className="filter-group">
                <label className="filter-label">Campus Zone</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="filter-select"
                >
                  {localities.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div className="filter-group">
                <label className="filter-label">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="filter-select"
                >
                  {occasions.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {/* 3-Day Rental Price */}
              <div className="filter-group">
                <label className="filter-label">Rental Budget (3 Days)</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Budgets</option>
                  <option value="under700">Under ₹700</option>
                  <option value="700to900">₹700 – ₹900</option>
                  <option value="above900">Above ₹900</option>
                </select>
              </div>

              {/* Size */}
              <div className="filter-group">
                <label className="filter-label">Garment Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Sizes</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="Free Size">Free Size</option>
                </select>
              </div>

              {/* Gender / Style */}
              <div className="filter-group">
                <label className="filter-label">Style / Fit</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Styles</option>
                  <option value="Women">Women's Outfits</option>
                  <option value="Men">Men's Wear</option>
                  <option value="Unisex">Unisex / Indo-Western</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ALWAYS-VISIBLE Active Filter Tags Bar */}
        {activeFilterCount > 0 && (
          <div className="active-filters-summary-bar animate-fade-in mb-lg">
            <span className="summary-label">Active Filters:</span>
            <div className="summary-chips-wrap">
              {selectedCategory !== 'All' && (
                <span className="active-tag-chip">
                  Category: <strong>{selectedCategory}</strong>
                  <button onClick={() => setSelectedCategory('All')} aria-label="Remove category filter"><X size={12} /></button>
                </span>
              )}
              {selectedLocality !== 'All Localities' && (
                <span className="active-tag-chip">
                  Zone: <strong>{selectedLocality}</strong>
                  <button onClick={() => setSelectedLocality('All Localities')} aria-label="Remove zone filter"><X size={12} /></button>
                </span>
              )}
              {selectedOccasion !== 'All' && (
                <span className="active-tag-chip">
                  Occasion: <strong>{selectedOccasion}</strong>
                  <button onClick={() => setSelectedOccasion('All')} aria-label="Remove occasion filter"><X size={12} /></button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="active-tag-chip">
                  Price: <strong>{priceRange === 'under700' ? '< ₹700' : priceRange === '700to900' ? '₹700–₹900' : '> ₹900'}</strong>
                  <button onClick={() => setPriceRange('all')} aria-label="Remove price filter"><X size={12} /></button>
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="active-tag-chip">
                  Size: <strong>{selectedSize}</strong>
                  <button onClick={() => setSelectedSize('all')} aria-label="Remove size filter"><X size={12} /></button>
                </span>
              )}
              {selectedGender !== 'All' && (
                <span className="active-tag-chip">
                  Style: <strong>{selectedGender}</strong>
                  <button onClick={() => setSelectedGender('All')} aria-label="Remove style filter"><X size={12} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="active-tag-chip">
                  Search: <strong>"{searchQuery}"</strong>
                  <button onClick={handleClearSearch} aria-label="Clear search filter"><X size={12} /></button>
                </span>
              )}
              {showWishlistOnly && (
                <span className="active-tag-chip">
                  <strong>Saved Only</strong>
                  <button onClick={() => setShowWishlistOnly(false)} aria-label="Clear wishlist filter"><X size={12} /></button>
                </span>
              )}
              <button onClick={resetFilters} className="active-reset-all-btn">
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid Results */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-4">
            {filteredListings.map(item => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results-card mt-2xl">
            {searchQuery ? <Search size={48} className="no-results-icon" /> : <SlidersHorizontal size={48} className="no-results-icon" />}
            <h3>{searchQuery ? `No Outfits Found for "${searchQuery}"` : "No Outfits Match Your Filter Criteria"}</h3>
            <p>
              {searchQuery
                ? "We couldn't find any student closet listings matching your terms. Try broader keywords like 'Saree', 'Sherwani', 'Festive', or clear your active filters."
                : "Try clearing active filters, choosing another campus spot, or checking all sizes."}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              {searchQuery && (
                <button onClick={handleClearSearch} className="btn btn-outline">
                  <X size={16} /> Clear Search Query
                </button>
              )}
              <button onClick={resetFilters} className="btn btn-primary">
                <RefreshCw size={16} /> Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav wishlistCount={wishlist.length} />
    </div>
  );
};

export default Browse;
