import { Routes, Route, Navigate } from 'react-router-dom';
import MarketingNavbar from './components/MarketingNavbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Website Pages
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import TrustAndSafety from './pages/TrustAndSafety';
import ListYourOutfit from './pages/ListYourOutfit';
import Policies from './pages/Policies';

function App() {
  return (
    <div className="website-root">
      <ScrollToTop />
      <MarketingNavbar />
      <main className="website-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/trust-and-safety" element={<TrustAndSafety />} />
          <Route path="/list-your-outfit" element={<ListYourOutfit />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
