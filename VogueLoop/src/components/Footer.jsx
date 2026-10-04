import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo mb-md">
              <div className="logo-emblem">VL</div>
              <div className="logo-text-wrapper">
                <span className="logo-text-brand">VOGUE<span className="logo-text-gold">LOOP</span></span>
                <span className="logo-sub-tagline">LUXURY ARCHIVE</span>
              </div>
            </Link>
            <p className="footer-tagline">
              VogueLoop is India's premier luxury fashion rental archive. Wear iconic designer lehengas, sarees, sherwanis, and gowns with complete peace of mind.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={16} />
              <span>100% Sanitized & Quality Inspected Guarantee</span>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Discover</h4>
              <ul>
                <li><Link to="/browse">All Collections</Link></li>
                <li><Link to="/browse?occasion=Wedding">Wedding Collection</Link></li>
                <li><Link to="/browse?occasion=Reception">Reception Glam</Link></li>
                <li><Link to="/browse?category=Lehenga">Designer Lehengas</Link></li>
                <li><Link to="/browse?category=Sherwani">Men's Sherwanis</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Occasions</h4>
              <ul>
                <li><Link to="/browse?occasion=Wedding">Weddings</Link></li>
                <li><Link to="/browse?occasion=Cocktail">Cocktail Parties</Link></li>
                <li><Link to="/browse?occasion=Formal">Formal Galas</Link></li>
                <li><Link to="/browse?occasion=Birthday">Birthday Celebrations</Link></li>
                <li><Link to="/browse?occasion=Date Night">Date Nights</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Owners & Lenders</h4>
              <ul>
                <li><Link to="/upload">List Your Outfit</Link></li>
                <li><Link to="/dashboard">Owner Dashboard</Link></li>
                <li><Link to="/how-it-works">Lender Protection Guarantee</Link></li>
                <li><Link to="/earnings-calculator">Earnings Calculator</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Trust & Care</h4>
              <ul>
                <li><Link to="/trust">The Trusted Guarantee</Link></li>
                <li><Link to="/cleaning">Dry Cleaning Standards</Link></li>
                <li><Link to="/fit-policy">Fit Guarantee</Link></li>
                <li><Link to="/support">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VogueLoop. Trusted Luxury Fashion Rental Marketplace.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/trust">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
