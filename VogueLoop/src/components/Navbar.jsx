import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Heart, Sparkles, Sun, Moon } from 'lucide-react';
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
    const { wishlist, searchQuery, setSearchQuery } = useListings();
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

    const wishlistCount = wishlist.length;

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
        if (searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="navbar-header">
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <div className="container announcement-content">
                    <span className="announcement-text">
                        <Sparkles size={13} className="gold-sparkle" />
                        Complimentary Dry Cleaning & Doorstep Returns Included On All Rentals
                    </span>
                    <span className="announcement-link">
                        <Link to="/browse">Explore Evening Collection →</Link>
                    </span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        {/* Brand Logo */}
                        <Link to="/" className="navbar-logo">
                            <div className="logo-emblem">VL</div>
                            <div className="logo-text-wrapper">
                                <span className="logo-text-brand">VOGUE<span className="logo-text-gold">LOOP</span></span>
                                <span className="logo-sub-tagline">LUXURY ARCHIVE</span>
                            </div>
                        </Link>

                        {/* Streamlined Primary Desktop Nav Links */}
                        <div className="navbar-links">
                            <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}>
                                Browse Collection
                            </Link>
                            <a href="#how-it-works" onClick={(e) => {
                                if (location.pathname !== '/') {
                                    e.preventDefault();
                                    navigate('/#how-it-works');
                                }
                            }} className="nav-link">
                                How It Works
                            </a>
                        </div>

                        {/* Uncluttered Right Action Group */}
                        <div className="navbar-right-group">
                            {/* Expandable Compact Search */}
                            <form onSubmit={handleSearchSubmit} className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
                                <Search size={15} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="nav-search-input"
                                />
                            </form>

                            {/* Action Icons */}
                            <div className="navbar-actions">
                                {/* Theme Switcher Button */}
                                <button
                                    type="button"
                                    className="theme-toggle-btn"
                                    onClick={toggleTheme}
                                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Midnight Dark'} Theme`}
                                    aria-label="Toggle Dark Theme"
                                >
                                    {theme === 'dark' ? <Sun size={17} className="theme-icon sun" /> : <Moon size={17} className="theme-icon moon" />}
                                </button>

                                {/* Cart Link */}
                                <Link to="/cart" className="nav-icon-btn cart-icon-link" title="Rental Bag">
                                    <ShoppingBag size={18} />
                                    {itemCount > 0 && <span className="action-badge navy">{itemCount}</span>}
                                </Link>

                                {/* Account / Sign In Link */}
                                {isAuthenticated ? (
                                    <Link to="/dashboard" className="nav-icon-btn user-btn" title="Dashboard">
                                        <User size={18} />
                                        <span className="user-name-label">{user?.name?.split(' ')[0]}</span>
                                    </Link>
                                ) : null}

                                <button onClick={handleAuthToggle} className="btn btn-sm btn-primary nav-auth-btn">
                                    {isAuthenticated ? 'Logout' : 'Sign In'}
                                </button>

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
                            <form onSubmit={handleSearchSubmit} className="mobile-search-box">
                                <input
                                    type="text"
                                    placeholder="Search designer outfits..."
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
                                    Browse Collection
                                </Link>
                                <Link to="/upload" className="mobile-nav-link list-highlight" onClick={toggleMobileMenu}>
                                    + List Your Dress
                                </Link>
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                            My Dashboard & Rentals
                                        </Link>
                                        <button onClick={() => { handleAuthToggle(); toggleMobileMenu(); }} className="mobile-logout-btn">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="mobile-nav-link" onClick={toggleMobileMenu}>
                                        Sign In / Register
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
