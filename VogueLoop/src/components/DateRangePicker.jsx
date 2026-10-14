import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Info, MapPin, Sparkles, Clock } from 'lucide-react';
import { addDays, differenceInDays, format, nextFriday } from 'date-fns';
import './DateRangePicker.css';

const DateRangePicker = ({
    onDateChange,
    rental3DayPrice = 799,
    securityDeposit = 800,
    handoverSpot = 'Main Campus Gate 1 / Student Center'
}) => {
    const today = new Date().toISOString().split('T')[0];
    const defaultStart = addDays(new Date(), 2).toISOString().split('T')[0];
    const defaultEnd = addDays(new Date(), 5).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);
    const [activePreset, setActivePreset] = useState('custom');

    // Initialize parent dates on mount
    useEffect(() => {
        onDateChange(startDate, endDate);
    }, []);

    const updateDates = (newStart, newEnd, presetKey = 'custom') => {
        setStartDate(newStart);
        setEndDate(newEnd);
        setActivePreset(presetKey);
        onDateChange(newStart, newEnd);
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        setActivePreset('custom');

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
        setActivePreset('custom');
        onDateChange(startDate, newEndDate);
    };

    // Quick preset handlers
    const selectUpcoming3Days = () => {
        const s = addDays(new Date(), 1).toISOString().split('T')[0];
        const e = addDays(new Date(), 4).toISOString().split('T')[0];
        updateDates(s, e, 'next3');
    };

    const selectWeekendFest = () => {
        const fri = nextFriday(new Date());
        const mon = addDays(fri, 3);
        updateDates(fri.toISOString().split('T')[0], mon.toISOString().split('T')[0], 'weekend');
    };

    const selectNextWeek = () => {
        const s = addDays(new Date(), 7).toISOString().split('T')[0];
        const e = addDays(new Date(), 10).toISOString().split('T')[0];
        updateDates(s, e, 'nextweek');
    };

    const rawDays = differenceInDays(new Date(endDate), new Date(startDate));
    const rentalDays = rawDays > 0 ? rawDays : 1;

    // Student rental packaging:
    // 1-3 days = flat 3-day package fee
    // Additional days = ₹250/day
    const basePrice = rental3DayPrice;
    const additionalDays = Math.max(0, rentalDays - 3);
    const rentalFee = basePrice + (additionalDays * 250);
    const grandTotal = rentalFee + securityDeposit;

    // Safe formatting for display
    let formattedDateRange = '';
    try {
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        if (!isNaN(sDate) && !isNaN(eDate)) {
            formattedDateRange = `${format(sDate, 'EEE, MMM dd')} — ${format(eDate, 'EEE, MMM dd, yyyy')}`;
        }
    } catch (e) {
        formattedDateRange = `${startDate} — ${endDate}`;
    }

    return (
        <div className="date-range-picker-card">
            {/* Header */}
            <div className="picker-header">
                <div className="picker-header-title">
                    <CalendarIcon size={18} className="calendar-accent-icon" />
                    <h3>Select Rental Dates</h3>
                </div>
                <div className="availability-status">
                    <CheckCircle2 size={14} className="sage-icon" />
                    <span>Available with Student Lender</span>
                </div>
            </div>

            {/* Quick Campus Presets */}
            <div className="calendar-presets-row">
                <span className="presets-label">Quick Presets:</span>
                <div className="presets-chips-group">
                    <button
                        type="button"
                        className={`preset-chip ${activePreset === 'next3' ? 'active' : ''}`}
                        onClick={selectUpcoming3Days}
                    >
                        ⚡ Next 3 Days
                    </button>
                    <button
                        type="button"
                        className={`preset-chip ${activePreset === 'weekend' ? 'active' : ''}`}
                        onClick={selectWeekendFest}
                    >
                        🎉 Weekend Fest (Fri–Mon)
                    </button>
                    <button
                        type="button"
                        className={`preset-chip ${activePreset === 'nextweek' ? 'active' : ''}`}
                        onClick={selectNextWeek}
                    >
                        📅 Next Week (3 Days)
                    </button>
                </div>
            </div>

            {/* Date Inputs Grid */}
            <div className="date-inputs-grid">
                <div className="date-field">
                    <label htmlFor="start-date" className="date-label">
                        <Clock size={13} className="field-icon" />
                        <span>Rental Start (Campus Handover)</span>
                    </label>
                    <div className="date-input-wrapper">
                        <input
                            id="start-date"
                            type="date"
                            className="input date-input"
                            value={startDate}
                            min={today}
                            onChange={handleStartDateChange}
                            onClick={(e) => {
                                try {
                                    if (e.target.showPicker) e.target.showPicker();
                                } catch (err) {}
                            }}
                        />
                    </div>
                    <span className="field-hint">Meet student lender at campus spot</span>
                </div>

                <div className="date-field">
                    <label htmlFor="end-date" className="date-label">
                        <Clock size={13} className="field-icon" />
                        <span>Return Date (Deposit Release)</span>
                    </label>
                    <div className="date-input-wrapper">
                        <input
                            id="end-date"
                            type="date"
                            className="input date-input"
                            value={endDate}
                            min={addDays(new Date(startDate), 1).toISOString().split('T')[0]}
                            onChange={handleEndDateChange}
                            onClick={(e) => {
                                try {
                                    if (e.target.showPicker) e.target.showPicker();
                                } catch (err) {}
                            }}
                        />
                    </div>
                    <span className="field-hint">Return inspection & instant refund</span>
                </div>
            </div>

            {/* Selected Booking Summary Strip */}
            {formattedDateRange && (
                <div className="selected-range-strip">
                    <div className="range-text-group">
                        <span className="range-label">Selected Booking Window:</span>
                        <strong className="range-dates">{formattedDateRange} ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</strong>
                    </div>
                </div>
            )}

            {/* Handover Spot Notice */}
            <div className="handover-notice-strip">
                <MapPin size={14} className="gold-sparkle" />
                <span>Designated Campus Meetup Spot: <strong>{handoverSpot}</strong></span>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown-box">
                <div className="breakdown-row">
                    <span>Rental Duration</span>
                    <span className="font-semibold text-primary">
                        {rentalDays} {rentalDays === 1 ? 'day' : 'days'} ({rentalDays <= 3 ? 'Standard 3-Day Bundle' : `3 Days + ${additionalDays} Extra Day${additionalDays > 1 ? 's' : ''}`})
                    </span>
                </div>

                <div className="breakdown-row">
                    <span>Rental Fee</span>
                    <span className="font-semibold text-primary">₹{rentalFee.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-row">
                    <span className="flex items-center gap-sm">
                        Garment Sanitization & Steam Care
                        <span className="badge badge-sage text-xs">Student Standard</span>
                    </span>
                    <span className="font-semibold text-success">Included</span>
                </div>

                <div className="breakdown-row">
                    <span className="flex items-center gap-sm">
                        Refundable Security Deposit
                        <span className="tooltip-trigger" title="Held safely in escrow and refunded within 24h of return condition inspection.">
                            <Info size={13} className="text-muted" />
                        </span>
                    </span>
                    <span className="font-semibold text-gold">₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-divider"></div>

                <div className="breakdown-row total-row">
                    <div className="total-label-group">
                        <span className="total-title">Total Due Now</span>
                        <span className="total-subtitle">Includes ₹{securityDeposit} refundable deposit</span>
                    </div>
                    <span className="total-price-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
