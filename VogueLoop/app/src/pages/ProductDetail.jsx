import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star, ShoppingBag, ChevronLeft, ChevronRight, Heart,
    ShieldCheck, Sparkles, CheckCircle2, UserCheck, Lock, ChevronDown, HelpCircle, FileText, RefreshCw, MapPin, Ruler, ArrowRight
} from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DateRangePicker from '../components/DateRangePicker';
import AvailabilityBadge from '../components/AvailabilityBadge';
import TrustLayer from '../components/TrustLayer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getListingById, isInWishlist, toggleWishlist, wishlist } = useListings();
    const { addToCart, cartItems, itemCount } = useCart();
    const { isAuthenticated, login } = useAuth();

    const item = getListingById(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(item?.primarySize || (item?.sizes ? item.sizes[0] : 'M'));
    const [rentalDates, setRentalDates] = useState({ start: null, end: null });
    const [addedToBag, setAddedToBag] = useState(false);

    // Accordion state (default open first FAQ item)
    const [openFaq, setOpenFaq] = useState('measurements');

    if (!item) {
        return (
            <div className="product-detail-page">
                <div className="container py-3xl text-center">
                    <div className="not-found-card">
                        <h2>Outfit Not Found</h2>
                        <p>The outfit you are looking for may have been rented or removed by the student lender.</p>
                        <button onClick={() => navigate('/browse')} className="btn btn-primary mt-md">
                            Browse Campus Outfits
                        </button>
                    </div>
                </div>
                            </div>
        );
    }

    const liked = isInWishlist(item.id);
    const itemImages = (item.images && item.images.length > 0) ? item.images : [FALLBACK_IMAGE];
    const mainImageUrl = itemImages[currentImageIndex] || itemImages[0] || FALLBACK_IMAGE;
    const threeDayPrice = item.rental3DayPrice || 799;

    const handleDateChange = (startDate, endDate) => {
        setRentalDates({ start: startDate, end: endDate });
        setAddedToBag(false);
    };

    const handleAddToBagOnly = () => {
        if (!isAuthenticated) {
            login({ id: 1, name: 'Student Renter', email: 'student@campus.edu', role: 'customer' });
        }

        const start = rentalDates.start || new Date().toISOString().split('T')[0];
        const end = rentalDates.end || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

        addToCart(
            {
                ...item,
                selectedSize,
                pricePerDay: Math.round(threeDayPrice / 3),
            },
            start,
            end
        );

        setAddedToBag(true);
    };

    const handleRentNow = () => {
        if (!isAuthenticated) {
            login({ id: 1, name: 'Student Renter', email: 'student@campus.edu', role: 'customer' });
        }

        const start = rentalDates.start || new Date().toISOString().split('T')[0];
        const end = rentalDates.end || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

        addToCart(
            {
                ...item,
                selectedSize,
                pricePerDay: Math.round(threeDayPrice / 3),
            },
            start,
            end
        );

        navigate('/cart');
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % itemImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + itemImages.length) % itemImages.length);
    };

    const toggleFaq = (key) => {
        setOpenFaq(openFaq === key ? null : key);
    };

    return (
        <div className="product-detail-page">
            <div className="container py-xl">
                {/* Top Return Navigation */}
                <div className="app-back-navigation mb-md">
                    <button onClick={() => navigate(-1)} className="back-nav-btn">
                        <ChevronLeft size={16} />
                        <span>Back to Outfits</span>
                    </button>
                </div>

                <div className="product-grid">
                    {/* Left Column: Sticky Image Showroom */}
                    <div className="product-gallery-sticky">
                        <div className="main-image-wrapper">
                            <img
                                src={mainImageUrl}
                                alt={item.title}
                                className="main-image"
                                onError={handleImageError}
                            />

                            {/* Wishlist Heart Button */}
                            <button
                                type="button"
                                className={`gallery-wishlist-btn ${liked ? 'active' : ''}`}
                                onClick={() => toggleWishlist(item.id)}
                                aria-label="Wishlist"
                            >
                                <Heart size={20} fill={liked ? 'var(--brand-fashion)' : 'none'} color={liked ? 'var(--brand-fashion)' : 'currentColor'} />
                            </button>

                            {/* Image Nav Arrows */}
                            {itemImages.length > 1 && (
                                <>
                                    <button className="image-nav prev" onClick={prevImage} aria-label="Previous Image">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="image-nav next" onClick={nextImage} aria-label="Next Image">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Strip */}
                        {itemImages.length > 1 && (
                            <div className="image-thumbnails mt-sm">
                                {itemImages.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail-btn ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img src={img} alt={`${item.title} thumbnail ${index + 1}`} onError={handleImageError} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* P2P Trust & Meetup Strip */}
                        <div className="gallery-trust-strip mt-md">
                            <div className="trust-strip-item">
                                <CheckCircle2 size={14} className="sage-icon" />
                                <span>Verified Student Listing</span>
                            </div>
                            <div className="trust-strip-item">
                                <ShieldCheck size={14} className="gold-sparkle" />
                                <span>Refundable Deposit</span>
                            </div>
                            <div className="trust-strip-item">
                                <MapPin size={14} className="navy-icon" />
                                <span>Campus Handover</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clean Action-Focused Panel */}
                    <div className="product-info-panel">
                        {/* Status Badges Row */}
                        <div className="product-badges-row mb-xs">
                            <AvailabilityBadge available={item.available !== false} text="Available to Rent" />
                            {item.condition && (
                                <span className="badge badge-gold">
                                    <Sparkles size={12} />
                                    <span>{item.condition}</span>
                                </span>
                            )}
                        </div>

                        {/* Title & Occasion Header */}
                        <div className="product-title-group">
                            <span className="product-category-label">
                                {item.category} • {item.occasion || 'Campus Event'}
                            </span>
                            <h1 className="product-title">{item.title}</h1>
                        </div>

                        {/* Lender & Proximity Verification Card */}
                        <div className="lender-identity-box mb-md">
                            <div className="lender-id-avatar">
                                <UserCheck size={18} />
                            </div>
                            <div className="lender-id-text">
                                <div className="lender-name-row">
                                    <strong>Listed by {item.owner || 'Verified Student'}</strong>
                                    <span className="student-badge-pill">✓ Verified Student</span>
                                </div>
                                <span className="lender-locality-sub">
                                    <MapPin size={12} className="pin-icon" />
                                    {item.locality || 'University Hub'} • {item.distanceKm ? `${item.distanceKm} km from campus` : 'Near Campus'}
                                </span>
                            </div>
                        </div>

                        {/* Pricing Box: 3-Day Student Bundle & Original Price */}
                        <div className="product-pricing-box">
                            <div className="price-main">
                                <span className="price-number">₹{threeDayPrice}</span>
                                <span className="price-per">/ 3-day rental</span>
                            </div>
                            {item.originalPurchasePrice && (
                                <div className="retail-comparison">
                                    <span>Buying new: approx. <strong>₹{item.originalPurchasePrice.toLocaleString('en-IN')}</strong> / Renting: <strong>₹{threeDayPrice}</strong></span>
                                </div>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="product-short-desc">{item.description}</p>

                        {/* Size Selection Section */}
                        <div className="size-selector-section">
                            <div className="size-header">
                                <label className="form-label">Available Size</label>
                                <span className="fit-note">See measurements below for exact fit</span>
                            </div>
                            <div className="size-options-grid">
                                {item.sizes ? item.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => { setSelectedSize(size); setAddedToBag(false); }}
                                    >
                                        {size}
                                    </button>
                                )) : <span className="text-secondary">Free Size</span>}
                            </div>
                        </div>

                        {/* Detailed Measurements Pill Box */}
                        {item.measurements && (
                            <div className="measurements-summary-box mb-lg">
                                <div className="measurements-header">
                                    <Ruler size={14} className="gold-sparkle" />
                                    <span>Garment Measurements (Inches)</span>
                                </div>
                                <div className="measurements-tags-grid">
                                    {Object.entries(item.measurements).map(([key, val]) => (
                                        <div key={key} className="measurement-tag">
                                            <span className="measurement-key">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="measurement-val">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rental Date Selection */}
                        <DateRangePicker
                            onDateChange={handleDateChange}
                            rental3DayPrice={threeDayPrice}
                            securityDeposit={item.securityDeposit || 800}
                            handoverSpot={item.handoverSpot || 'Main Campus Gate 1 / Student Center'}
                        />

                        {/* Dual Action Buttons: Add to Bag (Keep Browsing) & Rent Now (Fast Booking) */}
                        <div className="product-action-buttons-grid mt-md">
                            <button
                                type="button"
                                className={`btn btn-lg btn-secondary add-to-bag-btn ${addedToBag ? 'btn-success-state' : ''}`}
                                onClick={handleAddToBagOnly}
                            >
                                {addedToBag ? (
                                    <>
                                        <CheckCircle2 size={18} className="success-icon" />
                                        <span>Added to Bag!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={18} />
                                        <span>Add to Bag</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-lg btn-fashion rent-now-btn"
                                onClick={handleRentNow}
                            >
                                <span>Rent Now</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Interactive Multi-Outfit Feedback Banner */}
                        {addedToBag && (
                            <div className="added-to-bag-feedback mt-sm">
                                <div className="feedback-content">
                                    <CheckCircle2 size={16} className="text-success" />
                                    <span>Outfit saved to your bag! Rent more or proceed to bag.</span>
                                </div>
                                <div className="feedback-actions">
                                    <Link to="/browse" className="feedback-link">
                                        + Rent Another Dress
                                    </Link>
                                    <Link to="/cart" className="feedback-cta-btn">
                                        View Bag ({itemCount || cartItems.length}) →
                                    </Link>
                                </div>
                            </div>
                        )}

                        <p className="checkout-guarantee-note mt-xs">
                            <Lock size={13} /> Refundable deposit returned within 24h of return check
                        </p>
                    </div>
                </div>

                {/* Lower FAQ & Rental Policy Accordion Section */}
                <div className="product-faq-section mt-3xl">
                    <div className="faq-section-header">
                        <HelpCircle size={20} className="gold-sparkle" />
                        <h2>Outfit Specifications & Student Rental FAQs</h2>
                    </div>

                    <div className="faq-accordion-container">
                        {/* FAQ 1: Fit & Measurements */}
                        <div className={`faq-accordion-item ${openFaq === 'measurements' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('measurements')}
                            >
                                <div className="faq-header-title">
                                    <Ruler size={17} className="burgundy-icon" />
                                    <span>Exact Fit & Alteration Policy</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p>
                                        Student occasion wear is peer-owned. We provide verified tape measurements (chest/bust, waist, length, and alteration allowance) so you can compare against your own clothes before renting.
                                    </p>
                                    <p className="mb-0 text-secondary">
                                        <strong>Fit Swap Guarantee:</strong> If the outfit does not match the lender's provided measurements at handover, notify us immediately for a full credit refund or alternate outfit replacement.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 2: Handover & Safe Meeting Points */}
                        <div className={`faq-accordion-item ${openFaq === 'handover' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('handover')}
                            >
                                <div className="faq-header-title">
                                    <MapPin size={17} className="burgundy-icon" />
                                    <span>How does the campus handover work?</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p>
                                        To protect student privacy, exact private residential addresses are not published. Handovers are scheduled at recognizable, safe public meeting points near campus (e.g. <strong>{item.handoverSpot || 'Main Campus Gate 1 / Student Center'}</strong>).
                                    </p>
                                    <p className="mb-0 text-secondary">
                                        Both students take a quick photo of the garment condition during handover to ensure mutual clarity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 3: Security Deposit & Return */}
                        <div className={`faq-accordion-item ${openFaq === 'deposit' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('deposit')}
                            >
                                <div className="faq-header-title">
                                    <ShieldCheck size={17} className="burgundy-icon" />
                                    <span>Refundable Security Deposit & Return Process</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <ul className="faq-bullet-list">
                                        <li>Your security deposit (<strong>₹{item.securityDeposit || 800}</strong>) is held safely by Vogue Loop during the rental period.</li>
                                        <li>Return the outfit to the lender on your agreed return date in the same condition.</li>
                                        <li>Once the lender confirms safe receipt, your security deposit is released back to your original payment method.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 4: Garment Care */}
                        <div className={`faq-accordion-item ${openFaq === 'care' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('care')}
                            >
                                <div className="faq-header-title">
                                    <Sparkles size={17} className="burgundy-icon" />
                                    <span>Garment Hygiene & Care Standards</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p className="mb-0">
                                        All student lenders agree to provide garments clean, sanitized, and steam-pressed prior to handover. Normal wear and tear is expected, but please treat rented outfits with care as you would a friend's wardrobe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <TrustLayer compact={true} />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default ProductDetail;

