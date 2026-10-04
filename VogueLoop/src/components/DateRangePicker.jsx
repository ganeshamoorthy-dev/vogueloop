import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';
import './DateRangePicker.css';

const DateRangePicker = ({ onDateChange, pricePerDay = 1500, securityDeposit = 1500 }) => {
    const today = new Date().toISOString().split('T')[0];
    const defaultStart = addDays(new Date(), 2).toISOString().split('T')[0];
    const defaultEnd = addDays(new Date(), 5).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

    // Initialize parent dates on mount
    useEffect(() => {
        onDateChange(startDate, endDate);
    }, []);

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (new Date(endDate) <= new Date(newStartDate)) {
            const newEndDate = addDays(new Date(newStartDate), 3).toISOString().split('T')[0];
            setEndDate(newEndDate);
            onDateChange(newStartDate, newEndDate);
        } else {
            onDateChange(newStartDate, endDate);
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        onDateChange(startDate, newEndDate);
    };

    const rawDays = differenceInDays(new Date(endDate), new Date(startDate));
    const rentalDays = rawDays > 0 ? rawDays : 1;
    const rentalFee = rentalDays * pricePerDay;
    const cleaningFee = 0; // Complimentary
    const grandTotal = rentalFee + securityDeposit;

    return (
        <div className="date-range-picker-card">
            <div className="picker-header">
                <div className="picker-header-title">
                    <CalendarIcon size={18} className="navy-icon" />
                    <h3>Select Rental Dates</h3>
                </div>
                <div className="availability-status">
                    <CheckCircle2 size={14} className="sage-icon" />
                    <span>Available for selected dates</span>
                </div>
            </div>

            <div className="date-inputs-grid">
                <div className="date-field">
                    <label htmlFor="start-date" className="date-label">
                        Delivery Date
                    </label>
                    <input
                        id="start-date"
                        type="date"
                        className="input date-input"
                        value={startDate}
                        min={today}
                        onChange={handleStartDateChange}
                    />
                    <span className="field-hint">Arrives by 12 PM</span>
                </div>

                <div className="date-field">
                    <label htmlFor="end-date" className="date-label">
                        Return Pickup Date
                    </label>
                    <input
                        id="end-date"
                        type="date"
                        className="input date-input"
                        value={endDate}
                        min={addDays(new Date(startDate), 1).toISOString().split('T')[0]}
                        onChange={handleEndDateChange}
                    />
                    <span className="field-hint">Doorstep pickup</span>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown-box">
                <div className="breakdown-row">
                    <span>Rental Duration</span>
                    <span className="font-semibold">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                </div>

                <div className="breakdown-row">
                    <span>Rental Fee (₹{pricePerDay} × {rentalDays} days)</span>
                    <span className="font-semibold">₹{rentalFee.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-row">
                    <span className="flex items-center gap-sm">
                        Eco Dry Cleaning & Care
                        <span className="badge badge-sage text-xs">Included</span>
                    </span>
                    <span className="font-semibold text-success">FREE</span>
                </div>

                <div className="breakdown-row">
                    <span className="flex items-center gap-sm">
                        Refundable Security Deposit
                        <span className="tooltip-trigger" title="Fully refunded upon return inspection">
                            <Info size={13} className="text-muted" />
                        </span>
                    </span>
                    <span className="font-semibold">₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-divider"></div>

                <div className="breakdown-row total-row">
                    <div className="total-label-group">
                        <span className="total-title">Total Due Now</span>
                        <span className="total-subtitle">Includes deposit (100% refundable)</span>
                    </div>
                    <span className="total-price-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
