import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, RefreshCw, X, Sparkles, Filter, Check } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import ClothingCard from '../components/ClothingCard';
import Footer from '../components/Footer';
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
        categories,
        occasions,
        wishlist,
    } = useListings();

    const [priceRange, setPriceRange] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);

    // Sync URL parameters on load
    useEffect(() => {
        const cat = searchParams.get('category');
        const occ = searchParams.get('occasion');
        const q = searchParams.get('search');
        const wl = searchParams.get('wishlist');
        const size = searchParams.get('size');
        const price = searchParams.get('price');

        if (cat && categories.includes(cat)) setSelectedCategory(cat);
        if (occ && occasions.includes(occ)) setSelectedOccasion(occ);
        if (q) setSearchQuery(q);
        if (wl === 'true') setShowWishlistOnly(true);
        if (size) setSelectedSize(size);
        if (price) setPriceRange(price);
    }, [searchParams]);

    // Available Sizes
    const sizesList = ['all', 'S', 'M', 'L', 'XL'];

    let filteredListings = getFilteredListings().filter(item => {
        // Price filter
        let priceMatch = true;
        if (priceRange === 'under1200') priceMatch = item.pricePerDay < 1200;
        else if (priceRange === '1200to1600') priceMatch = item.pricePerDay >= 1200 && item.pricePerDay <= 1600;
        else if (priceRange === 'above1600') priceMatch = item.pricePerDay > 1600;

        // Size filter
        let sizeMatch = true;
        if (selectedSize !== 'all' && item.sizes) {
            sizeMatch = item.sizes.includes(selectedSize);
        }

        // Wishlist filter
        let wishlistMatch = true;
        if (showWishlistOnly) {
            wishlistMatch = wishlist.includes(item.id);
        }

        return priceMatch && sizeMatch && wishlistMatch;
    });

    // Sorting logic
    filteredListings = [...filteredListings].sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0; // featured default
    });

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedOccasion('All');
        setPriceRange('all');
        setSelectedSize('all');
        setSortBy('featured');
        setShowWishlistOnly(false);
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedOccasion !== 'All' || priceRange !== 'all' || selectedSize !== 'all' || sortBy !== 'featured' || showWishlistOnly;

    return (
        <div className="browse-page">
            {/* Hero Banner Header */}
            <div className="browse-hero-header">
                <div className="container">
                    <div className="browse-hero-content">
                        <span className="hero-kicker-gold">
                            <Sparkles size={14} className="gold-sparkle" />
                            LUXURY COUTURE ARCHIVE
                        </span>
                        <h1 className="browse-title">
                            {showWishlistOnly ? 'Your Saved Wishlist' : 'Discover Rental Collection'}
                        </h1>
                        <p className="browse-subtitle">
                            Explore verified designer lehengas, gowns, sarees & sherwanis for your special moments.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container py-xl">
                {/* Quick Category Filter Pills */}
                <div className="category-pills-row">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat === 'All' ? 'All Outfits' : cat}
                        </button>
                    ))}
                </div>

                {/* Filter Control Bar */}
                <div className="filters-card">
                    <div className="filters-header-row">
                        <div className="filters-title">
                            <Filter size={16} className="burgundy-icon" />
                            <span>Refine Selection</span>
                        </div>

                        <button
                            className={`wishlist-toggle-btn ${showWishlistOnly ? 'active' : ''}`}
                            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                        >
                            <Heart size={16} fill={showWishlistOnly ? '#7A263A' : 'none'} color={showWishlistOnly ? '#7A263A' : 'currentColor'} />
                            <span>Saved ({wishlist.length})</span>
                        </button>
                    </div>

                    <div className="filters-row mt-md">
                        {/* Search Input */}
                        <div className="search-box">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by outfit name, designer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Occasion Dropdown */}
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

                        {/* Rental Price Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Rental Price</label>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Prices</option>
                                <option value="under1200">Under ₹1,200 / day</option>
                                <option value="1200to1600">₹1,200 - ₹1,600 / day</option>
                                <option value="above1600">Above ₹1,600 / day</option>
                            </select>
                        </div>

                        {/* Size Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Size</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Sizes</option>
                                <option value="S">Size S</option>
                                <option value="M">Size M</option>
                                <option value="L">Size L</option>
                                <option value="XL">Size XL</option>
                            </select>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Highest Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filter Chips Bar */}
                    {hasActiveFilters && (
                        <div className="active-chips-row mt-md">
                            <span className="chips-label">Active Filters:</span>
                            {selectedCategory !== 'All' && (
                                <span className="filter-chip">
                                    Category: {selectedCategory}
                                    <button onClick={() => setSelectedCategory('All')}><X size={12} /></button>
                                </span>
                            )}
                            {selectedOccasion !== 'All' && (
                                <span className="filter-chip">
                                    Occasion: {selectedOccasion}
                                    <button onClick={() => setSelectedOccasion('All')}><X size={12} /></button>
                                </span>
                            )}
                            {priceRange !== 'all' && (
                                <span className="filter-chip">
                                    Price: {priceRange === 'under1200' ? '< ₹1,200' : priceRange === '1200to1600' ? '₹1,200-₹1,600' : '> ₹1,600'}
                                    <button onClick={() => setPriceRange('all')}><X size={12} /></button>
                                </span>
                            )}
                            {selectedSize !== 'all' && (
                                <span className="filter-chip">
                                    Size: {selectedSize}
                                    <button onClick={() => setSelectedSize('all')}><X size={12} /></button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="filter-chip">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                                </span>
                            )}
                            {showWishlistOnly && (
                                <span className="filter-chip">
                                    Wishlist Only
                                    <button onClick={() => setShowWishlistOnly(false)}><X size={12} /></button>
                                </span>
                            )}
                            <button onClick={resetFilters} className="clear-all-link">
                                Reset All
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Header Status */}
                <div className="results-status-row">
                    <span className="results-count">
                        Showing <strong>{filteredListings.length}</strong> verified luxury outfits
                    </span>
                    <div className="results-trust-note">
                        <Check size={14} className="sage-icon" /> All rentals include dry cleaning & doorstep return
                    </div>
                </div>

                {/* Product Grid Results */}
                {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-4 mt-lg">
                        {filteredListings.map(item => (
                            <ClothingCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results-card mt-2xl">
                        <SlidersHorizontal size={48} className="no-results-icon" />
                        <h3>No Outfits Match Your Filter Criteria</h3>
                        <p>Try clearing your active search keywords, adjusting price range, or choosing a different occasion.</p>
                        <button onClick={resetFilters} className="btn btn-primary mt-md">
                            <RefreshCw size={16} /> Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Browse;
