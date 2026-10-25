import { ArrowRight } from 'lucide-react';
import { getAppUrl } from '../utils/config';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './OccasionCard.css';

const OccasionCard = ({ title, image, count = 'Available Nearby' }) => {
  const marketplaceOccasionUrl = getAppUrl(`/browse?occasion=${encodeURIComponent(title)}`);

  return (
    <a
      href={marketplaceOccasionUrl}
      className="occasion-card"
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

      <div className="occasion-content">
        <span className="occasion-count">{count}</span>
        <h3 className="occasion-title">{title}</h3>
        <span className="occasion-explore">
          Explore Outfits <ArrowRight size={14} className="explore-arrow" />
        </span>
      </div>
    </a>
  );
};

export default OccasionCard;
