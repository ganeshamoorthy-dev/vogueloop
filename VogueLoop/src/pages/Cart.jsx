import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Calendar, ShieldCheck, ArrowRight, Lock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useListings } from '../context/ListingsContext';
import { format, differenceInDays } from 'date-fns';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const { wishlist } = useListings();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container py-3xl">
                    <div className="empty-cart-card">
                        <ShoppingBag size={56} className="empty-icon" />
                        <h2>Your Rental Bag is Empty</h2>
                        <p>Explore student closets near campus for college fests, farewells, ethnic days, and university events!</p>
                        <Link to="/browse" className="btn btn-lg btn-primary mt-md">
                            Browse Campus Outfits
                        </Link>
                    </div>
                </div>
                <Footer />
                <MobileBottomNav wishlistCount={wishlist.length} />
            </div>
        );
    }

    const subtotal = getCartTotal();
    const totalDeposits = cartItems.reduce((acc, item) => acc + (item.securityDeposit || 800), 0);

    return (
        <div className="cart-page">
            <div className="container py-2xl">
                {/* Header */}
                <div className="cart-page-header">
                    <div>
                        <span className="section-kicker">CAMPUS RENTAL BAG</span>
                        <h1>Review Your Selection</h1>
                    </div>
                    <button onClick={clearCart} className="btn btn-sm btn-secondary">
                        Clear Bag
                    </button>
                </div>

                <div className="cart-layout-grid mt-xl">
                    {/* Cart Items List */}
                    <div className="cart-items-column">
                        {cartItems.map((item) => {
                            const rawDays = differenceInDays(new Date(item.endDate), new Date(item.startDate));
                            const days = rawDays > 0 ? rawDays : 3;
                            // Calculate price: standard 3-day bundle or prorated
                            const itemPrice = item.rental3DayPrice ? (days <= 3 ? item.rental3DayPrice : Math.round(item.rental3DayPrice + (days - 3) * (item.rental3DayPrice / 3))) : (item.pricePerDay * days);
                            const deposit = item.securityDeposit || 800;

                            return (
                                <div key={item.cartId} className="cart-item-card">
                                    <div className="cart-item-image-wrapper">
                                        <img
                                            src={(item.images && item.images[0]) || FALLBACK_IMAGE}
                                            alt={item.title}
                                            className="cart-item-image"
                                            onError={handleImageError}
                                        />
                                    </div>

                                    <div className="cart-item-info">
                                        <div className="cart-item-meta">
                                            <span className="badge badge-sage">✓ Available Near Campus</span>
                                            <span className="item-category-tag">{item.category}</span>
                                        </div>

                                        <h3 className="cart-item-title">
                                            <Link to={`/product/${item.id}`}>{item.title}</Link>
                                        </h3>

                                        <p className="item-lender-info text-xs text-secondary mb-xs">
                                            Lender: <strong>{item.owner || 'Aishwarya R. • Verified Student'}</strong>
                                        </p>

                                        <div className="cart-item-attributes">
                                            <span className="attr-pill">Size: <strong>{item.selectedSize || 'M'}</strong></span>
                                            {item.condition && <span className="attr-pill">{item.condition}</span>}
                                            {item.locality && <span className="attr-pill">📍 {item.locality}</span>}
                                        </div>

                                        <div className="cart-item-dates-bar">
                                            <Calendar size={15} className="navy-icon" />
                                            <span className="dates-text">
                                                {format(new Date(item.startDate), 'MMM dd, yyyy')} — {format(new Date(item.endDate), 'MMM dd, yyyy')}
                                            </span>
                                            <span className="days-badge">{days} days bundle</span>
                                        </div>

                                        <div className="cart-handover-spot text-xs text-muted mt-xs">
                                            <MapPin size={13} className="inline-icon" />
                                            <span>Handover: {item.handoverSpot || 'Main Campus Gate 1 / Student Center'}</span>
                                        </div>
                                    </div>

                                    <div className="cart-item-pricing">
                                        <div className="item-price-calc">
                                            <span className="price-calc-label">{days}-Day Rental</span>
                                            <span className="item-rental-total">₹{itemPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="deposit-note">
                                            <span>Deposit: ₹{deposit.toLocaleString('en-IN')} (Refundable)</span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="remove-item-btn"
                                            title="Remove outfit"
                                        >
                                            <Trash2 size={16} />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="cart-trust-reassurance">
                            <ShieldCheck size={22} className="navy-icon" />
                            <div>
                                <h4>Hyperlocal Campus Handover & Fair Care</h4>
                                <p>Meet the verified student lender at a campus landmark. Inspect the garment together. Return gently worn for an immediate full deposit refund.</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Column */}
                    <div className="cart-summary-column">
                        <div className="summary-card">
                            <h3>Rental Order Summary</h3>

                            <div className="summary-rows-group">
                                <div className="summary-row">
                                    <span>Rental Fee ({cartItems.length} {cartItems.length === 1 ? 'outfit' : 'outfits'})</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Campus Handover Coordination</span>
                                    <span className="text-success font-semibold">FREE (₹0)</span>
                                </div>
                                <div className="summary-row">
                                    <span>Refundable Security Deposit</span>
                                    <span>₹{totalDeposits.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row total-row">
                                    <div>
                                        <span>Total Due at Handover</span>
                                        <span className="deposit-return-note block text-xs text-muted">
                                            Includes ₹{totalDeposits.toLocaleString('en-IN')} refundable deposit
                                        </span>
                                    </div>
                                    <span className="summary-grand-total">₹{(subtotal + totalDeposits).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn btn-lg btn-primary checkout-action-btn"
                            >
                                Proceed to Campus Booking
                                <ArrowRight size={18} />
                            </button>

                            <p className="checkout-security-text">
                                <Lock size={13} /> Verified Student Peer-to-Peer Booking
                            </p>

                            <Link to="/browse" className="continue-shopping-link">
                                ← Continue Exploring Campus Outfits
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Cart;
