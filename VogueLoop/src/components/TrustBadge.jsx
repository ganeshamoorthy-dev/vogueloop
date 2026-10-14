import { ShieldCheck, Sparkles, Check } from 'lucide-react';

const TrustBadge = ({ type = 'verified', text }) => {
  if (type === 'cleaned') {
    return (
      <span className="badge badge-sage">
        <Sparkles size={13} />
        <span>{text || 'Care Inspected'}</span>
      </span>
    );
  }

  if (type === 'gold') {
    return (
      <span className="badge badge-gold">
        <Sparkles size={13} />
        <span>{text || 'Campus Favorite'}</span>
      </span>
    );
  }

  return (
    <span className="badge badge-navy">
      <ShieldCheck size={13} />
      <span>{text || 'Verified Student Lender'}</span>
    </span>
  );
};

export default TrustBadge;
