import { ArrowRight, Camera, DollarSign, MapPin, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { getAppUrl } from '../utils/config';
import './ListYourOutfit.css';

const ListYourOutfit = () => {
  return (
    <div className="list-page">
      {/* Editorial Hero */}
      <section className="list-hero">
        <div className="container">
          <div className="list-hero-content">
            <div className="list-hero-pill">
              <Sparkles size={14} />
              <span>STUDENT CLOSET MONETIZATION</span>
            </div>
            <h1>Turn Your Wardrobe Into Passive Campus Income</h1>
            <p>
              Have ethnic wear, lehengas, sherwanis, or farewell gowns sitting idle in your closet? Share them with verified campus peers and earn recurring income with zero inventory fees.
            </p>
            <div className="list-hero-actions">
              <a href={getAppUrl('/upload')} className="btn btn-lg btn-fashion">
                <span>Start Listing Your Outfit</span>
                <ArrowRight size={16} />
              </a>
              <a href={getAppUrl('/browse')} className="btn btn-lg btn-secondary">
                See What Others Are Listing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps to List */}
      <section className="py-3xl">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">SIMPLE ONBOARDING</span>
            <h2>List Your Outfit in 3 Minutes</h2>
            <p>No complicated listing processes. Snap, price, and publish directly to the student marketplace.</p>
          </div>

          <div className="list-steps-grid">
            <div className="list-step-card">
              <div className="list-step-icon">
                <Camera size={22} />
              </div>
              <h3>1. Snap 3 Clear Photos</h3>
              <p>
                Take natural light photos: full front view, back view, and a close-up of embroidery or fabric quality.
              </p>
            </div>

            <div className="list-step-card">
              <div className="list-step-icon">
                <DollarSign size={22} />
              </div>
              <h3>2. Set 3-Day Pricing</h3>
              <p>
                We suggest realistic student rental rates (typically ₹599–₹999 for 3 days) plus a matching refundable security deposit.
              </p>
            </div>

            <div className="list-step-card">
              <div className="list-step-icon">
                <MapPin size={22} />
              </div>
              <h3>3. Pick Campus Meetup Spot</h3>
              <p>
                Choose a familiar campus gate or landmark (e.g. Main Campus Gate 1, Student Hub) for effortless, safe handovers.
              </p>
            </div>

            <div className="list-step-card">
              <div className="list-step-icon">
                <ShieldCheck size={22} />
              </div>
              <h3>4. Accept Requests & Earn</h3>
              <p>
                Approve booking requests from verified campus students, hand over the outfit, and receive your payout upon return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Garment Eligibility & Standards */}
      <section className="guidelines-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">GARMENT STANDARDS</span>
            <h2>Eligibility & Quality Requirements</h2>
            <p>To ensure high community satisfaction, every listed outfit must meet standard guidelines.</p>
          </div>

          <div className="guidelines-grid">
            <div className="guideline-card">
              <h3 className="guideline-title">
                <CheckCircle2 size={20} className="sage-check" />
                <span>Eligible Garments</span>
              </h3>
              <ul className="guideline-list">
                <li className="guideline-item">
                  <span className="sage-check">✓</span>
                  <div>
                    <strong>Festive & Traditional Wear</strong>
                    <span>Lehengas, sarees, anarkalis, sherwanis, kurtas, and Indo-Western coordinates.</span>
                  </div>
                </li>
                <li className="guideline-item">
                  <span className="sage-check">✓</span>
                  <div>
                    <strong>Formal & Presentation Wear</strong>
                    <span>Tailored suits, blazers, and bandhgalas for placement drives and college formals.</span>
                  </div>
                </li>
                <li className="guideline-item">
                  <span className="sage-check">✓</span>
                  <div>
                    <strong>Party & Gala Attire</strong>
                    <span>Evening gowns, cocktail slips, and farewell event garments.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="guideline-card">
              <h3 className="guideline-title">
                <ShieldCheck size={20} style={{ color: 'var(--brand-fashion)' }} />
                <span>Condition & Care Expectations</span>
              </h3>
              <ul className="guideline-list">
                <li className="guideline-item">
                  <span style={{ color: 'var(--brand-fashion)' }}>•</span>
                  <div>
                    <strong>Clean & Steam Sanitized</strong>
                    <span>All outfits must be freshly dry-cleaned or thoroughly steam-sanitized prior to handover.</span>
                  </div>
                </li>
                <li className="guideline-item">
                  <span style={{ color: 'var(--brand-fashion)' }}>•</span>
                  <div>
                    <strong>Intact Zippers & Embellishments</strong>
                    <span>No broken hooks, missing buttons, or prominent unresolved fabric snags.</span>
                  </div>
                </li>
                <li className="guideline-item">
                  <span style={{ color: 'var(--brand-fashion)' }}>•</span>
                  <div>
                    <strong>Accurate Sizing & Measurements</strong>
                    <span>Specify chest/bust, waist, and length measurements to eliminate size mismatch issues.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Marketplace Listing Action */}
      <div className="container py-3xl text-center">
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2>Ready to Monetize Your Wardrobe?</h2>
          <p className="mt-sm mb-lg">
            Sign in with your campus account and publish your first outfit listing to the marketplace in less than 3 minutes.
          </p>
          <a href={getAppUrl('/upload')} className="btn btn-lg btn-fashion">
            <span>Open Listing Form in Marketplace</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListYourOutfit;
