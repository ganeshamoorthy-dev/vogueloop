import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Package, CreditCard, ArrowLeft, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { format, differenceInDays } from 'date-fns';
import RentalTimeline from '../components/RentalTimeline';
import Footer from '../components/Footer';
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
                    <h2>No Items to Checkout</h2>
                    <p>Your bag is empty.</p>
                    <Link to="/browse" className="btn btn-primary mt-md">Browse Collection</Link>
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
                        <span className="badge badge-gold mb-sm">BOOKING CONFIRMED</span>
                        <h1>Rental Order #{bookingId}</h1>
                        <p className="success-message-text">
                            Thank you for renting with VogueLoop! Your garment is being prepared for eco-cleaning and quality inspection.
                        </p>

                        {/* Interactive Rental Lifecycle Progress */}
                        <div className="order-tracking-section mt-xl text-left">
                            <RentalTimeline currentStatus="booked" />
                        </div>

                        <div className="success-actions mt-2xl">
                            <Link to="/dashboard" className="btn btn-lg btn-primary">
                                Track Order in Dashboard
                            </Link>
                            <Link to="/browse" className="btn btn-lg btn-secondary">
                                Explore More Dresses
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
                <MobileBottomNav wishlistCount={wishlist.length} />
            </div>
        );
    }

    const subtotal = getCartTotal();
    const depositsTotal = cartItems.reduce((acc, item) => acc + (item.securityDeposit || 1500), 0);
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const grandTotal = subtotal + tax + depositsTotal;

    return (
        <div className="checkout-page">
            <div className="container py-2xl">
                <button onClick={() => navigate('/cart')} className="back-btn mb-md">
                    <ArrowLeft size={18} />
                    Back to Rental Bag
                </button>

                <div className="checkout-page-header">
                    <div>
                        <span className="section-kicker">SECURE CHECKOUT</span>
                        <h1>Confirm Your Rental Order</h1>
                    </div>
                </div>

                <div className="checkout-grid mt-xl">
                    {/* Main Receipt Details */}
                    <div className="receipt-column">
                        <div className="receipt-card">
                            <div className="receipt-header">
                                <div className="receipt-logo">
                                    <span className="logo-brand">VogueLoop</span>
                                    <span className="logo-sub">Verified Receipt</span>
                                </div>
                                <div className="trust-badge-small">
                                    <ShieldCheck size={15} />
                                    <span>Verified Rental</span>
                                </div>
                            </div>

                            <div className="receipt-divider"></div>

                            <div className="receipt-items-list">
                                <h3>
                                    <Package size={18} className="navy-icon" />
                                    Garments Reserved ({cartItems.length})
                                </h3>

                                {cartItems.map((item) => {
                                    const rawDays = differenceInDays(new Date(item.endDate), new Date(item.startDate));
                                    const days = rawDays > 0 ? rawDays : 1;
                                    const itemTotal = item.pricePerDay * days;

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
                                                <p className="item-meta">{item.category} • Size: <strong>{item.selectedSize || 'M'}</strong></p>
                                                <div className="item-dates">
                                                    <Calendar size={13} />
                                                    <span>
                                                        {format(new Date(item.startDate), 'MMM dd')} — {format(new Date(item.endDate), 'MMM dd, yyyy')} ({days} {days === 1 ? 'day' : 'days'})
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="receipt-item-price">
                                                <span>₹{itemTotal.toLocaleString('en-IN')}</span>
                                                <span className="deposit-sub">Dep: ₹{(item.securityDeposit || 1500).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="receipt-divider"></div>

                            {/* Summary Table */}
                            <div className="receipt-totals-table">
                                <div className="total-row">
                                    <span>Rental Fee Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="total-row">
                                    <span>Eco Dry Cleaning & Care</span>
                                    <span className="text-success font-semibold">Included (₹0)</span>
                                </div>
                                <div className="total-row">
                                    <span>GST (18%)</span>
                                    <span>₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="total-row">
                                    <span>Refundable Security Deposit</span>
                                    <span>₹{depositsTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="receipt-divider"></div>
                                <div className="total-row grand-total">
                                    <div>
                                        <span className="grand-title">Total Pay On Delivery</span>
                                        <span className="grand-sub">100% deposit refunded upon return</span>
                                    </div>
                                    <span className="grand-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rental Protection Terms Card */}
                        <div className="terms-card mt-lg">
                            <h3>Rental Terms & Guarantee</h3>
                            <ul className="terms-list">
                                <li><strong>100% Cleaned & Ready:</strong> Dry-cleaned and quality-inspected before shipment.</li>
                                <li><strong>Fit Guarantee:</strong> Free replacement or refund if size does not fit.</li>
                                <li><strong>Easy Returns:</strong> Doorstep pickup included with pre-paid return packaging.</li>
                                <li><strong>Deposit Refund:</strong> Security deposit credited back within 24h of return inspection.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Payment Action Section */}
                    <div className="payment-column">
                        <div className="payment-action-card">
                            <div className="payment-icon-wrapper">
                                <CreditCard size={36} className="navy-icon" />
                            </div>
                            <h3>Payment On Delivery</h3>
                            <p>Pay upon doorstep delivery via cash, UPI, or credit/debit card.</p>

                            <div className="amount-highlight-box">
                                <span>Total Payable</span>
                                <span className="highlight-amount">₹{grandTotal.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                onClick={handleConfirmOrder}
                                className="btn btn-lg btn-primary confirm-order-btn"
                            >
                                Confirm & Reserve Order
                            </button>

                            <div className="security-guarantee-note mt-md">
                                <Lock size={14} />
                                <span>Encrypted & Guaranteed by VogueLoop</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Checkout;
