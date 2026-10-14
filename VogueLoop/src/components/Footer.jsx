import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="navbar-logo mb-sm">
              <div className="logo-emblem">VL</div>
              <div className="logo-text-wrapper">
                <span className="logo-text-brand">VOGUE<span className="logo-text-gold">LOOP</span></span>
                <span className="logo-sub-tagline">CAMPUS FASHION LOOP</span>
              </div>
            </Link>
            <p className="footer-tagline">
              A zero-inventory, hyperlocal peer-to-peer fashion rental marketplace for verified students. Rent occasion wear from students nearby and share your closet.
            </p>
            <div className="footer-trust-pill">
              <ShieldCheck size={14} className="sage-icon" />
              <span>Enrolled Student Community • Safe Campus Landmark Meetups</span>
            </div>
          </div>

          {/* Simple, Streamlined Links */}
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link to="/browse">Browse Outfits</Link></li>
                <li><a href="/#how-it-works">How It Works</a></li>
                <li><Link to="/dashboard">Student Portal</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Trust & Safety</h4>
              <ul>
                <li><Link to="/policies">Campus Policies</Link></li>
                <li><Link to="/policies">Refundable Deposits</Link></li>
                <li><Link to="/policies">Handover Checklist</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} The Vogue Loop. Peer-to-Peer Student Marketplace.</p>
          <div className="footer-bottom-links">
            <Link to="/policies">Terms & Safety Standards</Link>
            <span className="footer-dot">•</span>
            <span className="footer-eco-note">Circular Fashion for Campus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
