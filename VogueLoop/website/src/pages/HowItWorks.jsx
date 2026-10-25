import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { getAppUrl } from '../utils/config';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-page">
      {/* Editorial Hero */}
      <section className="how-hero">
        <div className="container">
          <div className="how-hero-content">
            <div className="how-hero-pill">
              <Sparkles size={14} />
              <span>THE CAMPUS RENTAL LIFECYCLE</span>
            </div>
            <h1>How VogueLoop Works</h1>
            <p>
              A sustainable, zero-inventory peer-to-peer wardrobe network for university students. Discover outfits from nearby student closets, meet at recognizable campus landmarks, wear with pride, and return seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Steps Lifecycle */}
      <section className="how-timeline-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">STEP-BY-STEP WORKFLOW</span>
            <h2>From Discovery to Return</h2>
            <p>Every step is built on campus proximity, student verification, and clear security deposit protections.</p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <span className="how-step-number">01</span>
              <h3>Discover & Reserve</h3>
              <p>
                Browse verified campus closets by occasion, size, or distance. Check precise measurements (bust, length, shoulders) and reserve your preferred 3-day or extended duration.
              </p>
              <div className="how-step-highlight">
                <Calendar size={14} />
                <span>Transparent 3-day student pricing</span>
              </div>
            </div>

            <div className="how-step-card">
              <span className="how-step-number">02</span>
              <h3>Deposit Escrow</h3>
              <p>
                Confirm your reservation with a standard refundable security deposit. Your deposit is safeguarded in escrow and never transferred to the lender until post-rental return.
              </p>
              <div className="how-step-highlight">
                <CreditCard size={14} />
                <span>100% refundable upon return</span>
              </div>
            </div>

            <div className="how-step-card">
              <span className="how-step-number">03</span>
              <h3>Landmark Handover</h3>
              <p>
                Meet your peer at a verified public campus meeting spot (such as Main Campus Gate 1, Student Center, or Campus Library). Inspect the garment together and document condition.
              </p>
              <div className="how-step-highlight">
                <MapPin size={14} />
                <span>Zero shipping or transit delays</span>
              </div>
            </div>

            <div className="how-step-card">
              <span className="how-step-number">04</span>
              <h3>Return & Payout</h3>
              <p>
                Return the outfit on the scheduled end date at the same campus spot. The owner confirms garment condition, and your security deposit is instantly released back to your account.
              </p>
              <div className="how-step-highlight">
                <RefreshCw size={14} />
                <span>Safe return loop completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Renter vs Owner Responsibilities */}
      <section className="responsibilities-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">COMMUNITY STANDARDS</span>
            <h2>Renter & Owner Responsibilities</h2>
            <p>Mutual accountability is the bedrock of our campus community.</p>
          </div>

          <div className="roles-grid">
            <div className="role-card">
              <span className="role-badge renter">RENTER RESPONSIBILITIES</span>
              <h3>For Borrowers</h3>
              <ul className="role-list">
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Verify your student status with your official institutional email or college ID.</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Inspect garment seams, zippers, and fabric condition at the handover meetup.</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Treat items with care: do not perform permanent alterations or heavy spraying.</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Return the garment punctually on the agreed date to ensure full deposit release.</span>
                </li>
              </ul>
            </div>

            <div className="role-card">
              <span className="role-badge lender">OWNER RESPONSIBILITIES</span>
              <h3>For Closet Lenders</h3>
              <ul className="role-list">
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Provide accurate photos and truthful garment condition ratings (e.g., Like New, Minor Wear).</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Hand over garments steam-sanitized, neatly packaged, and ready to wear.</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Respond promptly to student booking requests and adhere to scheduled meetup times.</span>
                </li>
                <li className="role-item">
                  <CheckCircle2 size={16} className="role-icon-check" />
                  <span>Promptly sign off on the return inspection to initiate immediate deposit refunds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="container">
        <div className="how-cta-banner">
          <h2>Ready to Experience Campus Fashion Rental?</h2>
          <p>
            Join hundreds of university peers discovering festive lehengas, farewell sarees, and placement formals without the retail price tag.
          </p>
          <div className="how-cta-actions">
            <a href={getAppUrl('/browse')} className="btn btn-lg btn-fashion">
              <span>Browse Marketplace Outfits</span>
              <ArrowRight size={16} />
            </a>
            <Link to="/list-your-outfit" className="btn btn-lg btn-secondary">
              Learn How to List Your Closet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
