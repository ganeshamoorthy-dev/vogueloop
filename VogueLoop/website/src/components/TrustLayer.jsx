import { ShieldCheck, Sparkles, UserCheck, Lock, Camera, Star } from 'lucide-react';
import './TrustLayer.css';

const TrustLayer = ({ compact = false }) => {
  const trustPoints = [
    {
      icon: <UserCheck size={22} />,
      title: 'Verified Student ID',
      description: 'Institutional verification creates an accountable, trustworthy campus rental circle.',
    },
    {
      icon: <Lock size={22} />,
      title: 'Escrow Deposits',
      description: 'Refundable security deposits protect owner garments and release automatically upon return.',
    },
    {
      icon: <Camera size={22} />,
      title: 'Condition Handovers',
      description: 'Mandatory photo checklist at handover ensures clear documentation for both peers.',
    },
    {
      icon: <Sparkles size={22} />,
      title: 'Hygiene & Care',
      description: 'Dry-cleaned or steam-sanitized requirements guarantee premium presentation.',
    },
    {
      icon: <Star size={22} />,
      title: 'Campus Landmark Spot',
      description: 'Convenient zero-shipping exchanges right outside student gates or campus libraries.',
    },
  ];

  if (compact) {
    return (
      <div className="container py-lg">
        <div className="trust-layer-compact">
          <div className="trust-header-compact">
            <ShieldCheck size={18} className="sage-check" />
            <span className="trust-title-compact">VogueLoop Student Trust Protocol</span>
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
              <span>PEER-TO-PEER CAMPUS TRUST</span>
            </div>
            <h2>Fashion Without Risk, Powered by Community</h2>
            <p>
              Designed specifically for university students. No shipping delays, no anonymous transactions, and transparent deposit protections.
            </p>
          </div>

          <div className="trust-grid">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="trust-card">
                <div className="trust-icon-wrapper">
                  {point.icon}
                </div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLayer;
