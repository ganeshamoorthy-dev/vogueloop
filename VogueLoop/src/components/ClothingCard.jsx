import { Link } from 'react-router-dom';
import { Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import AvailabilityBadge from './AvailabilityBadge';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './ClothingCard.css';

const ClothingCard = ({ item }) => {
    const { isInWishlist, toggleWishlist } = useListings();
    const liked = isInWishlist(item.id);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(item.id);
    };

    const threeDayPrice = item.rental3DayPrice || (item.pricePerDay ? Math.round(item.pricePerDay * 3) : 799);
    const imageUrl = (item.images && item.images.length > 0) ? item.images[0] : FALLBACK_IMAGE;
    const sizeDisplay = item.primarySize || (item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Free Size');

    return (
        <div className="clothing-card-wrapper">
            <Link to={`/product/${item.id}`} className="clothing-card">
                <div className="card-image-wrapper">
                    <img
                        src={imageUrl}
                        alt={item.title}
                        className="card-image"
                        loading="lazy"
                        onError={handleImageError}
                    />

                    {/* Wishlist Button */}
                    <button
                        type="button"
                        className={`wishlist-btn ${liked ? 'active' : ''}`}
                        onClick={handleWishlistClick}
                        aria-label="Add to Wishlist"
                    >
                        <Heart size={18} fill={liked ? 'var(--brand-fashion)' : 'none'} color={liked ? 'var(--brand-fashion)' : 'currentColor'} />
                    </button>

                    {/* Availability Overlay Badge */}
                    <div className="card-badge-container">
                        <AvailabilityBadge available={item.available !== false} text="Available" size="sm" />
                    </div>

                    {/* Quick View Overlay */}
                    <div className="card-overlay">
                        <span className="view-details-btn">View Details</span>
                    </div>
                </div>

                <div className="card-content">
                    {/* Size & Occasion Row */}
                    <div className="card-category-row">
                        <span className="card-size-badge">Size {sizeDisplay}</span>
                        {item.occasion && <span className="card-occasion-tag">{item.occasion}</span>}
                    </div>

                    {/* Title */}
                    <h3 className="card-title">{item.title}</h3>

                    {/* Hyperlocal Proximity & Lender Info */}
                    <div className="card-location-row">
                        <span className="card-location-text">
                            <MapPin size={13} className="pin-icon" />
                            {item.locality || 'University Hub'} • {item.distanceKm ? `${item.distanceKm} km away` : 'Near Campus'}
                        </span>
                    </div>

                    <div className="card-lender-indicator">
                        <CheckCircle2 size={13} className="sage-check" />
                        <span>Listed by <strong>{item.owner || 'Verified Student'}</strong></span>
                    </div>

                    {/* Price & Duration */}
                    <div className="card-footer">
                        <div className="card-price-group">
                            <span className="price-amount">₹{threeDayPrice}</span>
                            <span className="price-unit">/ 3 days</span>
                        </div>
                        <div className="price-deposit-note">
                            + ₹{item.securityDeposit || 700} refundable deposit
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ClothingCard;
