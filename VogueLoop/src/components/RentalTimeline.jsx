import { CheckCircle2, Clock, MapPin, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import './RentalTimeline.css';

const STEPS = [
  { key: 'booked', label: 'Booked', icon: CheckCircle2, desc: 'Dates & Deposit Locked' },
  { key: 'handover', label: 'Handover', icon: MapPin, desc: 'Campus Landmark Meetup' },
  { key: 'active', label: 'Event Period', icon: Sparkles, desc: 'Rock Your Fest / Event' },
  { key: 'return', label: 'Return', icon: RotateCcw, desc: 'Campus Return Meetup' },
  { key: 'completed', label: 'Deposit Released', icon: ShieldCheck, desc: 'Condition Confirmed & Done' },
];

const RentalTimeline = ({ currentStatus = 'booked' }) => {
  const currentIdx = STEPS.findIndex(s => s.key === currentStatus);
  const activeIndex = currentIdx >= 0 ? currentIdx : 0;

  return (
    <div className="rental-timeline-container">
      <div className="timeline-header">
        <h4>Rental Status Lifecycle</h4>
        <span className="badge badge-sage">
          <Clock size={12} />
          <span>Status: {STEPS[activeIndex]?.label}</span>
        </span>
      </div>

      <div className="timeline-track-wrapper">
        <div className="timeline-line">
          <div
            className="timeline-line-progress"
            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="timeline-steps">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            let stepStateClass = 'step-upcoming';
            if (isCompleted) stepStateClass = 'step-completed';
            if (isCurrent) stepStateClass = 'step-current';

            return (
              <div key={step.key} className={`timeline-step ${stepStateClass}`}>
                <div className="step-circle">
                  <Icon size={16} />
                </div>
                <span className="step-label">{step.label}</span>
                <span className="step-desc">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RentalTimeline;
