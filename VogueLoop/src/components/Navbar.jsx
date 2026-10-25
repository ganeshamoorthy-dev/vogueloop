import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Heart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useListings } from '../context/ListingsContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const { searchQuery, setSearchQuery, wishlist } = useListings();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Theme Toggle State (Default: Dark 'Midnight Wine Luxury')
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('vogueloop_theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
        localStorage.setItem('vogueloop_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleAuthToggle = () => {
        if (isAuthenticated) {
            logout();
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== '/browse') {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="navbar-header">
            {/* Main Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        {/* Brand Logo — Always returns user to Home */}
                        <Link to="/" className="navbar-logo" title="VogueLoop Home">
                            <div className="logo-emblem">VL</div>
                            <div className="logo-text-wrapper">
                                <span className="logo-text-brand">VOGUE<span className="logo-text-gold">LOOP</span></span>
                                <span className="logo-sub-tagline">CAMPUS FASHION LOOP</span>
                            </div>
                        </Link>

                        {/* Centered Desktop Nav Links */}
                        <div className="navbar-links">
                            <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}>
                                Browse Outfits
                            </Link>
                            <a
                                href="/#how-it-works"
                                onClick={(e) => {
                                    if (location.pathname !== '/') {
                                        e.preventDefault();
                                        navigate('/#how-it-works');
                                    }
                                }}
                                className="nav-link"
                            >
                                How It Works
                            </a>
                            <Link to="/policies" className={`nav-link ${location.pathname === '/policies' ? 'active' : ''}`}>
                                Trust & Policies
                            </Link>
                        </div>

                        {/* Right Action Group */}
                        <div className="navbar-right-group">
                            {/* Expandable Compact Search */}
                            <form onSubmit={handleSearchSubmit} className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
                                <Search size={15} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search campus outfits..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="nav-search-input"
                                    aria-label="Search outfits"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="clear-search-btn"
                                        aria-label="Clear search"
                                        style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </form>

                            {/* Action Icons */}
                            <div className="navbar-actions">
                                {/* Theme Switcher Button */}
                                <button
                                    type="button"
                                    className="theme-toggle-btn"
                                    onClick={toggleTheme}
                                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Midnight Dark'} Theme`}
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? <Sun size={16} className="theme-icon sun" /> : <Moon size={16} className="theme-icon moon" />}
                                </button>

                                {/* Wishlist Link */}
                                <Link
                                    to="/browse?wishlist=true"
                                    className="nav-icon-btn wishlist-icon-link"
                                    title="Saved Wishlist"
                                    aria-label={`Saved Wishlist (${wishlist?.length || 0} items)`}
                                >
                                    <Heart
                                        size={17}
                                        fill={wishlist?.length > 0 ? 'var(--brand-fashion)' : 'none'}
                                        color={wishlist?.length > 0 ? 'var(--brand-fashion)' : 'currentColor'}
                                    />
                                    {wishlist?.length > 0 && <span className="action-badge burgundy">{wishlist.length}</span>}
                                </Link>

                                {/* Cart Link */}
                                <Link
                                    to="/cart"
                                    className="nav-icon-btn cart-icon-link"
                                    title="Rental Bag"
                                    aria-label={`Rental Bag (${itemCount} items)`}
                                >
                                    <ShoppingBag size={17} />
                                    {itemCount > 0 && <span className="action-badge navy">{itemCount}</span>}
                                </Link>

                                {/* Account / Sign In */}
                                {isAuthenticated ? (
                                    <div className="nav-user-cluster">
                                        <Link to="/dashboard" className="nav-user-pill" title="Student Dashboard">
                                            <User size={15} />
                                            <span className="user-name-label">{user?.name?.split(' ')[0] || 'Student'}</span>
                                        </Link>
                                        <button onClick={handleAuthToggle} className="btn btn-sm btn-secondary nav-logout-btn">
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleAuthToggle} className="btn btn-sm btn-primary nav-auth-btn">
                                        Sign In
                                    </button>
                                )}

                                {/* Mobile Hamburger Button */}
                                <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Navigation Menu">
                                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Drawer Navigation */}
                    {mobileMenuOpen && (
                        <div className="mobile-menu animate-fade-in">
                            <form onSubmit={(e) => { handleSearchSubmit(e); toggleMobileMenu(); }} className="mobile-search-box">
                                <input
                                    type="text"
                                    placeholder="Search campus outfits..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input"
                                />
                            </form>
                            <div className="mobile-nav-links">
                                <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    Home
                                </Link>
                                <Link to="/browse" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    Browse Outfits
                                </Link>
                                <a href="/#how-it-works" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    How It Works
                                </a>
                                <Link to="/policies" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    Trust & Campus Policies
                                </Link>
                                <Link to="/browse?wishlist=true" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    Saved Wishlist ({wishlist?.length || 0})
                                </Link>
                                <Link to="/cart" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                    Rental Bag ({itemCount})
                                </Link>

                                <div className="mobile-menu-divider" style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                            My Dashboard (Renter & Host)
                                        </Link>
                                        <Link to="/upload" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                            + List an Outfit to Closet
                                        </Link>
                                        <button onClick={() => { handleAuthToggle(); toggleMobileMenu(); }} className="mobile-logout-btn">
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="mobile-nav-link highlight" onClick={toggleMobileMenu}>
                                        Student Sign In / Register
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
