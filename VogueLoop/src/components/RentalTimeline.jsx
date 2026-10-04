import { CheckCircle2, Clock, Package, Truck, Home, RotateCcw, Award } from 'lucide-react';
import './RentalTimeline.css';

const STEPS = [
  { key: 'booked', label: 'Booked', icon: CheckCircle2, desc: 'Order Confirmed' },
  { key: 'preparing', label: 'Preparing', icon: Package, desc: 'Cleaned & Quality Checked' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'In Transit to You' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Enjoy Your Moment!' },
  { key: 'return', label: 'Return', icon: RotateCcw, desc: 'Doorstep Pickup' },
  { key: 'completed', label: 'Completed', icon: Award, desc: 'Rental Finished' },
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
