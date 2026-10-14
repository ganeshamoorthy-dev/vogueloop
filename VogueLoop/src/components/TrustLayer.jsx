import { ShieldCheck, Sparkles, UserCheck, Lock, Camera, Star, Check } from 'lucide-react';
import './TrustLayer.css';

const TrustLayer = ({ compact = false }) => {
  const trustPoints = [
    {
      icon: <UserCheck className="trust-icon" size={22} />,
      title: 'Verified Community',
      description: 'Student identity verification creates a safer, accountable campus marketplace.',
    },
    {
      icon: <Lock className="trust-icon" size={22} />,
      title: 'Secure Rentals',
      description: 'Refundable security deposits encourage responsible renting and protect lenders.',
    },
    {
      icon: <Camera className="trust-icon" size={22} />,
      title: 'Condition Check',
      description: 'Garment condition is photographed & documented before and after every rental.',
    },
    {
      icon: <Sparkles className="trust-icon" size={22} />,
      title: 'Care Standards',
      description: 'Clear garment-care, sanitization, and steam-pressing requirements for all handovers.',
    },
    {
      icon: <Star className="trust-icon" size={22} />,
      title: 'Ratings & Reviews',
      description: 'Community trust grows through verified completed rentals and real student feedback.',
    },
  ];

  if (compact) {
    return (
      <div className="container py-lg">
        <div className="trust-layer-compact">
          <div className="trust-header-compact">
            <ShieldCheck size={18} className="navy-shield" />
            <span className="trust-title-compact">Vogue Loop Trust & Safety</span>
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
              <span>VOGUE LOOP TRUST & SAFETY</span>
            </div>
            <h2>Built for trust on both sides</h2>
            <p>Connecting student wardrobes safely through student verification, refundable deposits, and documented handovers.</p>
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
                  <span className="sage-check"><Check size={13} inline="true" /> Standard</span>
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
