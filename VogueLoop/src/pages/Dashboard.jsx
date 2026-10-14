import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useCart } from '../context/CartContext';
import {
    Package, ShoppingBag, User as UserIcon,
    TrendingUp, Calendar, Clock, Plus, ShieldCheck, Heart,
    MapPin, CheckCircle2, MessageSquare, Check, X,
    ExternalLink, AlertCircle, Sparkles, ChevronRight,
    Eye, Info, Send, BadgeCheck, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import RentalTimeline from '../components/RentalTimeline';
import ClothingCard from '../components/ClothingCard';
import ModeToggle from '../components/ModeToggle';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Dashboard.css';

// Demo incoming borrow requests for the Lender view
const INITIAL_BORROW_REQUESTS = [
    {
        id: 'req-01',
        renterName: 'Rohan M.',
        renterDept: 'Economics & Commerce, Batch of 2026',
        renterVerified: true,
        renterAvatar: 'RM',
        outfitTitle: 'Ivory & Navy Indo-Western Asymmetric Kurta',
        outfitImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        occasion: 'Placement Formals & Mock Interviews',
        durationDays: 3,
        datesText: 'This Friday — Monday',
        handoverSpot: 'Main Campus Gate 1 / Student Center',
        payoutAmount: 749,
        securityDeposit: 750,
        status: 'pending', // 'pending' | 'accepted' | 'declined'
    },
    {
        id: 'req-02',
        renterName: 'Ananya S.',
        renterDept: 'Media & Design, Batch of 2025',
        renterVerified: true,
        renterAvatar: 'AS',
        outfitTitle: 'Emerald Green Silk Banarasi Lehenga Set',
        outfitImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        occasion: 'University Ethnic Day Celebration',
        durationDays: 3,
        datesText: 'Oct 24 — Oct 27',
        handoverSpot: 'Campus Gate 2 / Near University Library',
        payoutAmount: 799,
        securityDeposit: 800,
        status: 'pending',
    }
];

// Fallback demo active rental for empty state exploration
const DEMO_ACTIVE_RENTAL = {
    cartId: 'demo-active-booking-01',
    id: 1,
    title: 'Emerald Green Silk Banarasi Lehenga Set',
    category: 'Lehenga',
    selectedSize: 'S (Bust 34", Waist 28")',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'],
    owner: 'Priya S.',
    ownerVerified: true,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    handoverSpot: 'Main Campus Gate 1 / Student Center',
    rental3DayPrice: 799,
    securityDeposit: 800,
    status: 'booked',
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, mode, setMode } = useAuth();
    const { listings, wishlist, getListingById } = useListings();
    const { cartItems } = useCart();

    // Mode determination
    const isLender = mode === 'lender';

    // Tabs state: adapts automatically based on active mode
    const [renterTab, setRenterTab] = useState('rentals'); // 'rentals' | 'wishlist' | 'checklist'
    const [lenderTab, setLenderTab] = useState('requests'); // 'requests' | 'listings' | 'earnings'

    // Interactive state for lender requests
    const [borrowRequests, setBorrowRequests] = useState(INITIAL_BORROW_REQUESTS);

    // Active modal states
    const [checklistModalOpen, setChecklistModalOpen] = useState(false);
    const [activeChatPeer, setActiveChatPeer] = useState(null); // { name, spot, outfit }
    const [chatMessages, setChatMessages] = useState([
        { sender: 'peer', text: 'Hey! I can meet you right near Main Campus Gate 1 by 4:45 PM. Does that work for you?', time: '2:15 PM' },
        { sender: 'me', text: 'Sounds great! I will be by the campus steps wearing a blue jacket.', time: '2:20 PM' }
    ]);
    const [newChatInput, setNewChatInput] = useState('');

    // Listings owned by user (demo shows 2-3 outfits for high fidelity)
    const [myListings, setMyListings] = useState(() => {
        return listings.slice(0, 3).map((item, idx) => ({
            ...item,
            activeStatus: idx === 0 ? 'available' : 'available',
            viewsCount: 38 + idx * 14,
            timesRented: 2 - (idx % 2),
        }));
    });

    // Renter Rentals: combine cart items or fallback demo
    const effectiveRentals = useMemo(() => {
        if (cartItems && cartItems.length > 0) {
            return cartItems;
        }
        return [DEMO_ACTIVE_RENTAL];
    }, [cartItems]);

    // Saved Wishlist items
    const wishlistItems = useMemo(() => {
        return wishlist.map(id => getListingById(id)).filter(Boolean);
    }, [wishlist, getListingById]);

    // Total refundable escrow deposits
    const totalDepositsEscrow = effectiveRentals.reduce(
        (sum, item) => sum + (item.securityDeposit || 800),
        0
    );

    // Pending borrow requests count
    const pendingRequestsCount = borrowRequests.filter(r => r.status === 'pending').length;

    // Handle Request Action
    const handleRequestDecision = (id, newStatus) => {
        setBorrowRequests(prev =>
            prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
        );
    };

    // Toggle listing availability
    const handleToggleListingStatus = (listingId) => {
        setMyListings(prev =>
            prev.map(l =>
                l.id === listingId
                    ? { ...l, activeStatus: l.activeStatus === 'available' ? 'paused' : 'available' }
                    : l
            )
        );
    };

    // Send chat message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newChatInput.trim()) return;
        setChatMessages(prev => [
            ...prev,
            { sender: 'me', text: newChatInput.trim(), time: 'Just now' }
        ]);
        setNewChatInput('');
    };

    return (
        <div className="dashboard-page">
            <div className="container py-2xl">

                {/* Top Profile & Mode Switcher Bar */}
                <div className="dashboard-hero-card">
                    <div className="hero-profile-row">
                        <div className="hero-avatar-group">
                            <div className={`hero-avatar ${isLender ? 'avatar-lender' : 'avatar-renter'}`}>
                                <UserIcon size={30} />
                            </div>
                            <div className="hero-user-details">
                                <h1 className="hero-user-name">Welcome back, {user?.name || 'Aanya Sharma'}!</h1>
                                <p className="hero-user-sub">
                                    {isLender
                                        ? 'Lender Mode — Manage your campus closet listings, accept student requests, and track your rental earnings.'
                                        : 'Renter Mode — Track your upcoming event outfits, coordinate campus handovers, and manage deposit refunds.'}
                                </p>
                            </div>
                        </div>

                        {/* Airbnb-style Segmented Mode Toggle & Lender Action */}
                        <div className="hero-switcher-wrapper">
                            <span className="switcher-label">Active Campus Mode:</span>
                            <ModeToggle variant="full" />
                            {isLender && (
                                <Link to="/upload" className="btn btn-sm btn-burgundy hero-list-cta mt-xs">
                                    <Plus size={14} />
                                    <span>+ List Outfit to Closet</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* 👔 RENTER VIEW (When Mode === 'renter') */}
                {/* ============================================================== */}
                {!isLender ? (
                    <div className="renter-mode-section mt-xl">
                        {/* Renter KPI Metric Cards */}
                        <div className="stats-cards-grid">
                            <div className="dashboard-stat-card border-navy">
                                <div className="stat-icon-wrapper navy">
                                    <ShoppingBag size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Active Campus Rentals</span>
                                    <span className="stat-number">{effectiveRentals.length}</span>
                                    <span className="stat-hint-text sage-text">✓ Handover coordinated</span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper wine">
                                    <MapPin size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Next Campus Handover</span>
                                    <span className="stat-value-text">Main Campus Gate 1</span>
                                    <span className="stat-hint-text">Tomorrow, 4:30 PM • Student Center</span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper gold">
                                    <ShieldCheck size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Security Deposits in Escrow</span>
                                    <span className="stat-number">₹{totalDepositsEscrow.toLocaleString('en-IN')}</span>
                                    <span className="stat-hint-text gold-text">Refunds immediately at return check</span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper subtle">
                                    <Heart size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Saved Wishlist</span>
                                    <span className="stat-number">{wishlistItems.length}</span>
                                    <button
                                        onClick={() => setRenterTab('wishlist')}
                                        className="stat-action-link"
                                    >
                                        View Saved Outfits &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Renter Segment Tabs */}
                        <div className="dashboard-navigation-tabs mt-2xl">
                            <button
                                className={`dash-tab-btn ${renterTab === 'rentals' ? 'active' : ''}`}
                                onClick={() => setRenterTab('rentals')}
                            >
                                <ShoppingBag size={16} />
                                <span>My Active Rentals ({effectiveRentals.length})</span>
                            </button>
                            <button
                                className={`dash-tab-btn ${renterTab === 'wishlist' ? 'active' : ''}`}
                                onClick={() => setRenterTab('wishlist')}
                            >
                                <Heart size={16} />
                                <span>Saved Wishlist ({wishlistItems.length})</span>
                            </button>
                            <button
                                className={`dash-tab-btn ${renterTab === 'checklist' ? 'active' : ''}`}
                                onClick={() => setRenterTab('checklist')}
                            >
                                <ShieldCheck size={16} />
                                <span>Campus Handover & Care Guide</span>
                            </button>
                        </div>

                        {/* Tab Content: Active Rentals */}
                        {renterTab === 'rentals' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="pane-header-row mb-lg">
                                    <div>
                                        <h2 className="pane-title">Active & Upcoming Campus Rentals</h2>
                                        <p className="pane-subtitle">
                                            Handover timeline, student meetup spots, and automated deposit escrow tracking.
                                        </p>
                                    </div>
                                    <Link to="/browse" className="btn btn-outline-sm">
                                        <Plus size={14} />
                                        Browse Campus Outfits
                                    </Link>
                                </div>

                                <div className="rentals-list-cards">
                                    {effectiveRentals.map(rental => (
                                        <div key={rental.cartId || rental.id} className="rental-tracker-card">
                                            {/* Top Banner Row */}
                                            <div className="tracker-item-header">
                                                <img
                                                    src={(rental.images && rental.images[0]) || FALLBACK_IMAGE}
                                                    alt={rental.title}
                                                    className="tracker-img"
                                                    onError={handleImageError}
                                                />
                                                <div className="tracker-item-info">
                                                    <div className="tracker-badge-row">
                                                        <span className="badge badge-sage">✓ Booking Confirmed</span>
                                                        <span className="tracker-size-pill">Size: {rental.selectedSize || 'S'}</span>
                                                        <span className="tracker-deposit-badge">
                                                            Escrow: ₹{rental.securityDeposit || 800} locked
                                                        </span>
                                                    </div>
                                                    <h3 className="tracker-title">{rental.title}</h3>
                                                    <p className="tracker-owner-name">
                                                        Lender: <strong>{rental.owner || 'Priya S.'}</strong>
                                                        <span className="verified-student-dot"> • Verified Campus Student</span>
                                                    </p>

                                                    <div className="tracker-meta-grid">
                                                        <div className="tracker-meta-pill">
                                                            <Calendar size={13} className="pill-icon" />
                                                            <span>
                                                                {rental.startDate ? format(new Date(rental.startDate), 'MMM dd') : 'Oct 16'} — {rental.endDate ? format(new Date(rental.endDate), 'MMM dd, yyyy') : 'Oct 19, 2026'} (3 Days)
                                                            </span>
                                                        </div>
                                                        <div className="tracker-meta-pill highlight">
                                                            <MapPin size={13} className="pill-icon wine" />
                                                            <span>Meetup Spot: <strong>{rental.handoverSpot || 'Main Campus Gate 1 / Student Center'}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="tracker-actions-col">
                                                    <div className="tracker-pricing-box">
                                                        <span className="price-label">Rental Bundle</span>
                                                        <span className="price-val">₹{rental.rental3DayPrice || 799}</span>
                                                        <span className="deposit-sub">+ ₹{rental.securityDeposit || 800} refundable</span>
                                                    </div>

                                                    <div className="tracker-cta-buttons">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-burgundy"
                                                            onClick={() => setActiveChatPeer({
                                                                name: rental.owner || 'Priya S.',
                                                                spot: rental.handoverSpot || 'Main Campus Gate 1',
                                                                outfit: rental.title
                                                            })}
                                                        >
                                                            <MessageSquare size={14} />
                                                            <span>Message Lender</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => setChecklistModalOpen(true)}
                                                        >
                                                            <Info size={14} />
                                                            <span>Handover Checklist</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* P2P Lifecycle Steps */}
                                            <div className="tracker-lifecycle-wrapper mt-lg pt-md">
                                                <RentalTimeline currentStatus="handover" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Saved Wishlist */}
                        {renterTab === 'wishlist' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="pane-header-row mb-lg">
                                    <div>
                                        <h2 className="pane-title">Saved Wishlist Outfits</h2>
                                        <p className="pane-subtitle">
                                            Outfits from student closets you've bookmarked for upcoming fests, ethnic days, and farewells.
                                        </p>
                                    </div>
                                    <Link to="/browse" className="btn btn-primary">
                                        Explore All Outfits
                                    </Link>
                                </div>

                                {wishlistItems.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-lg">
                                        {wishlistItems.map(item => (
                                            <ClothingCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="dashboard-empty-card">
                                        <Heart size={44} className="empty-icon text-muted" />
                                        <h3>Your Wishlist is Empty</h3>
                                        <p>Save outfits you love by clicking the heart icon while browsing student closets.</p>
                                        <Link to="/browse" className="btn btn-primary mt-md">Browse Nearby Outfits</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Handover Checklist */}
                        {renterTab === 'checklist' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="handover-guide-card">
                                    <div className="guide-header">
                                        <ShieldCheck size={28} className="gold-icon" />
                                        <div>
                                            <h3>VogueLoop Campus Handover & Return Protocol</h3>
                                            <p>Our 4-step trust standard guarantees safe garment care and instant deposit release.</p>
                                        </div>
                                    </div>

                                    <div className="protocol-steps-grid mt-xl">
                                        <div className="protocol-step-box">
                                            <div className="step-num">1</div>
                                            <h4>Designated Campus Landmark</h4>
                                            <p>Always meet at well-lit, central campus meeting spots such as <strong>Main Campus Gate 1</strong> or the <strong>Student Center Plaza</strong>.</p>
                                        </div>
                                        <div className="protocol-step-box">
                                            <div className="step-num">2</div>
                                            <h4>60-Second Mutual Inspection</h4>
                                            <p>Check the outfit together: inspect fabric seams, smooth zip operation, and hem condition before confirming handover in the app.</p>
                                        </div>
                                        <div className="protocol-step-box">
                                            <div className="step-num">3</div>
                                            <h4>Wear Responsibly</h4>
                                            <p>Do not alter or machine-wash garments. Student lenders provide outfits steam-pressed and sanitized ready for wear.</p>
                                        </div>
                                        <div className="protocol-step-box">
                                            <div className="step-num">4</div>
                                            <h4>Return & Deposit Refund</h4>
                                            <p>Meet on your agreed return date. Once the lender confirms the return inspection, your security deposit is released back instantly.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ============================================================== */
                    /* 💼 LENDER VIEW (When Mode === 'lender') */
                    /* ============================================================== */
                    <div className="lender-mode-section mt-xl">
                        {/* Lender KPI Metric Cards */}
                        <div className="stats-cards-grid">
                            <div className="dashboard-stat-card border-burgundy">
                                <div className="stat-icon-wrapper burgundy">
                                    <AlertCircle size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Inbound Borrow Requests</span>
                                    <span className="stat-number">{pendingRequestsCount}</span>
                                    <span className="stat-hint-text gold-text">
                                        {pendingRequestsCount > 0 ? 'Requires your confirmation' : 'All caught up'}
                                    </span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper navy">
                                    <Package size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Your Campus Listings</span>
                                    <span className="stat-number">{myListings.length}</span>
                                    <span className="stat-hint-text sage-text">Active & visible nearby</span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper gold">
                                    <TrendingUp size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Realized Pilot Earnings</span>
                                    <span className="stat-number">₹2,247</span>
                                    <span className="stat-hint-text">3 campus rentals completed</span>
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-icon-wrapper sage">
                                    <ShieldCheck size={22} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Lender Trust Score</span>
                                    <span className="stat-number">5.0 ★</span>
                                    <span className="stat-hint-text sage-text">100% on-time return rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Lender Segment Tabs */}
                        <div className="dashboard-navigation-tabs mt-2xl">
                            <button
                                className={`dash-tab-btn ${lenderTab === 'requests' ? 'active' : ''}`}
                                onClick={() => setLenderTab('requests')}
                            >
                                <AlertCircle size={16} />
                                <span>Borrow Requests ({borrowRequests.length})</span>
                            </button>
                            <button
                                className={`dash-tab-btn ${lenderTab === 'listings' ? 'active' : ''}`}
                                onClick={() => setLenderTab('listings')}
                            >
                                <Package size={16} />
                                <span>My Wardrobe Listings ({myListings.length})</span>
                            </button>
                            <button
                                className={`dash-tab-btn ${lenderTab === 'earnings' ? 'active' : ''}`}
                                onClick={() => setLenderTab('earnings')}
                            >
                                <TrendingUp size={16} />
                                <span>Earnings & Payouts</span>
                            </button>
                        </div>

                        {/* Tab Content: Borrow Requests */}
                        {lenderTab === 'requests' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="pane-header-row mb-lg">
                                    <div>
                                        <h2 className="pane-title">Inbound Student Rental Requests</h2>
                                        <p className="pane-subtitle">
                                            Verified students requesting to rent outfits from your wardrobe. Accept to lock dates and coordinate meetup.
                                        </p>
                                    </div>
                                    <Link to="/upload" className="btn btn-burgundy btn-sm">
                                        <Plus size={14} />
                                        List Another Outfit
                                    </Link>
                                </div>

                                <div className="requests-cards-stack">
                                    {borrowRequests.map(req => (
                                        <div key={req.id} className={`request-card ${req.status}`}>
                                            <div className="request-card-header">
                                                <img
                                                    src={req.outfitImage}
                                                    alt={req.outfitTitle}
                                                    className="request-outfit-thumb"
                                                    onError={handleImageError}
                                                />
                                                <div className="request-main-info">
                                                    <div className="request-badge-row">
                                                        {req.status === 'pending' && (
                                                            <span className="badge badge-gold">⏳ Handover Confirmation Pending</span>
                                                        )}
                                                        {req.status === 'accepted' && (
                                                            <span className="badge badge-sage">✓ Request Accepted & Meetup Locked</span>
                                                        )}
                                                        {req.status === 'declined' && (
                                                            <span className="badge badge-subtle">✕ Declined</span>
                                                        )}
                                                        <span className="badge badge-outline">{req.occasion}</span>
                                                    </div>

                                                    <h3 className="request-outfit-name">{req.outfitTitle}</h3>

                                                    <div className="renter-profile-strip">
                                                        <div className="renter-avatar-circle">{req.renterAvatar}</div>
                                                        <div className="renter-text">
                                                            <strong>{req.renterName}</strong>
                                                            <span> • {req.renterDept} (Verified Student ID)</span>
                                                        </div>
                                                    </div>

                                                    <div className="request-details-grid mt-sm">
                                                        <div className="detail-pill">
                                                            <Calendar size={13} />
                                                            <span>Dates: <strong>{req.datesText} ({req.durationDays} Days)</strong></span>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <MapPin size={13} className="wine-icon" />
                                                            <span>Meetup Spot: <strong>{req.handoverSpot}</strong></span>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <ShieldCheck size={13} className="sage-icon" />
                                                            <span>Deposit Escrow: <strong>₹{req.securityDeposit}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="request-action-cluster">
                                                    <div className="request-earnings-badge">
                                                        <span className="earn-label">Your Payout</span>
                                                        <span className="earn-amount">₹{req.payoutAmount}</span>
                                                        <span className="earn-sub">Direct UPI Payout</span>
                                                    </div>

                                                    {req.status === 'pending' ? (
                                                        <div className="request-btn-group">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-burgundy"
                                                                onClick={() => handleRequestDecision(req.id, 'accepted')}
                                                            >
                                                                <Check size={14} />
                                                                <span>Accept Request</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => handleRequestDecision(req.id, 'declined')}
                                                            >
                                                                <X size={14} />
                                                                <span>Decline</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setActiveChatPeer({
                                                                name: req.renterName,
                                                                spot: req.handoverSpot,
                                                                outfit: req.outfitTitle
                                                            })}
                                                        >
                                                            <MessageSquare size={14} />
                                                            <span>Chat with {req.renterName.split(' ')[0]}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: My Wardrobe Listings */}
                        {lenderTab === 'listings' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="pane-header-row mb-lg">
                                    <div>
                                        <h2 className="pane-title">Your Wardrobe Closet ({myListings.length})</h2>
                                        <p className="pane-subtitle">
                                            Outfits you are lending out to students nearby. Toggle availability or adjust pricing anytime.
                                        </p>
                                    </div>
                                    <Link to="/upload" className="btn btn-burgundy">
                                        <Plus size={16} />
                                        <span>Add New Outfit</span>
                                    </Link>
                                </div>

                                <div className="lender-closet-grid">
                                    {/* Create New Outfit Card */}
                                    <Link to="/upload" className="create-outfit-cta-card">
                                        <div className="create-icon-plus">
                                            <Plus size={28} />
                                        </div>
                                        <h3>List Another Outfit</h3>
                                        <p>Have an ethnic lehenga, saree, or suit sitting idle in your hostel closet? Share it with students nearby.</p>
                                        <span className="create-cta-link">Start Listing (2 mins) &rarr;</span>
                                    </Link>

                                    {/* Existing Listings Cards */}
                                    {myListings.map(item => (
                                        <div key={item.id} className="wardrobe-manage-card">
                                            <div className="wardrobe-img-wrapper">
                                                <img
                                                    src={(item.images && item.images[0]) || FALLBACK_IMAGE}
                                                    alt={item.title}
                                                    onError={handleImageError}
                                                />
                                                <span className={`status-pill ${item.activeStatus}`}>
                                                    {item.activeStatus === 'available' ? '● Active & Visible' : '⏸ Paused'}
                                                </span>
                                            </div>

                                            <div className="wardrobe-card-content">
                                                <div className="wardrobe-cat-row">
                                                    <span className="cat-text">{item.category}</span>
                                                    <span className="views-badge">
                                                        <Eye size={12} />
                                                        <span>{item.viewsCount} views</span>
                                                    </span>
                                                </div>
                                                <h4 className="wardrobe-title">{item.title}</h4>

                                                <div className="wardrobe-pricing-row">
                                                    <div className="price-item">
                                                        <span className="lbl">Rental:</span>
                                                        <span className="val">₹{item.rental3DayPrice || 799} / 3 days</span>
                                                    </div>
                                                    <div className="price-item">
                                                        <span className="lbl">Deposit:</span>
                                                        <span className="val">₹{item.securityDeposit || 700}</span>
                                                    </div>
                                                </div>

                                                <div className="wardrobe-actions-row mt-md">
                                                    <button
                                                        type="button"
                                                        className="btn-status-toggle"
                                                        onClick={() => handleToggleListingStatus(item.id)}
                                                    >
                                                        {item.activeStatus === 'available' ? 'Pause Rental' : 'Activate Rental'}
                                                    </button>
                                                    <Link to={`/product/${item.id}`} className="btn-preview-link">
                                                        Preview
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Earnings & Payouts */}
                        {lenderTab === 'earnings' && (
                            <div className="tab-pane-content mt-xl">
                                <div className="earnings-overview-banner">
                                    <div className="earnings-hero-text">
                                        <span className="earnings-sub-badge">CAMPUS PILOT WARDROBE EARNINGS</span>
                                        <h2>₹2,247 <span className="currency-note">INR Realized</span></h2>
                                        <p>Net earnings from 3 completed rentals around campus. 100% of security deposits safely returned.</p>
                                    </div>
                                    <div className="payout-method-box">
                                        <div className="payout-status-chip">✓ Verified Payout UPI Connected</div>
                                        <span className="payout-acc-id">student-pilot@okhdfcbank</span>
                                        <span className="payout-frequency">Transfers settled within 2 hours of return inspection</span>
                                    </div>
                                </div>

                                <div className="payout-history-table mt-xl">
                                    <h3>Completed Campus Rentals</h3>
                                    <div className="table-responsive mt-md">
                                        <table className="dashboard-table">
                                            <thead>
                                                <tr>
                                                    <th>Outfit Rented</th>
                                                    <th>Verified Student Renter</th>
                                                    <th>Rental Duration</th>
                                                    <th>Handover Spot</th>
                                                    <th>Your Payout</th>
                                                    <th>Deposit Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>Emerald Green Silk Banarasi Lehenga</strong></td>
                                                    <td>Tanya K. (BBA '25)</td>
                                                    <td>3 Days</td>
                                                    <td>Main Campus Gate 1</td>
                                                    <td className="payout-green">+₹799</td>
                                                    <td><span className="badge badge-sage">Deposit Refunded</span></td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Ivory & Navy Indo-Western Asymmetric Kurta</strong></td>
                                                    <td>Arjun V. (B.Tech '26)</td>
                                                    <td>3 Days</td>
                                                    <td>Campus Gate 2 Library</td>
                                                    <td className="payout-green">+₹749</td>
                                                    <td><span className="badge badge-sage">Deposit Refunded</span></td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Champagne Shimmer Cocktail Slip Gown</strong></td>
                                                    <td>Rhea N. (Psychology '25)</td>
                                                    <td>3 Days</td>
                                                    <td>Student Center Quad</td>
                                                    <td className="payout-green">+₹699</td>
                                                    <td><span className="badge badge-sage">Deposit Refunded</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Handover Checklist Modal */}
            {checklistModalOpen && (
                <div className="modal-backdrop-overlay" onClick={() => setChecklistModalOpen(false)}>
                    <div className="modal-dialog-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-dialog-header">
                            <div className="modal-title-with-icon">
                                <ShieldCheck size={22} className="gold-icon" />
                                <h3>Campus Handover Inspection Checklist</h3>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setChecklistModalOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-dialog-body">
                            <p className="modal-intro">
                                Follow this quick 60-second checklist when meeting your student peer at the campus landmark:
                            </p>

                            <div className="checklist-items-stack mt-md">
                                <label className="checklist-item-row">
                                    <input type="checkbox" defaultChecked />
                                    <div className="check-text">
                                        <strong>1. Student ID Verification</strong>
                                        <span>Confirm your peer's enrolled student credentials match the booking profile.</span>
                                    </div>
                                </label>

                                <label className="checklist-item-row">
                                    <input type="checkbox" defaultChecked />
                                    <div className="check-text">
                                        <strong>2. Zipper, Closure & Hook Check</strong>
                                        <span>Test the main zip and fabric hooks together to verify smooth operation.</span>
                                    </div>
                                </label>

                                <label className="checklist-item-row">
                                    <input type="checkbox" defaultChecked />
                                    <div className="check-text">
                                        <strong>3. Fabric Seam & Hem Condition</strong>
                                        <span>Quick visual check of hemline and fabric condition (no stains or tears).</span>
                                    </div>
                                </label>

                                <label className="checklist-item-row">
                                    <input type="checkbox" defaultChecked />
                                    <div className="check-text">
                                        <strong>4. Agree on Return Landmark & Time</strong>
                                        <span>Re-confirm the exact return meetup time and campus spot before parting.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="modal-dialog-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setChecklistModalOpen(false)}
                            >
                                Got it, Looks Good!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Campus Meetup P2P Chat Modal */}
            {activeChatPeer && (
                <div className="modal-backdrop-overlay" onClick={() => setActiveChatPeer(null)}>
                    <div className="modal-dialog-box chat-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-dialog-header">
                            <div className="modal-title-with-icon">
                                <MessageSquare size={20} className="burgundy-icon" />
                                <div>
                                    <h3>Campus Meetup Chat: {activeChatPeer.name}</h3>
                                    <span className="chat-subtitle">Outfit: {activeChatPeer.outfit} • Spot: {activeChatPeer.spot}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setActiveChatPeer(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="chat-messages-container">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-bubble-row ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                    <div className="chat-bubble">
                                        <p>{msg.text}</p>
                                        <span className="chat-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input-bar">
                            <input
                                type="text"
                                placeholder={`Message ${activeChatPeer.name.split(' ')[0]} to coordinate meetup...`}
                                value={newChatInput}
                                onChange={e => setNewChatInput(e.target.value)}
                                className="chat-text-input"
                            />
                            <button type="submit" className="chat-send-btn" disabled={!newChatInput.trim()}>
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Dashboard;
