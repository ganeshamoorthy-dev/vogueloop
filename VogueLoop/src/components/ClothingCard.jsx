import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
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

    const threeDayPrice = item.pricePerDay ? Math.round(item.pricePerDay * 3) : 1499;
    const imageUrl = (item.images && item.images.length > 0) ? item.images[0] : FALLBACK_IMAGE;

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
                    <div className="card-category-row">
                        <span className="card-category">{item.category}</span>
                        {item.occasion && <span className="card-occasion-tag">{item.occasion}</span>}
                    </div>

                    <h3 className="card-title">{item.title}</h3>

                    <div className="card-rating">
                        <Star size={14} className="star-icon" fill="#C9A96E" color="#C9A96E" />
                        <span className="rating-score">{item.rating || '4.8'}</span>
                        <span className="rating-count">({item.reviews || 12})</span>
                    </div>

                    <div className="card-footer">
                        <div className="card-price-group">
                            <span className="price-amount">₹{item.pricePerDay}</span>
                            <span className="price-unit">/day</span>
                        </div>
                        <div className="price-period-est">
                            ₹{threeDayPrice} / 3 days
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ClothingCard;
