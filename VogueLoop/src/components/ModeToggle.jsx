import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Sparkles } from 'lucide-react';
import './ModeToggle.css';

const ModeToggle = ({ variant = 'full', className = '' }) => {
  const { mode, setMode } = useAuth();
  const isLender = mode === 'lender';

  return (
    <div
      className={`mode-segmented-control mode-${variant} ${className}`}
      role="radiogroup"
      aria-label="VogueLoop Student Mode Switcher"
    >
      <div
        className={`mode-slider-pill ${isLender ? 'pos-lender' : 'pos-renter'}`}
        aria-hidden="true"
      />

      <button
        type="button"
        role="radio"
        aria-checked={!isLender}
        className={`mode-option-btn ${!isLender ? 'is-active' : ''}`}
        onClick={() => setMode('renter')}
        title="Switch to Renter Mode (Borrow Outfits)"
      >
        <ShoppingBag size={variant === 'compact' ? 13 : 16} className="mode-icon" />
        <span className="mode-label">
          {variant === 'compact' ? 'Rent' : 'Renting Outfits'}
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isLender}
        className={`mode-option-btn ${isLender ? 'is-active' : ''}`}
        onClick={() => setMode('lender')}
        title="Switch to Lender Mode (Host Wardrobe)"
      >
        <Sparkles size={variant === 'compact' ? 13 : 16} className="mode-icon" />
        <span className="mode-label">
          {variant === 'compact' ? 'Lend' : 'Lending Wardrobe'}
        </span>
      </button>
    </div>
  );
};

export default ModeToggle;
