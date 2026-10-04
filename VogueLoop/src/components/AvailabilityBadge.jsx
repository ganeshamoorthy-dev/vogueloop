import { CheckCircle2, AlertCircle } from 'lucide-react';

const AvailabilityBadge = ({ available = true, text, size = 'md' }) => {
  const label = text || (available ? 'Available' : 'Unavailable');

  return (
    <span className={`badge ${available ? 'badge-sage' : 'badge-error'} badge-${size}`}>
      {available ? <CheckCircle2 size={size === 'sm' ? 12 : 14} /> : <AlertCircle size={size === 'sm' ? 12 : 14} />}
      <span>{label}</span>
    </span>
  );
};

export default AvailabilityBadge;
