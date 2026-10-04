import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = ({ wishlistCount = 0 }) => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/browse', icon: Compass },
    { label: 'Wishlist', path: '/browse?wishlist=true', icon: Heart, badge: wishlistCount },
    { label: 'Rentals', path: isAuthenticated ? '/dashboard?tab=rentals' : '/login', icon: Package, badge: itemCount },
    { label: 'Profile', path: isAuthenticated ? '/dashboard' : '/login', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-container">
              <Icon size={20} />
              {item.badge > 0 && <span className="mobile-badge">{item.badge}</span>}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
