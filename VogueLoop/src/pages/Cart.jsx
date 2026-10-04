import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Calendar, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
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
                        <p>Explore our designer collections for weddings, receptions, and parties!</p>
                        <Link to="/browse" className="btn btn-lg btn-primary mt-md">
                            Explore Collection
                        </Link>
                    </div>
                </div>
                <Footer />
                <MobileBottomNav wishlistCount={wishlist.length} />
            </div>
        );
    }

    const subtotal = getCartTotal();

    return (
        <div className="cart-page">
            <div className="container py-2xl">
                {/* Header */}
                <div className="cart-page-header">
                    <div>
                        <span className="section-kicker">RENTAL BAG</span>
                        <h1>Review Your Selection</h1>
                    </div>
                    <button onClick={clearCart} className="btn btn-sm btn-secondary">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-layout-grid mt-xl">
                    {/* Cart Items List */}
                    <div className="cart-items-column">
                        {cartItems.map((item) => {
                            const rawDays = differenceInDays(new Date(item.endDate), new Date(item.startDate));
                            const days = rawDays > 0 ? rawDays : 1;
                            const itemTotal = item.pricePerDay * days;
                            const deposit = item.securityDeposit || 1500;

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
                                            <span className="badge badge-sage">✓ Available & Prepared</span>
                                            <span className="item-category-tag">{item.category}</span>
                                        </div>

                                        <h3 className="cart-item-title">
                                            <Link to={`/product/${item.id}`}>{item.title}</Link>
                                        </h3>

                                        <div className="cart-item-attributes">
                                            <span className="attr-pill">Size: <strong>{item.selectedSize || 'M'}</strong></span>
                                            {item.condition && <span className="attr-pill">{item.condition}</span>}
                                        </div>

                                        <div className="cart-item-dates-bar">
                                            <Calendar size={15} className="navy-icon" />
                                            <span className="dates-text">
                                                {format(new Date(item.startDate), 'MMM dd, yyyy')} — {format(new Date(item.endDate), 'MMM dd, yyyy')}
                                            </span>
                                            <span className="days-badge">{days} {days === 1 ? 'day' : 'days'}</span>
                                        </div>
                                    </div>

                                    <div className="cart-item-pricing">
                                        <div className="item-price-calc">
                                            <span className="price-calc-label">₹{item.pricePerDay} × {days} days</span>
                                            <span className="item-rental-total">₹{itemTotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="deposit-note">
                                            <span>Deposit: ₹{deposit.toLocaleString('en-IN')} (Refundable)</span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="remove-item-btn"
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="cart-trust-reassurance">
                            <ShieldCheck size={20} className="navy-icon" />
                            <div>
                                <h4>Complimentary Dry Cleaning Included</h4>
                                <p>Return the dress as is. No cleaning or ironing required on your end!</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Column */}
                    <div className="cart-summary-column">
                        <div className="summary-card">
                            <h3>Rental Order Summary</h3>

                            <div className="summary-rows-group">
                                <div className="summary-row">
                                    <span>Rental Fee ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Eco Dry Cleaning</span>
                                    <span className="text-success font-semibold">FREE</span>
                                </div>
                                <div className="summary-row">
                                    <span>Doorstep Delivery & Return</span>
                                    <span className="text-success font-semibold">FREE</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row total-row">
                                    <span>Subtotal</span>
                                    <span className="summary-grand-total">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn btn-lg btn-primary checkout-action-btn"
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>

                            <p className="checkout-security-text">
                                <Lock size={13} /> Secure SSL Encrypted Checkout
                            </p>

                            <Link to="/browse" className="continue-shopping-link">
                                ← Continue Exploring Outfits
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
