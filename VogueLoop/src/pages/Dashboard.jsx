import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useCart } from '../context/CartContext';
import {
    Package, ShoppingBag, User as UserIcon, ToggleLeft, ToggleRight,
    TrendingUp, Calendar, Clock, Plus, ShieldCheck, Heart, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import RentalTimeline from '../components/RentalTimeline';
import ClothingCard from '../components/ClothingCard';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Dashboard.css';

const Dashboard = () => {
    const { user, switchRole, isLender } = useAuth();
    const { listings, wishlist, getListingById } = useListings();
    const { cartItems } = useCart();

    const [activeTab, setActiveTab] = useState('rentals'); // 'rentals', 'listings', 'earnings', 'wishlist'

    // Owner listings and customer rentals
    const userListings = listings.filter(listing => listing.owner === user?.name || true); // fallback for demo
    const userRentals = cartItems;
    const wishlistItems = wishlist.map(id => getListingById(id)).filter(Boolean);

    const isOwnerMode = user?.role === 'lender';

    const handleRoleSwitch = () => {
        const newRole = isOwnerMode ? 'customer' : 'lender';
        switchRole(newRole);
    };

    return (
        <div className="dashboard-page">
            <div className="container py-2xl">
                {/* User Welcome Banner */}
                <div className="dashboard-header-card">
                    <div className="user-profile-meta">
                        <div className="user-avatar-circle">
                            <UserIcon size={32} />
                        </div>
                        <div>
                            <div className="profile-role-badge">
                                <span className={`badge ${isOwnerMode ? 'badge-burgundy' : 'badge-navy'}`}>
                                    {isOwnerMode ? '💼 Lender Mode' : '👔 Renter Mode'}
                                </span>
                            </div>
                            <h1>Welcome back, {user?.name || 'Valued Member'}!</h1>
                            <p className="profile-subtext">
                                {isOwnerMode
                                    ? 'Manage your dress listings, active rentals, and track closet earnings.'
                                    : 'Track your upcoming outfit rentals, delivery timelines, and saved wishlist.'}
                            </p>
                        </div>
                    </div>

                    <button onClick={handleRoleSwitch} className="btn btn-secondary role-switcher-btn">
                        {isOwnerMode ? <ToggleRight size={22} className="burgundy-icon" /> : <ToggleLeft size={22} />}
                        Switch to {isOwnerMode ? 'Renter View' : 'Owner / Lender Mode'}
                    </button>
                </div>

                {/* Performance Stats Cards */}
                <div className="stats-cards-grid mt-xl">
                    <div className="dashboard-stat-card">
                        <div className="stat-icon-wrapper navy">
                            <ShoppingBag size={22} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Active Rentals</span>
                            <span className="stat-number">{userRentals.length}</span>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-icon-wrapper burgundy">
                            <Package size={22} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Your Listings</span>
                            <span className="stat-number">{userListings.length}</span>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-icon-wrapper gold">
                            <TrendingUp size={22} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Estimated Closet Earnings</span>
                            <span className="stat-number">₹{(userListings.length * 4500).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="dashboard-stat-card">
                        <div className="stat-icon-wrapper sage">
                            <ShieldCheck size={22} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Verification Status</span>
                            <span className="stat-status-text">✓ ID & Garments Verified</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="dashboard-navigation-tabs mt-2xl">
                    <button
                        className={`dash-tab-btn ${activeTab === 'rentals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rentals')}
                    >
                        <ShoppingBag size={16} />
                        My Active Rentals ({userRentals.length})
                    </button>

                    <button
                        className={`dash-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('listings')}
                    >
                        <Package size={16} />
                        My Closet Listings ({userListings.length})
                    </button>

                    <button
                        className={`dash-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wishlist')}
                    >
                        <Heart size={16} />
                        Wishlist ({wishlistItems.length})
                    </button>
                </div>

                {/* Main Tab Content */}
                <div className="dashboard-tab-content mt-xl">
                    {/* Active Rentals Tab */}
                    {activeTab === 'rentals' && (
                        <div className="rentals-tab-content">
                            <div className="tab-section-header">
                                <h2>Active & Upcoming Rentals</h2>
                                <p className="text-secondary">Track live delivery status and return deadlines for your rented outfits.</p>
                            </div>

                            {userRentals.length > 0 ? (
                                <div className="rentals-list-cards">
                                    {userRentals.map(rental => (
                                        <div key={rental.cartId} className="rental-tracker-card mb-xl">
                                            <div className="tracker-item-header">
                                                <img
                                                    src={(rental.images && rental.images[0]) || FALLBACK_IMAGE}
                                                    alt={rental.title}
                                                    className="tracker-img"
                                                    onError={handleImageError}
                                                />
                                                <div className="tracker-item-info">
                                                    <div className="tracker-badge-row">
                                                        <span className="badge badge-sage">✓ Confirmed & Preparing</span>
                                                        <span className="tracker-size-pill">Size: {rental.selectedSize || 'M'}</span>
                                                    </div>
                                                    <h3>{rental.title}</h3>
                                                    <p className="tracker-owner-name">Listed by {rental.owner || 'Verified Lender'}</p>
                                                    <div className="tracker-dates-info">
                                                        <Calendar size={14} />
                                                        <span>
                                                            {format(new Date(rental.startDate), 'MMM dd, yyyy')} — {format(new Date(rental.endDate), 'MMM dd, yyyy')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="tracker-item-price">
                                                    <span className="price-label">Rental Fee</span>
                                                    <span className="price-val">₹{rental.pricePerDay}/day</span>
                                                </div>
                                            </div>

                                            {/* Rental Lifecycle Step Tracker */}
                                            <RentalTimeline currentStatus="booked" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="dashboard-empty-state">
                                    <ShoppingBag size={48} className="empty-icon" />
                                    <h3>No Active Rentals</h3>
                                    <p>You don't have any outfits currently booked. Explore our collection for your next occasion!</p>
                                    <Link to="/browse" className="btn btn-primary mt-md">Explore Dresses</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Closet Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="listings-tab-content">
                            <div className="tab-section-header flex-header">
                                <div>
                                    <h2>Your Closet Listings</h2>
                                    <p className="text-secondary">Manage outfits listed on VogueLoop and monitor rental earnings.</p>
                                </div>
                                <Link to="/upload" className="btn btn-burgundy">
                                    <Plus size={18} />
                                    List New Outfit
                                </Link>
                            </div>

                            {userListings.length > 0 ? (
                                <div className="grid grid-cols-3 mt-xl">
                                    {userListings.map(listing => (
                                        <div key={listing.id} className="owner-listing-card">
                                            <div className="listing-card-img-wrapper">
                                                <img
                                                    src={(listing.images && listing.images[0]) || FALLBACK_IMAGE}
                                                    alt={listing.title}
                                                    onError={handleImageError}
                                                />
                                                <span className="listing-status-badge sage">Active & Available</span>
                                            </div>
                                            <div className="listing-card-body">
                                                <span className="listing-cat">{listing.category}</span>
                                                <h4>{listing.title}</h4>
                                                <div className="listing-earnings-bar">
                                                    <span>Rate: <strong>₹{listing.pricePerDay}/day</strong></span>
                                                    <span>Rating: <strong>★ {listing.rating || 5.0}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="dashboard-empty-state">
                                    <Package size={48} className="empty-icon" />
                                    <h3>No Outfits Listed Yet</h3>
                                    <p>Start earning from clothes sitting in your closet by listing your first dress.</p>
                                    <Link to="/upload" className="btn btn-burgundy mt-md">
                                        <Plus size={18} />
                                        List Your Dress
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                        <div className="wishlist-tab-content">
                            <div className="tab-section-header">
                                <h2>Saved Wishlist Outfits</h2>
                                <p className="text-secondary">Dresses you have saved for upcoming occasions.</p>
                            </div>

                            {wishlistItems.length > 0 ? (
                                <div className="grid grid-cols-4 mt-xl">
                                    {wishlistItems.map(item => (
                                        <ClothingCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="dashboard-empty-state">
                                    <Heart size={48} className="empty-icon" />
                                    <h3>Your Wishlist is Empty</h3>
                                    <p>Tap the heart icon on any outfit while browsing to save it here!</p>
                                    <Link to="/browse" className="btn btn-primary mt-md">Browse Collection</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Dashboard;
