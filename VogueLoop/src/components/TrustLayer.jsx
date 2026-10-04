import { ShieldCheck, Sparkles, UserCheck, CreditCard, RotateCcw, Check } from 'lucide-react';
import './TrustLayer.css';

const TrustLayer = ({ compact = false }) => {
  const trustPoints = [
    {
      icon: <UserCheck className="trust-icon" size={22} />,
      title: 'Verified Owners',
      description: 'Identity & garment authenticity verified for 100% confidence.',
    },
    {
      icon: <Sparkles className="trust-icon" size={22} />,
      title: 'Dry Cleaned',
      description: 'Sanitized & dry-cleaned using eco-friendly luxury care.',
    },
    {
      icon: <ShieldCheck className="trust-icon" size={22} />,
      title: 'Quality Checked',
      description: 'Hand-inspected before every shipment for flawless condition.',
    },
    {
      icon: <CreditCard className="trust-icon" size={22} />,
      title: 'Secure Payments',
      description: 'Refundable security deposit protection & encrypted checkout.',
    },
    {
      icon: <RotateCcw className="trust-icon" size={22} />,
      title: 'Easy Returns',
      description: 'Pre-paid return packaging with complimentary doorstep pickup.',
    },
  ];

  if (compact) {
    return (
      <div className="container py-lg">
        <div className="trust-layer-compact">
          <div className="trust-header-compact">
            <ShieldCheck size={18} className="navy-shield" />
            <span className="trust-title-compact">Trusted Rental Guarantee</span>
          </div>
          <div className="trust-list-compact">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="trust-item-compact">
                <span className="sage-check">✓</span>
                <span>{point.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="trust-layer-section">
      <div className="container">
        <div className="trust-banner">
          <div className="trust-banner-header">
            <div className="trust-badge-pill">
              <ShieldCheck size={16} />
              <span>THE VOGUELOOP GUARANTEE</span>
            </div>
            <h2>Trusted Rental Experience</h2>
            <p>Every outfit on VogueLoop is backed by our strict quality, authenticity, and hygiene standards.</p>
          </div>

          <div className="trust-grid">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="trust-card">
                <div className="trust-icon-wrapper">
                  {point.icon}
                </div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
                <div className="trust-status">
                  <span className="sage-check"><Check size={13} inline="true" /> Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLayer;
