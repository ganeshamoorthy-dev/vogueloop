import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useCart } from '../context/CartContext';
import {
  Package, ShoppingBag, User as UserIcon,
  TrendingUp, Calendar, Plus, ShieldCheck, Heart,
  MapPin, CheckCircle2, MessageSquare, Check, X,
  AlertCircle, Eye, Info, Send, BadgeCheck, FileText,
  UserCheck, Bell, ChevronRight, ChevronLeft, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import RentalTimeline from '../components/RentalTimeline';
import ClothingCard from '../components/ClothingCard';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Dashboard.css';

// Demo incoming borrow requests for the Host/Lender view
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
    status: 'pending',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { listings, wishlist, getListingById } = useListings();
  const { cartItems } = useCart();

  // Active workspace tab (defaults to 'rentals', can be 'rentals' | 'wishlist' | 'checklist' | 'requests' | 'listings' | 'earnings' | 'profile')
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'rentals';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // State for lender requests
  const [borrowRequests, setBorrowRequests] = useState(INITIAL_BORROW_REQUESTS);

  // Modal states
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [activeChatPeer, setActiveChatPeer] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'peer', text: 'Hey! I can meet you right near Main Campus Gate 1 by 4:45 PM. Does that work for you?', time: '2:15 PM' },
    { sender: 'me', text: 'Sounds great! I will be by the campus steps wearing a blue jacket.', time: '2:20 PM' }
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  // Listings owned by user
  const [myListings, setMyListings] = useState(() => {
    return listings.slice(0, 3).map((item, idx) => ({
      ...item,
      activeStatus: 'available',
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

  // Wishlist items
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

  const handleRequestDecision = (id, newStatus) => {
    setBorrowRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleToggleListingStatus = (listingId) => {
    setMyListings(prev =>
      prev.map(l =>
        l.id === listingId
          ? { ...l, activeStatus: l.activeStatus === 'available' ? 'paused' : 'available' }
          : l
      )
    );
  };

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
    <div className="workspace-dashboard">
      {/* Top Return Navigation */}
      <div className="dashboard-top-nav">
        <div className="app-back-navigation">
          <Link to="/browse" className="back-nav-btn" title="Return to Marketplace Outfits">
            <ChevronLeft size={16} />
            <span>Back to Browse Outfits</span>
          </Link>
        </div>
      </div>

      <div className="workspace-container">
        {/* Left Column: Vertical Sidebar Workspace Navigation */}
        <aside className="workspace-sidebar">
          {/* Student Profile Card */}
          <div className="student-profile-badge">
            <div className="student-avatar-box">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="student-info-meta">
              <h3 className="student-name">{user?.name || 'Aanya Sharma'}</h3>
              <div className="student-verified-tag">
                <BadgeCheck size={13} className="sage-badge-icon" />
                <span>Enrolled Student Verified</span>
              </div>
              <span className="student-campus-location">📍 Main Campus Hub</span>
            </div>
          </div>

          {/* Navigation Section: Borrower (Renter) */}
          <div className="sidebar-group">
            <span className="sidebar-group-title">👔 BORROWING (RENTER)</span>
            <nav className="sidebar-nav-list">
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'rentals' ? 'active' : ''}`}
                onClick={() => switchTab('rentals')}
              >
                <div className="nav-item-left">
                  <ShoppingBag size={16} />
                  <span>Active Rentals</span>
                </div>
                <span className="sidebar-count-badge navy">{effectiveRentals.length}</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => switchTab('wishlist')}
              >
                <div className="nav-item-left">
                  <Heart size={16} />
                  <span>Saved Wishlist</span>
                </div>
                {wishlistItems.length > 0 && (
                  <span className="sidebar-count-badge burgundy">{wishlistItems.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'checklist' ? 'active' : ''}`}
                onClick={() => switchTab('checklist')}
              >
                <div className="nav-item-left">
                  <ShieldCheck size={16} />
                  <span>Handover Protocol</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Navigation Section: Wardrobe Host (Lender) */}
          <div className="sidebar-group">
            <span className="sidebar-group-title">💼 WARDROBE (LENDER)</span>
            <nav className="sidebar-nav-list">
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => switchTab('requests')}
              >
                <div className="nav-item-left">
                  <AlertCircle size={16} />
                  <span>Borrow Requests</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="sidebar-count-badge gold">{pendingRequestsCount}</span>
                )}
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'listings' ? 'active' : ''}`}
                onClick={() => switchTab('listings')}
              >
                <div className="nav-item-left">
                  <Package size={16} />
                  <span>My Closet Listings</span>
                </div>
                <span className="sidebar-count-badge muted">{myListings.length}</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => switchTab('earnings')}
              >
                <div className="nav-item-left">
                  <TrendingUp size={16} />
                  <span>Earnings & Payouts</span>
                </div>
              </button>

              <Link to="/upload" className="sidebar-nav-item upload-cta">
                <div className="nav-item-left">
                  <Plus size={16} />
                  <span>+ List New Outfit</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Navigation Section: Student Account */}
          <div className="sidebar-group">
            <span className="sidebar-group-title">👤 ACCOUNT</span>
            <nav className="sidebar-nav-list">
              <button
                type="button"
                className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => switchTab('profile')}
              >
                <div className="nav-item-left">
                  <UserCheck size={16} />
                  <span>Profile & ID Status</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Column: Dynamic Main Workspace Pane */}
        <main className="workspace-main-pane">
          {/* TAB 1: ACTIVE RENTALS */}
          {activeTab === 'rentals' && (
            <div className="tab-pane-content animate-fade-in">
              {/* Quick KPI Cards */}
              <div className="workspace-kpi-grid">
                <div className="kpi-card border-navy">
                  <div className="kpi-icon-box navy">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Active Rentals</span>
                    <span className="kpi-val">{effectiveRentals.length}</span>
                    <span className="kpi-hint sage">Handover coordinated</span>
                  </div>
                </div>

                <div className="kpi-card border-wine">
                  <div className="kpi-icon-box wine">
                    <MapPin size={20} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Next Meetup Spot</span>
                    <span className="kpi-val-text">Main Campus Gate 1</span>
                    <span className="kpi-hint">Tomorrow, 4:30 PM</span>
                  </div>
                </div>

                <div className="kpi-card border-gold">
                  <div className="kpi-icon-box gold">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="kpi-details">
                    <span className="kpi-label">Deposit in Escrow</span>
                    <span className="kpi-val">₹{totalDepositsEscrow.toLocaleString('en-IN')}</span>
                    <span className="kpi-hint gold">Refunds at return check</span>
                  </div>
                </div>
              </div>

              {/* Active Bookings List */}
              <div className="workspace-section-header mt-xl">
                <div>
                  <h2 className="workspace-title">Active & Upcoming Campus Rentals</h2>
                  <p className="workspace-subtitle">Coordinate handovers, track locked escrow deposits, and message lenders.</p>
                </div>
                <Link to="/browse" className="btn btn-sm btn-secondary">
                  + Browse More Outfits
                </Link>
              </div>

              <div className="rentals-list-cards mt-md">
                {effectiveRentals.map(rental => (
                  <div key={rental.cartId || rental.id} className="rental-tracker-card">
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
                            <span>Meetup: <strong>{rental.handoverSpot || 'Main Campus Gate 1 / Student Center'}</strong></span>
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
                            <span>Checklist</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="tracker-lifecycle-wrapper mt-lg pt-md">
                      <RentalTimeline currentStatus="handover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SAVED WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="workspace-section-header">
                <div>
                  <h2 className="workspace-title">Saved Wishlist ({wishlistItems.length})</h2>
                  <p className="workspace-subtitle">Outfits from fellow student closets you have bookmarked for upcoming campus occasions.</p>
                </div>
                <Link to="/browse" className="btn btn-sm btn-primary">
                  Explore Closets
                </Link>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-md mt-lg">
                  {wishlistItems.map(item => (
                    <ClothingCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-card mt-xl">
                  <Heart size={44} className="empty-icon text-muted" />
                  <h3>Your Wishlist is Empty</h3>
                  <p>Bookmark outfits you love while browsing to save them here for your next event.</p>
                  <Link to="/browse" className="btn btn-primary mt-md">Browse Nearby Outfits</Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HANDOVER PROTOCOL */}
          {activeTab === 'checklist' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="handover-guide-card">
                <div className="guide-header">
                  <ShieldCheck size={28} className="gold-icon" />
                  <div>
                    <h3>VogueLoop Campus Handover & Return Protocol</h3>
                    <p>Our 4-step trust standard ensures stress-free campus rentals and fast deposit refunds.</p>
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

          {/* TAB 4: BORROW REQUESTS (LENDER) */}
          {activeTab === 'requests' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="workspace-section-header">
                <div>
                  <h2 className="workspace-title">Inbound Student Rental Requests ({borrowRequests.length})</h2>
                  <p className="workspace-subtitle">Review incoming booking requests from verified students. Accept to lock dates and coordinate meetup.</p>
                </div>
                <Link to="/upload" className="btn btn-sm btn-burgundy">
                  <Plus size={14} /> + List Outfit
                </Link>
              </div>

              <div className="requests-cards-stack mt-lg">
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
                            <span>Meetup: <strong>{req.handoverSpot}</strong></span>
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

          {/* TAB 5: MY CLOSET LISTINGS (LENDER) */}
          {activeTab === 'listings' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="workspace-section-header">
                <div>
                  <h2 className="workspace-title">Your Wardrobe Closet ({myListings.length})</h2>
                  <p className="workspace-subtitle">Outfits you are hosting for other students. Toggle availability or adjust details anytime.</p>
                </div>
                <Link to="/upload" className="btn btn-sm btn-burgundy">
                  <Plus size={14} />
                  <span>List New Outfit</span>
                </Link>
              </div>

              <div className="lender-closet-grid mt-lg">
                {/* Create New Outfit Card */}
                <Link to="/upload" className="create-outfit-cta-card">
                  <div className="create-icon-plus">
                    <Plus size={28} />
                  </div>
                  <h3>List Another Outfit</h3>
                  <p>Have an ethnic lehenga, saree, or suit sitting idle in your closet? Share it with students nearby.</p>
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

          {/* TAB 6: EARNINGS & PAYOUTS */}
          {activeTab === 'earnings' && (
            <div className="tab-pane-content animate-fade-in">
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
                        <td><strong>Ivory & Navy Indo-Western Kurta</strong></td>
                        <td>Arjun V. (B.Tech '26)</td>
                        <td>3 Days</td>
                        <td>Campus Gate 2 Library</td>
                        <td className="payout-green">+₹749</td>
                        <td><span className="badge badge-sage">Deposit Refunded</span></td>
                      </tr>
                      <tr>
                        <td><strong>Champagne Shimmer Cocktail Gown</strong></td>
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

          {/* TAB 7: PROFILE & VERIFICATION */}
          {activeTab === 'profile' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="profile-details-card">
                <div className="profile-details-header">
                  <UserCheck size={28} className="gold-icon" />
                  <div>
                    <h3>Campus Enrollment & Verification Status</h3>
                    <p>Verified student badges protect community transactions and unlock zero-collateral rentals.</p>
                  </div>
                </div>

                <div className="profile-details-grid mt-xl">
                  <div className="profile-field-box">
                    <span className="field-lbl">Full Student Name</span>
                    <span className="field-val">{user?.name || 'Aanya Sharma'}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-lbl">Enrolled University</span>
                    <span className="field-val">University Hub Central Campus</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-lbl">Campus Email / ID</span>
                    <span className="field-val">{user?.email || 'aanya.sharma@university.edu'}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-lbl">Verification Status</span>
                    <span className="field-val sage-text">✓ ID Document Verified</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-lbl">Primary Handover Spot</span>
                    <span className="field-val">Main Campus Gate 1 / Student Center</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-lbl">Payout UPI ID</span>
                    <span className="field-val">student-pilot@okhdfcbank</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
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

      <MobileBottomNav wishlistCount={wishlist.length} />
    </div>
  );
};

export default Dashboard;

