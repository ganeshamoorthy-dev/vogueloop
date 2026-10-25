import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { getAppUrl } from '../utils/config';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container py-2xl">
        <div className="footer-main-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-logo" title="VogueLoop Home">
              <div className="footer-logo-emblem">VL</div>
              <span className="footer-logo-title">
                VOGUE<span className="footer-gold-text">LOOP</span>
              </span>
            </Link>
            <p className="footer-brand-tagline">
              A zero-inventory, hyperlocal peer-to-peer fashion rental marketplace for verified university students. Wear occasion wear from peers nearby and monetize your wardrobe sustainably.
            </p>
            <div className="footer-campus-coverage">
              <span className="coverage-title">Operational Campus Hubs:</span>
              <span className="coverage-list">University Hub • North Gate • Student Center • Library Plaza • PG Enclaves</span>
            </div>
          </div>

          {/* 4 Navigation Link Columns */}
          <div className="footer-links-grid">
            {/* Column 1: Campus Occasions */}
            <div className="footer-col">
              <h4>Campus Occasions</h4>
              <ul>
                <li><a href={getAppUrl('/browse?occasion=College%20Fest')}>College Fest Outfits</a></li>
                <li><a href={getAppUrl('/browse?occasion=Farewell%20%26%20Graduation')}>Farewell & Graduation</a></li>
                <li><a href={getAppUrl('/browse?occasion=Festive%20%26%20Ethnic%20Day')}>Festive & Ethnic Days</a></li>
                <li><a href={getAppUrl('/browse?occasion=Formals%20%26%20Placements')}>Placement Formals</a></li>
                <li><a href={getAppUrl('/browse?occasion=Parties%20%26%20Birthdays')}>Parties & Socials</a></li>
                <li><a href={getAppUrl('/browse?occasion=Weddings')}>Wedding Attire</a></li>
              </ul>
            </div>

            {/* Column 2: Marketplace */}
            <div className="footer-col">
              <h4>Marketplace</h4>
              <ul>
                <li><a href={getAppUrl('/browse')}>Browse All Outfits</a></li>
                <li><Link to="/list-your-outfit">List an Outfit to Closet</Link></li>
                <li><a href={getAppUrl('/cart')}>Escrow Rental Bag</a></li>
                <li><a href={getAppUrl('/dashboard?tab=wishlist')}>Saved Wishlist</a></li>
                <li><a href={getAppUrl('/dashboard')}>Student Dashboard</a></li>
                <li><a href={getAppUrl('/login')}>Student Sign In</a></li>
              </ul>
            </div>

            {/* Column 3: How It Works & Trust */}
            <div className="footer-col">
              <h4>How It Works & Trust</h4>
              <ul>
                <li><Link to="/how-it-works">The 4-Step Rental Loop</Link></li>
                <li><Link to="/trust-and-safety">Student ID Verification</Link></li>
                <li><Link to="/policies#deposits">Refundable Escrow Deposits</Link></li>
                <li><Link to="/policies#handover">Campus Landmark Spots</Link></li>
                <li><Link to="/policies#checklist">Handover Condition Check</Link></li>
                <li><Link to="/policies#disputes">Dispute Resolution Care</Link></li>
              </ul>
            </div>

            {/* Column 4: Standards & Policies */}
            <div className="footer-col">
              <h4>Safety & Standards</h4>
              <ul>
                <li><Link to="/policies#model">Zero-Inventory Model</Link></li>
                <li><Link to="/policies#checklist">Steam Sanitization Rules</Link></li>
                <li><Link to="/how-it-works">Renter & Host Duties</Link></li>
                <li><Link to="/policies">Campus Platform Policies</Link></li>
                <li><Link to="/policies">Terms of Service</Link></li>
                <li><Link to="/policies">Privacy & Student Data</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright-text">
            © {new Date().getFullYear()} <strong>VogueLoop</strong>. Campus Peer-to-Peer Fashion Rental Network.
          </div>
          <div className="footer-bottom-meta">
            <span className="footer-eco-badge">
              <Sparkles size={12} className="gold-icon" /> Circular Campus Wardrobe • Zero Warehouse Inventory
            </span>
            <span className="footer-dot">•</span>
            <Link to="/policies" className="footer-policy-link">Terms & Safety Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
