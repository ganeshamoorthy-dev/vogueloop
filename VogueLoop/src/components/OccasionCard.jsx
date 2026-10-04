import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './OccasionCard.css';

const OccasionCard = ({ title, image, count = '30+ Outfits', selected = false }) => {
  return (
    <Link
      to={`/browse?occasion=${encodeURIComponent(title)}`}
      className={`occasion-card ${selected ? 'selected' : ''}`}
    >
      <div className="occasion-image-wrapper">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          className="occasion-image"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="occasion-overlay" />
      </div>

      {selected && (
        <div className="occasion-selected-badge">
          <Check size={12} />
          <span>Selected</span>
        </div>
      )}

      <div className="occasion-content">
        <span className="occasion-count">{count}</span>
        <h3 className="occasion-title">{title}</h3>
        <span className="occasion-explore">
          Explore Collection <ArrowRight size={14} className="explore-arrow" />
        </span>
      </div>
    </Link>
  );
};

export default OccasionCard;
