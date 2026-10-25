import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Package, CreditCard, ArrowLeft, ChevronLeft, ShieldCheck, MapPin, Lock, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { format, differenceInDays } from 'date-fns';
import RentalTimeline from '../components/RentalTimeline';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { wishlist } = useListings();

    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [confirmedOrderItems, setConfirmedOrderItems] = useState([]);
    const [bookingId, setBookingId] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (cartItems.length === 0 && !orderConfirmed) {
        return (
            <div className="checkout-page">
                <div className="container py-3xl text-center">
                    <h2>No Outfits in Your Bag</h2>
                    <p>Your campus rental bag is currently empty.</p>
                    <Link to="/browse" className="btn btn-primary mt-md">Browse Campus Outfits</Link>
                </div>
            </div>
        );
    }

    const handleConfirmOrder = () => {
        const newBookingId = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
        setBookingId(newBookingId);
        setConfirmedOrderItems([...cartItems]);
        setOrderConfirmed(true);
        clearCart();
    };

    if (orderConfirmed) {
        return (
            <div className="checkout-page">
                <div className="container py-3xl">
                    <div className="order-success-card">
                        <div className="success-icon-wrapper">
                            <CheckCircle2 size={56} className="sage-icon" />
                        </div>
                        <span className="badge badge-gold mb-sm">CAMPUS BOOKING RESERVED</span>
                        <h1>Rental Booking #{bookingId}</h1>
                        <p className="success-message-text">
                            Your reservation is confirmed! Meet your verified student lender at the campus handover point. Security deposit is refundable upon return.
                        </p>

                        {/* Interactive P2P Rental Lifecycle Progress */}
                        <div className="order-tracking-section mt-xl text-left">
                            <RentalTimeline currentStatus="booked" />
                        </div>

                        <div className="success-actions mt-2xl">
                            <Link to="/dashboard" className="btn btn-lg btn-primary">
                                View in Student Dashboard
                            </Link>
                            <Link to="/browse" className="btn btn-lg btn-secondary">
                                Explore More Campus Outfits
                            </Link>
                        </div>
                    </div>
                </div>
                <MobileBottomNav wishlistCount={wishlist.length} />
            </div>
        );
    }

    const subtotal = getCartTotal();
    const depositsTotal = cartItems.reduce((acc, item) => acc + (item.securityDeposit || 800), 0);
    const grandTotal = subtotal + depositsTotal;

    return (
        <div className="checkout-page">
            <div className="container py-2xl">
                {/* Top Return Navigation */}
                <div className="app-back-navigation mb-md">
                    <button onClick={() => navigate('/cart')} className="back-nav-btn">
                        <ChevronLeft size={16} />
                        <span>Back to Rental Bag</span>
                    </button>
                </div>

                <div className="checkout-page-header">
                    <div>
                        <span className="section-kicker">CAMPUS P2P BOOKING</span>
                        <h1>Confirm Your Rental Reservation</h1>
                    </div>
                </div>

                <div className="checkout-grid mt-xl">
                    {/* Main Receipt Details */}
                    <div className="receipt-column">
                        <div className="receipt-card">
                            <div className="receipt-header">
                                <div className="receipt-logo">
                                    <span className="logo-brand">VogueLoop</span>
                                    <span className="logo-sub">Student Rental Receipt</span>
                                </div>
                                <div className="trust-badge-small">
                                    <ShieldCheck size={15} />
                                    <span>Verified Student P2P</span>
                                </div>
                            </div>

                            <div className="receipt-divider"></div>

                            <div className="receipt-items-list">
                                <h3>
                                    <Package size={18} className="navy-icon" />
                                    Campus Outfits Reserved ({cartItems.length})
                                </h3>

                                {cartItems.map((item) => {
                                    const rawDays = differenceInDays(new Date(item.endDate), new Date(item.startDate));
                                    const days = rawDays > 0 ? rawDays : 3;
                                    const itemPrice = item.rental3DayPrice ? (days <= 3 ? item.rental3DayPrice : Math.round(item.rental3DayPrice + (days - 3) * (item.rental3DayPrice / 3))) : (item.pricePerDay * days);

                                    return (
                                        <div key={item.cartId} className="receipt-item-row">
                                            <img
                                                src={(item.images && item.images[0]) || FALLBACK_IMAGE}
                                                alt={item.title}
                                                className="receipt-item-img"
                                                onError={handleImageError}
                                            />
                                            <div className="receipt-item-details">
                                                <h4>{item.title}</h4>
                                                <p className="item-meta">
                                                    {item.category} • Size: <strong>{item.selectedSize || 'M'}</strong>
                                                </p>
                                                <p className="item-lender text-xs text-secondary">
                                                    Lender: <strong>{item.owner || 'Aishwarya R. • Verified Student'}</strong>
                                                </p>
                                                <div className="item-dates">
                                                    <Calendar size={13} />
                                                    <span>
                                                        {format(new Date(item.startDate), 'MMM dd')} — {format(new Date(item.endDate), 'MMM dd, yyyy')} ({days} days)
                                                    </span>
                                                </div>
                                                <div className="item-handover-spot text-xs text-muted mt-2xs">
                                                    <MapPin size={12} className="inline-icon" />
                                                    <span>Spot: {item.handoverSpot || 'Main Campus Gate 1 / Student Center'}</span>
                                                </div>
                                            </div>
                                            <div className="receipt-item-price">
                                                <span>₹{itemPrice.toLocaleString('en-IN')}</span>
                                                <span className="deposit-sub">Dep: ₹{(item.securityDeposit || 800).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="receipt-divider"></div>

                            {/* Summary Table */}
                            <div className="receipt-totals-table">
                                <div className="total-row">
                                    <span>Rental Bundle Fee Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="total-row">
                                    <span>Campus Handover Coordination</span>
                                    <span className="text-success font-semibold">FREE (₹0)</span>
                                </div>
                                <div className="total-row">
                                    <span>Refundable Security Deposit</span>
                                    <span>₹{depositsTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="receipt-divider"></div>
                                <div className="total-row grand-total">
                                    <div>
                                        <span className="grand-title">Total Due at Meetup</span>
                                        <span className="grand-sub">₹{depositsTotal.toLocaleString('en-IN')} deposit refunded upon safe return</span>
                                    </div>
                                    <span className="grand-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Campus Rental Guidelines */}
                        <div className="terms-card mt-lg">
                            <h3>Campus Rental & Handover Guidelines</h3>
                            <ul className="terms-list">
                                <li><strong>Mutual Inspection:</strong> Check fabric, zipper, and measurements with the student lender at the campus meetup spot.</li>
                                <li><strong>Gentle Care:</strong> Wear with care during your fest or occasion. Please avoid pinning or alteration without lender consent.</li>
                                <li><strong>Campus Landmark Return:</strong> Return to the student lender at the agreed campus spot on or before your return date.</li>
                                <li><strong>Instant Deposit Refund:</strong> Your refundable deposit is released immediately once return condition is confirmed.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Payment Action Section */}
                    <div className="payment-column">
                        <div className="payment-action-card">
                            <div className="payment-icon-wrapper">
                                <CreditCard size={36} className="navy-icon" />
                            </div>
                            <h3>Handover Payment (UPI / Cash)</h3>
                            <p>Pay securely via UPI (Google Pay, PhonePe, Paytm) or cash directly during your campus handover.</p>

                            <div className="amount-highlight-box">
                                <span>Total Payable at Handover</span>
                                <span className="highlight-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                                <span className="deposit-refund-highlight">
                                    (includes ₹{depositsTotal.toLocaleString('en-IN')} refundable deposit)
                                </span>
                            </div>

                            <button
                                onClick={handleConfirmOrder}
                                className="btn btn-lg btn-primary confirm-order-btn"
                            >
                                Confirm & Reserve Outfit
                            </button>

                            <div className="security-guarantee-note mt-md">
                                <Lock size={14} />
                                <span>Secured by VogueLoop Campus Trust Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Checkout;

