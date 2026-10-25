import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getAppUrl } from '../utils/config';
import './MarketingNavbar.css';

const MarketingNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="marketing-navbar-header">
      <nav className="marketing-navbar">
        <div className="container">
          <div className="marketing-navbar-content">
            {/* Brand Logo -> Always returns to Website Home */}
            <Link to="/" className="marketing-logo" title="VogueLoop — Campus Fashion Rental">
              <div className="marketing-logo-emblem">VL</div>
              <div className="marketing-logo-text-wrapper">
                <span className="marketing-logo-title">
                  VOGUE<span className="marketing-gold-text">LOOP</span>
                </span>
                <span className="marketing-logo-sub">Campus Rental Closets</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="marketing-nav-links">
              <Link
                to="/how-it-works"
                className={`marketing-nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
              >
                How It Works
              </Link>
              <a
                href={getAppUrl('/browse')}
                className="marketing-nav-link"
              >
                Explore Outfits
              </a>
              <Link
                to="/trust-and-safety"
                className={`marketing-nav-link ${isActive('/trust-and-safety') ? 'active' : ''}`}
              >
                Trust & Safety
              </Link>
              <Link
                to="/list-your-outfit"
                className={`marketing-nav-link ${isActive('/list-your-outfit') ? 'active' : ''}`}
              >
                List Your Outfit
              </Link>
            </div>

            {/* Right Action Cluster */}
            <div className="marketing-right-cluster">
              {/* Theme Switcher */}
              <button
                type="button"
                className="marketing-theme-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Midnight Dark'} Theme`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Action Buttons */}
              <div className="marketing-cta-group">
                <a
                  href={getAppUrl('/login')}
                  className="btn btn-sm btn-secondary"
                >
                  Sign In
                </a>
                <a
                  href={getAppUrl('/browse')}
                  className="btn btn-sm btn-fashion"
                >
                  <span>Browse Outfits</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                className="marketing-mobile-toggle"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="marketing-mobile-drawer animate-fade-in">
          <Link
            to="/how-it-works"
            className="marketing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <a
            href={getAppUrl('/browse')}
            className="marketing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Outfits (Marketplace)
          </a>
          <Link
            to="/trust-and-safety"
            className="marketing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trust & Safety
          </Link>
          <Link
            to="/list-your-outfit"
            className="marketing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            List Your Outfit
          </Link>
          <Link
            to="/policies"
            className="marketing-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Platform Policies & Terms
          </Link>
          <div className="flex gap-sm mt-md">
            <a
              href={getAppUrl('/login')}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Sign In
            </a>
            <a
              href={getAppUrl('/browse')}
              className="btn btn-fashion"
              style={{ flex: 1 }}
            >
              Browse Closets
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNavbar;
