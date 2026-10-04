import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star, ShoppingBag, ChevronLeft, ChevronRight, Heart,
    ShieldCheck, Sparkles, Truck, CheckCircle2, UserCheck, Lock, ChevronDown, HelpCircle, FileText, RefreshCw
} from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DateRangePicker from '../components/DateRangePicker';
import AvailabilityBadge from '../components/AvailabilityBadge';
import TrustBadge from '../components/TrustBadge';
import TrustLayer from '../components/TrustLayer';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getListingById, isInWishlist, toggleWishlist, wishlist } = useListings();
    const { addToCart } = useCart();
    const { isAuthenticated, login } = useAuth();

    const item = getListingById(id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(item?.sizes ? item.sizes[0] : 'M');
    const [rentalDates, setRentalDates] = useState({ start: null, end: null });

    // Accordion state (default open first FAQ item)
    const [openFaq, setOpenFaq] = useState('description');

    if (!item) {
        return (
            <div className="product-detail-page">
                <div className="container py-3xl text-center">
                    <div className="not-found-card">
                        <h2>Outfit Not Found</h2>
                        <p>The dress you are looking for may have been rented or removed.</p>
                        <button onClick={() => navigate('/browse')} className="btn btn-primary mt-md">
                            Browse Collection
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const liked = isInWishlist(item.id);
    const itemImages = (item.images && item.images.length > 0) ? item.images : [FALLBACK_IMAGE];
    const mainImageUrl = itemImages[currentImageIndex] || itemImages[0] || FALLBACK_IMAGE;

    const handleDateChange = (startDate, endDate) => {
        setRentalDates({ start: startDate, end: endDate });
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            login({ id: 1, name: 'Guest Renter', email: 'guest@vogueloop.com', role: 'customer' });
        }

        addToCart(
            {
                ...item,
                selectedSize,
            },
            rentalDates.start,
            rentalDates.end
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
                {/* Back Navigation & Breadcrumb */}
                <div className="detail-breadcrumb mb-md">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ChevronLeft size={16} />
                        Back to Outfits
                    </button>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/browse">Browse</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{item.title}</span>
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

                        {/* Minimal 3-Icon Trust Bar */}
                        <div className="gallery-trust-strip mt-md">
                            <div className="trust-strip-item">
                                <CheckCircle2 size={14} className="sage-icon" />
                                <span>100% Fit Guarantee</span>
                            </div>
                            <div className="trust-strip-item">
                                <Sparkles size={14} className="gold-sparkle" />
                                <span>Sanitized Dry Clean</span>
                            </div>
                            <div className="trust-strip-item">
                                <Truck size={14} className="navy-icon" />
                                <span>Free Doorstep Return</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clean Action-Focused Panel */}
                    <div className="product-info-panel">
                        {/* Status Badges Row */}
                        <div className="product-badges-row mb-xs">
                            <AvailabilityBadge available={item.available !== false} text="Available for Rent" />
                            <TrustBadge type="verified" text="Verified Lender" />
                            {item.condition && <span className="badge badge-gold">{item.condition}</span>}
                        </div>

                        {/* Title & Category Header */}
                        <div className="product-title-group">
                            <span className="product-category-label">
                                {item.category} • {item.occasion || 'Special Occasion'}
                            </span>
                            <h1 className="product-title">{item.title}</h1>
                        </div>

                        {/* Rating Bar */}
                        <div className="product-rating-bar">
                            <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="#C9A96E" color="#C9A96E" />
                                ))}
                            </div>
                            <span className="rating-value">{item.rating || '4.9'}</span>
                            <span className="rating-count">({item.reviews || 28} verified renter reviews)</span>
                        </div>

                        {/* Pricing & Retail Comparison Box */}
                        <div className="product-pricing-box">
                            <div className="price-main">
                                <span className="price-number">₹{item.pricePerDay}</span>
                                <span className="price-per">/ day</span>
                            </div>
                            {item.retailValue && (
                                <div className="retail-comparison">
                                    <span>Est. Retail Value: <strong>₹{item.retailValue.toLocaleString('en-IN')}</strong></span>
                                    <span className="savings-badge">Save ~90%</span>
                                </div>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="product-short-desc">{item.description}</p>

                        {/* Lender Quick Verification Bar */}
                        <div className="lender-quick-bar mb-lg">
                            <UserCheck size={16} className="navy-icon" />
                            <span>Listed by <strong>{item.owner}</strong> • Verified Lender (99% Response Rate)</span>
                        </div>

                        {/* Size Selection Section */}
                        <div className="size-selector-section">
                            <div className="size-header">
                                <label className="form-label">Select Size</label>
                                <span className="fit-note">Fits true to size</span>
                            </div>
                            <div className="size-options-grid">
                                {item.sizes ? item.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                )) : <span className="text-secondary">Free Size</span>}
                            </div>
                        </div>

                        {/* Rental Date Selection */}
                        <DateRangePicker
                            onDateChange={handleDateChange}
                            pricePerDay={item.pricePerDay}
                            securityDeposit={item.securityDeposit || 1500}
                        />

                        {/* Primary Action Button */}
                        <button
                            className="btn btn-lg btn-primary add-to-cart-btn mt-md"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag size={18} />
                            Rent This Outfit
                        </button>

                        <p className="checkout-guarantee-note mt-xs">
                            <Lock size={13} /> 100% Risk-Free Booking • Free Cancellations 48h before delivery
                        </p>
                    </div>
                </div>

                {/* Dedicated Lower FAQ & Policy Accordion Section */}
                <div className="product-faq-section mt-3xl">
                    <div className="faq-section-header">
                        <HelpCircle size={20} className="gold-sparkle" />
                        <h2>Outfit Details & Rental FAQs</h2>
                    </div>

                    <div className="faq-accordion-container">
                        {/* FAQ 1: Description & Style Notes */}
                        <div className={`faq-accordion-item ${openFaq === 'description' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('description')}
                            >
                                <div className="faq-header-title">
                                    <FileText size={17} className="burgundy-icon" />
                                    <span>Outfit Details & Styling Specifications</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p>{item.description}</p>
                                    <p className="mb-0 text-secondary">
                                        Crafted with premium fabrics, intricate hand-embroidery, and durable inner lining for maximum comfort during long events.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 2: Lender Verification */}
                        <div className={`faq-accordion-item ${openFaq === 'lender' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('lender')}
                            >
                                <div className="faq-header-title">
                                    <UserCheck size={17} className="burgundy-icon" />
                                    <span>Lender Verification & Authenticity Guarantee</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p>
                                        Listed by verified wardrobe lender <strong>{item.owner}</strong>. Every listing on VogueLoop undergoes strict identity verification, physical condition checks, and authenticity validation before approval.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 3: Dry Cleaning & Returns */}
                        <div className={`faq-accordion-item ${openFaq === 'care' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('care')}
                            >
                                <div className="faq-header-title">
                                    <Sparkles size={17} className="burgundy-icon" />
                                    <span>Sanitization, Eco Dry Cleaning & Doorstep Returns</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <ul className="faq-bullet-list">
                                        <li>Every outfit is sanitized, eco dry-cleaned, and steam-pressed prior to delivery.</li>
                                        <li>Delivered in a protective luxury garment bag with a pre-printed return courier label.</li>
                                        <li>No cleaning required upon return — simply pack in the prepaid return bag and hand it over to our courier partner.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* FAQ 4: Size & Fit Exchange */}
                        <div className={`faq-accordion-item ${openFaq === 'fit' ? 'open' : ''}`}>
                            <button
                                type="button"
                                className="faq-accordion-header"
                                onClick={() => toggleFaq('fit')}
                            >
                                <div className="faq-header-title">
                                    <RefreshCw size={17} className="burgundy-icon" />
                                    <span>What if the outfit doesn't fit?</span>
                                </div>
                                <ChevronDown size={18} className="faq-chevron" />
                            </button>
                            <div className="faq-accordion-body">
                                <div className="faq-inner-content">
                                    <p className="mb-0">
                                        VogueLoop offers a <strong>100% Fit Guarantee</strong>. If your outfit arrives and does not fit as described, notify us within 24 hours of delivery for a free immediate replacement exchange or full credit refund.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verified Renter Reviews Section */}
                <div className="reviews-section mt-3xl">
                    <div className="section-header">
                        <h2>Verified Renter Reviews ({item.reviews || 28})</h2>
                    </div>

                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <strong>Ananya M.</strong>
                                    <span className="review-date">Rented for Wedding • 2 weeks ago</span>
                                </div>
                                <div className="rating-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="#C9A96E" color="#C9A96E" />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">
                                "Absoutely stunning outfit! It arrived in immaculate condition, smelled fresh, and fitted perfectly. Received so many compliments at my cousin's wedding!"
                            </p>
                        </div>

                        <div className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <strong>Siddharth K.</strong>
                                    <span className="review-date">Rented for Reception • 1 month ago</span>
                                </div>
                                <div className="rating-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="#C9A96E" color="#C9A96E" />
                                    ))}
                                </div>
                            </div>
                            <p className="review-text">
                                "The fabric quality and embroidery detail were top tier. Return process was super smooth with doorstep courier pickup."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <TrustLayer compact={true} />
            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default ProductDetail;
