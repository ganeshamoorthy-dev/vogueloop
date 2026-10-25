import { Routes, Route, Navigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Application Pages
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import UploadListing from './pages/UploadListing';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="marketplace-app">
      <ScrollToTop />
      <AppHeader />
      <main className="marketplace-main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/outfits/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Navigate to="/dashboard?tab=wishlist" replace />} />
          <Route path="/rental-bag" element={<Cart />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-rentals" element={<Navigate to="/dashboard?tab=rentals" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadListing />} />
          <Route path="/list-garment" element={<UploadListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/browse" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
