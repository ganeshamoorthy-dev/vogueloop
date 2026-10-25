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

    // Sync URL parameters on load & back/forward navigation
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
        else if (!cat) setSelectedCategory('All');

        if (occ && occasions.includes(occ)) setSelectedOccasion(occ);
        else if (!occ) setSelectedOccasion('All');

        if (loc && localities.includes(loc)) setSelectedLocality(loc);
        else if (!loc) setSelectedLocality('All Localities');

        if (q !== null) setSearchQuery(q);
        setShowWishlistOnly(wl === 'true');
        if (size) setSelectedSize(size);
        else setSelectedSize('all');

        if (price) setPriceRange(price);
        else setPriceRange('all');

        if (gen) setSelectedGender(gen);
        else setSelectedGender('All');
    }, [searchParams, categories, occasions, localities]);

    // Helpers to update state & sync URL
    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        const newParams = new URLSearchParams(searchParams);
        if (cat === 'All') newParams.delete('category');
        else newParams.set('category', cat);
        setSearchParams(newParams);
    };

    const handleWishlistToggle = () => {
        const nextVal = !showWishlistOnly;
        setShowWishlistOnly(nextVal);
        const newParams = new URLSearchParams(searchParams);
        if (nextVal) newParams.set('wishlist', 'true');
        else newParams.delete('wishlist');
        setSearchParams(newParams);
    };

    const handleLocalityChange = (loc) => {
        setSelectedLocality(loc);
        const newParams = new URLSearchParams(searchParams);
        if (loc === 'All Localities') newParams.delete('locality');
        else newParams.set('locality', loc);
        setSearchParams(newParams);
    };

    const handleOccasionChange = (occ) => {
        setSelectedOccasion(occ);
        const newParams = new URLSearchParams(searchParams);
        if (occ === 'All') newParams.delete('occasion');
        else newParams.set('occasion', occ);
        setSearchParams(newParams);
    };

    const handlePriceChange = (pr) => {
        setPriceRange(pr);
        const newParams = new URLSearchParams(searchParams);
        if (pr === 'all') newParams.delete('price');
        else newParams.set('price', pr);
        setSearchParams(newParams);
    };

    const handleSizeChange = (sz) => {
        setSelectedSize(sz);
        const newParams = new URLSearchParams(searchParams);
        if (sz === 'all') newParams.delete('size');
        else newParams.set('size', sz);
        setSearchParams(newParams);
    };

    const handleGenderChange = (gen) => {
        setSelectedGender(gen);
        const newParams = new URLSearchParams(searchParams);
        if (gen === 'All') newParams.delete('gender');
        else newParams.set('gender', gen);
        setSearchParams(newParams);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        const newParams = new URLSearchParams(searchParams);
        if (value.trim()) newParams.set('search', value.trim());
        else newParams.delete('search');
        setSearchParams(newParams);
    };

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
            {/* Streamlined Discovery Header with Gradient */}
            <div className="browse-hero-header">
                <div className="container">
                    <div className="catalog-header-content">
                        <div className="catalog-header-top-row">
                            <h1 className="browse-title" style={{ margin: 0, fontSize: '1.65rem' }}>
                                {searchQuery ? `Results for "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'Explore Campus Outfits'}
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

            <div className="container py-xl">
                {/* Quick Category Filter Pills */}
                <div className="category-pills-row">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(cat)}
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
                            type="button"
                            className={`wishlist-toggle-btn ${showWishlistOnly ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                            aria-label="Toggle Saved Wishlist Outfits"
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
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="search-input"
                                aria-label="Search outfits"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="clear-search-btn"
                                    onClick={() => handleSearchChange('')}
                                    aria-label="Clear Search Input"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Locality / Campus Zone Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Campus Zone</label>
                            <select
                                value={selectedLocality}
                                onChange={(e) => handleLocalityChange(e.target.value)}
                                className="filter-select"
                                aria-label="Filter by Campus Zone"
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
                                onChange={(e) => handleOccasionChange(e.target.value)}
                                className="filter-select"
                                aria-label="Filter by Occasion"
                            >
                                {occasions.map(occ => (
                                    <option key={occ} value={occ}>{occ}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3-Day Rental Price Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Rental Budget (3 Days)</label>
                            <select
                                value={priceRange}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                className="filter-select"
                                aria-label="Filter by Price"
                            >
                                <option value="all">All Prices</option>
                                <option value="under700">Under ₹700</option>
                                <option value="700to900">₹700 – ₹900</option>
                                <option value="above900">Above ₹900</option>
                            </select>
                        </div>

                        {/* Size Dropdown */}
                        <div className="filter-group">
                            <label className="filter-label">Garment Size</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => handleSizeChange(e.target.value)}
                                className="filter-select"
                                aria-label="Filter by Size"
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
                            <label className="filter-label">Style / Fit</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => handleGenderChange(e.target.value)}
                                className="filter-select"
                                aria-label="Filter by Style"
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
                                aria-label="Sort outfits"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="distance-asc">Sort: Closest First</option>
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
                                    <button type="button" onClick={() => handleCategorySelect('All')} aria-label={`Remove filter ${selectedCategory}`}><X size={12} /></button>
                                </span>
                            )}
                            {selectedLocality !== 'All Localities' && (
                                <span className="filter-chip">
                                    Locality: {selectedLocality}
                                    <button type="button" onClick={() => handleLocalityChange('All Localities')} aria-label={`Remove filter ${selectedLocality}`}><X size={12} /></button>
                                </span>
                            )}
                            {selectedOccasion !== 'All' && (
                                <span className="filter-chip">
                                    Occasion: {selectedOccasion}
                                    <button type="button" onClick={() => handleOccasionChange('All')} aria-label={`Remove filter ${selectedOccasion}`}><X size={12} /></button>
                                </span>
                            )}
                            {priceRange !== 'all' && (
                                <span className="filter-chip">
                                    Price: {priceRange === 'under700' ? '< ₹700' : priceRange === '700to900' ? '₹700–₹900' : '> ₹900'}
                                    <button type="button" onClick={() => handlePriceChange('all')} aria-label="Remove price filter"><X size={12} /></button>
                                </span>
                            )}
                            {selectedSize !== 'all' && (
                                <span className="filter-chip">
                                    Size: {selectedSize}
                                    <button type="button" onClick={() => handleSizeChange('all')} aria-label={`Remove filter size ${selectedSize}`}><X size={12} /></button>
                                </span>
                            )}
                            {selectedGender !== 'All' && (
                                <span className="filter-chip">
                                    Style: {selectedGender}
                                    <button type="button" onClick={() => handleGenderChange('All')} aria-label={`Remove style filter ${selectedGender}`}><X size={12} /></button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="filter-chip">
                                    Search: "{searchQuery}"
                                    <button type="button" onClick={() => handleSearchChange('')} aria-label="Clear search keyword"><X size={12} /></button>
                                </span>
                            )}
                            {showWishlistOnly && (
                                <span className="filter-chip">
                                    Wishlist Only
                                    <button type="button" onClick={handleWishlistToggle} aria-label="Remove wishlist filter"><X size={12} /></button>
                                </span>
                            )}
                            <button type="button" onClick={resetFilters} className="clear-all-link">
                                Reset All
                            </button>
                        </div>
                    )}
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
                        <p>Try clearing active filters, choosing another campus spot, or checking all sizes.</p>
                        <button type="button" onClick={resetFilters} className="btn btn-primary mt-md">
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
