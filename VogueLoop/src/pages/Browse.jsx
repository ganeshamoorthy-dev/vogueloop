import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, RefreshCw, X, Sparkles, Filter, CheckCircle2, MapPin } from 'lucide-react';
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
        if (q) setSearchQuery(q);
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

    const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedOccasion !== 'All' || selectedLocality !== 'All Localities' || priceRange !== 'all' || selectedSize !== 'all' || selectedGender !== 'All' || sortBy !== 'featured' || showWishlistOnly;

    return (
        <div className="browse-page">
            {/* Hero Banner Header */}
            <div className="browse-hero-header">
                <div className="container">
                    <div className="browse-hero-content">
                        <span className="hero-kicker-gold">
                            <Sparkles size={14} className="gold-sparkle" />
                            VERIFIED STUDENT CLOSETS
                        </span>
                        <h1 className="browse-title">
                            {showWishlistOnly ? 'Your Saved Outfits' : 'Find Your Next Look Nearby'}
                        </h1>
                        <p className="browse-subtitle">
                            Discover occasion wear listed by verified students around your campus.
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
                            {cat === 'All' ? 'All Garments' : cat}
                        </button>
                    ))}
                </div>

                {/* Filter Control Bar */}
                <div className="filters-card">
                    <div className="filters-header-row">
                        <div className="filters-title">
                            <Filter size={16} className="burgundy-icon" />
                            <span>Filter Nearby Outfits</span>
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
                                placeholder="Search lehengas, sarees, suits, campus hubs..."
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

                        {/* Locality / Proximity Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Campus Locality</label>
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

                        {/* 3-Day Rental Price Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Rental Price (3 Days)</label>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Prices</option>
                                <option value="under700">Under ₹700</option>
                                <option value="700to900">₹700 – ₹900</option>
                                <option value="above900">Above ₹900</option>
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
                                <option value="XS">Size XS</option>
                                <option value="S">Size S</option>
                                <option value="M">Size M</option>
                                <option value="L">Size L</option>
                                <option value="XL">Size XL</option>
                                <option value="Free Size">Free Size</option>
                            </select>
                        </div>

                        {/* Style / Gender Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Style / Gender</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="filter-select"
                            >
                                <option value="All">All Styles</option>
                                <option value="Women">Women's Wear</option>
                                <option value="Men">Men's Wear</option>
                                <option value="Unisex">Unisex / Indo-Western</option>
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
                                <option value="distance-asc">Closest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filter Chips Bar */}
                    {hasActiveFilters && (
                        <div className="active-chips-row mt-md">
                            <span className="chips-label">Active Filters:</span>
                            {selectedCategory !== 'All' && (
                                <span className="filter-chip">
                                    Garment: {selectedCategory}
                                    <button onClick={() => setSelectedCategory('All')}><X size={12} /></button>
                                </span>
                            )}
                            {selectedLocality !== 'All Localities' && (
                                <span className="filter-chip">
                                    Locality: {selectedLocality}
                                    <button onClick={() => setSelectedLocality('All Localities')}><X size={12} /></button>
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
                                    Price: {priceRange === 'under700' ? '< ₹700' : priceRange === '700to900' ? '₹700–₹900' : '> ₹900'}
                                    <button onClick={() => setPriceRange('all')}><X size={12} /></button>
                                </span>
                            )}
                            {selectedSize !== 'all' && (
                                <span className="filter-chip">
                                    Size: {selectedSize}
                                    <button onClick={() => setSelectedSize('all')}><X size={12} /></button>
                                </span>
                            )}
                            {selectedGender !== 'All' && (
                                <span className="filter-chip">
                                    Style: {selectedGender}
                                    <button onClick={() => setSelectedGender('All')}><X size={12} /></button>
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
                        Showing <strong>{filteredListings.length}</strong> outfits available near you
                    </span>
                    <div className="results-trust-note">
                        <CheckCircle2 size={14} className="sage-icon" /> Student verified • Condition checks • Refundable deposit
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
                        <p>Try clearing your active search keywords, widening your campus distance, or choosing a different occasion.</p>
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
