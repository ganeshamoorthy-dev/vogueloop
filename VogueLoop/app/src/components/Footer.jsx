import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { getWebsiteUrl } from '../utils/config';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container py-2xl">
        <div className="footer-main-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-column">
            <a href={getWebsiteUrl('/')} className="footer-logo" title="Back to VogueLoop Public Website">
              <div className="footer-logo-emblem">VL</div>
              <span className="footer-logo-title">
                VOGUE<span className="footer-gold-text">LOOP</span>
              </span>
            </a>
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
                <li><Link to="/browse?occasion=College%20Fest">College Fest Outfits</Link></li>
                <li><Link to="/browse?occasion=Farewell%20%26%20Graduation">Farewell & Graduation</Link></li>
                <li><Link to="/browse?occasion=Festive%20%26%20Ethnic%20Day">Festive & Ethnic Days</Link></li>
                <li><Link to="/browse?occasion=Formals%20%26%20Placements">Placement Formals</Link></li>
                <li><Link to="/browse?occasion=Parties%20%26%20Birthdays">Parties & Socials</Link></li>
                <li><Link to="/browse?occasion=Weddings">Wedding Attire</Link></li>
              </ul>
            </div>

            {/* Column 2: Marketplace */}
            <div className="footer-col">
              <h4>Marketplace</h4>
              <ul>
                <li><Link to="/browse">Browse All Outfits</Link></li>
                <li><Link to="/upload">List an Outfit to Closet</Link></li>
                <li><Link to="/cart">Escrow Rental Bag</Link></li>
                <li><Link to="/dashboard?tab=wishlist">Saved Wishlist</Link></li>
                <li><Link to="/dashboard">Student Dashboard</Link></li>
                <li><Link to="/login">Student Sign In</Link></li>
              </ul>
            </div>

            {/* Column 3: How It Works & Trust (Linking to Website) */}
            <div className="footer-col">
              <h4>How It Works & Trust</h4>
              <ul>
                <li><a href={getWebsiteUrl('/how-it-works')}>The 4-Step Rental Loop</a></li>
                <li><a href={getWebsiteUrl('/trust-and-safety')}>Student ID Verification</a></li>
                <li><a href={getWebsiteUrl('/policies#deposits')}>Refundable Escrow Deposits</a></li>
                <li><a href={getWebsiteUrl('/policies#handover')}>Campus Landmark Spots</a></li>
                <li><a href={getWebsiteUrl('/policies#checklist')}>Handover Condition Check</a></li>
                <li><a href={getWebsiteUrl('/policies#disputes')}>Dispute Resolution Care</a></li>
              </ul>
            </div>

            {/* Column 4: Standards & Policies (Linking to Website) */}
            <div className="footer-col">
              <h4>Safety & Standards</h4>
              <ul>
                <li><a href={getWebsiteUrl('/policies#model')}>Zero-Inventory Model</a></li>
                <li><a href={getWebsiteUrl('/policies#checklist')}>Steam Sanitization Rules</a></li>
                <li><a href={getWebsiteUrl('/how-it-works')}>Renter & Host Duties</a></li>
                <li><a href={getWebsiteUrl('/policies')}>Campus Platform Policies</a></li>
                <li><a href={getWebsiteUrl('/policies')}>Terms of Service</a></li>
                <li><a href={getWebsiteUrl('/policies')}>Privacy & Student Data</a></li>
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
            <a href={getWebsiteUrl('/policies')} className="footer-policy-link">Terms & Safety Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
