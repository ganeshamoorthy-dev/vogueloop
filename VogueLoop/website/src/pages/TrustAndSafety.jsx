import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Camera, CheckCircle2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { getAppUrl } from '../utils/config';
import './TrustAndSafety.css';

const TrustAndSafety = () => {
  return (
    <div className="trust-page">
      {/* Editorial Header */}
      <section className="trust-hero">
        <div className="container">
          <div className="trust-hero-content">
            <div className="trust-hero-pill">
              <ShieldCheck size={14} />
              <span>TRANSPARENT CAMPUS PROTECTIONS</span>
            </div>
            <h1>Trust & Safety at VogueLoop</h1>
            <p>
              Peer-to-peer fashion rental relies on real student trust, clear garment inspections, and refundable security deposits held in escrow. Here is exactly how we protect our community.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Trust Pillars */}
      <section className="trust-pillars-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">SAFETY ARCHITECTURE</span>
            <h2>How Every Transaction Is Protected</h2>
            <p>We eliminate friction while guaranteeing accountability between lenders and renters.</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-circle">
                <UserCheck size={24} />
              </div>
              <h3>Student ID Verification</h3>
              <p>
                Every active member confirms enrollment via college domain email (.edu / .ac.in) or student ID documentation. This prevents anonymous bad actors and ensures an accountable campus community.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-circle">
                <Lock size={24} />
              </div>
              <h3>Escrow Security Deposits</h3>
              <p>
                Security deposits (typically ₹600–₹1,000) are placed in escrow at the time of reservation. The deposit is held safely by VogueLoop and refunded in full upon return inspection.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-circle">
                <Camera size={24} />
              </div>
              <h3>Mandatory Photo Verification</h3>
              <p>
                During the landmark handover, both parties inspect key seams, zippers, and fabric condition. Both sides agree on the outfit state, eliminating ambiguous damage disputes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Sided Safety Architecture */}
      <section className="matrix-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-kicker">COMMUNITY PROTECTION</span>
            <h2>Comprehensive Safeguards for Renters & Hosts</h2>
            <p>
              Whether you are borrowing an outfit for an upcoming fest or earning from your closet, our platform standards keep you completely protected.
            </p>
          </div>

          <div className="matrix-grid">
            {/* Renter Protections */}
            <div className="matrix-card">
              <div className="matrix-header">
                <ShoppingBag size={18} className="sage-icon" />
                <span className="matrix-tag-renter">RENTER GUARANTEES</span>
              </div>
              <h3>Rent with Total Peace of Mind</h3>
              <div className="matrix-items-list">
                <div className="matrix-item">
                  <span className="matrix-item-check renter">✓</span>
                  <div>
                    <strong>Verified Campus Hosts</strong>
                    <span>Every wardrobe owner is student ID-verified before listing, ensuring genuine peer accountability.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check renter">✓</span>
                  <div>
                    <strong>Full Escrow Deposit Protection</strong>
                    <span>Your security deposit remains safeguarded in escrow and is promptly released back upon outfit return.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check renter">✓</span>
                  <div>
                    <strong>Pre-Handover Inspection Check</strong>
                    <span>Inspect zippers, fabric, and measurements at the campus spot before accepting your outfit.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check renter">✓</span>
                  <div>
                    <strong>48-Hour Fair Cancellation</strong>
                    <span>Change of plans? Receive an immediate full refund if you cancel at least 48 hours before your rental start date.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check renter">✓</span>
                  <div>
                    <strong>Zero Shipping Delays</strong>
                    <span>Handover happens directly at prominent campus landmarks within walking distance of hostels and lecture halls.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Host / Lender Protections */}
            <div className="matrix-card">
              <div className="matrix-header">
                <ShieldCheck size={18} className="wine-icon" />
                <span className="matrix-tag-host">CLOSET HOST GUARANTEES</span>
              </div>
              <h3>Lend & Earn Without Anxiety</h3>
              <div className="matrix-items-list">
                <div className="matrix-item">
                  <span className="matrix-item-check host">✓</span>
                  <div>
                    <strong>Refundable Security Deposit Backing</strong>
                    <span>Up to ₹1,000 security deposit is collected upfront from borrowers to protect against minor snags or late returns.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check host">✓</span>
                  <div>
                    <strong>Strict No-Alterations Policy</strong>
                    <span>Borrowers are legally bound never to pin, tailor, or alter your garments, preserving fabric integrity.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check host">✓</span>
                  <div>
                    <strong>Mutual Photo Check Documentation</strong>
                    <span>Both parties confirm garment condition at handover, eliminating subjective or ambiguous condition disputes.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check host">✓</span>
                  <div>
                    <strong>100% Calendar & Booking Control</strong>
                    <span>Block your own event dates anytime. You review and approve every incoming student borrow request.</span>
                  </div>
                </div>
                <div className="matrix-item">
                  <span className="matrix-item-check host">✓</span>
                  <div>
                    <strong>Trusted Peer Community</strong>
                    <span>Rent only to verified classmates and campus peers who treat shared fashion with personal care.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy and Support CTA */}
      <div className="container py-3xl">
        <div className="card text-center" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h3>Questions About Safety or Security Deposits?</h3>
          <p className="mt-sm mb-lg">
            Read our complete campus policies or get in touch with our student community safety coordinators.
          </p>
          <div className="flex justify-center gap-md" style={{ flexWrap: 'wrap' }}>
            <Link to="/policies" className="btn btn-secondary">
              Read Complete Policies
            </Link>
            <a href={getAppUrl('/browse')} className="btn btn-fashion">
              <span>Explore Verified Outfits</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustAndSafety;
