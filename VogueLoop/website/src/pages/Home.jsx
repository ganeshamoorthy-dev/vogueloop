import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, MapPin, Repeat, Users, Tag } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import ClothingCard from '../components/ClothingCard';
import OccasionCard from '../components/OccasionCard';
import TrustLayer from '../components/TrustLayer';
import { getAppUrl } from '../utils/config';
import { handleImageError } from '../utils/imageFallback';
import './Home.css';

const OCCASIONS = [
  {
    title: 'College Fest',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Farewell & Graduation',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Festive & Ethnic Day',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Formals & Placements',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Weddings',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Parties & Birthdays',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'University Events',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Photoshoots & Performances',
    count: 'Available Nearby',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
];

const Home = () => {
    const { listings } = useListings();
    const featuredListings = listings.slice(0, 4);
    const [howItWorksTab, setHowItWorksTab] = useState('renter'); // 'renter' or 'lender'

    // Mouse Parallax for Hero Image
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX / window.innerWidth - 0.5) * 12;
        const moveY = (clientY / window.innerHeight - 0.5) * 12;
        setMouseOffset({ x: moveX, y: moveY });
    };

    const handleMouseLeave = () => {
        setMouseOffset({ x: 0, y: 0 });
    };

    return (
        <div className="home-page" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-text-content">
                            {/* Eyebrow - Student Hyperlocal Badge */}
                            <div className="hero-pill-badge hero-anim-eyebrow">
                                <Sparkles size={14} className="gold-sparkle" />
                                <span>HYPERLOCAL STUDENT FASHION NETWORK</span>
                            </div>

                            {/* Headline */}
                            <h1 className="hero-headline hero-anim-headline">
                                Your campus has a <span className="fashion-highlight-text">bigger closet</span> than you think.
                            </h1>

                            {/* Description */}
                            <p className="hero-subtext hero-anim-desc">
                                Rent occasion wear from verified students nearby or list outfits you already own and earn when you're not wearing them.
                            </p>

                            {/* CTAs: Direct to Marketplace */}
                            <div className="hero-cta-group hero-anim-buttons">
                                <a href={getAppUrl('/browse')} className="btn btn-lg btn-primary hero-btn-main">
                                    <span>Explore Outfits</span>
                                    <ArrowRight size={18} />
                                </a>
                                <Link to="/list-your-outfit" className="btn btn-lg btn-burgundy hero-btn-lender">
                                    List Your Outfit
                                </Link>
                            </div>

                            {/* Micro-Trust Indicators */}
                            <div className="hero-micro-trust hero-anim-trust">
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Verified Students</span>
                                </div>
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Hyperlocal Handover</span>
                                </div>
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Refundable Deposits</span>
                                </div>
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Zero Inventory</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Container */}
                        <div className="hero-visual-card hero-anim-image">
                            <div className="hero-image-frame">
                                <img
                                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                                    alt="Student shared occasion wear"
                                    className="hero-main-img"
                                    onError={handleImageError}
                                    style={{
                                        transform: `scale(1.02) translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
                                        transition: 'transform 200ms cubic-bezier(0.2, 0, 0.2, 1)',
                                    }}
                                />

                                {/* Floating P2P Product Card linking to Marketplace */}
                                <a href={getAppUrl('/product/1')} className="hero-floating-card hero-anim-floating">
                                    <div className="floating-card-badge">✓ Listed by Aishwarya R. (Verified Student)</div>
                                    <h4 className="floating-card-title">Royal Blue Zari Silk Lehenga</h4>
                                    <p className="floating-card-price">₹799 / 3 days</p>
                                    <div className="floating-card-location">
                                        <MapPin size={12} className="pin-icon" />
                                        <span>University Hub • 0.8 km from campus</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Marketplace Principles Bar */}
            <section className="brand-stat-bar py-xl">
                <div className="container">
                    <div className="stat-bar-grid p2p-pillars-grid">
                        <div className="brand-stat-item">
                            <div className="pillar-icon-box">
                                <MapPin size={22} className="gold-sparkle" />
                            </div>
                            <span className="pillar-title">HYPERLOCAL</span>
                            <span className="pillar-desc">Find outfits within your immediate student community.</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <div className="pillar-icon-box">
                                <Users size={22} className="gold-sparkle" />
                            </div>
                            <span className="pillar-title">PEER-TO-PEER</span>
                            <span className="pillar-desc">Rent directly from other students. VogueLoop holds zero inventory.</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <div className="pillar-icon-box">
                                <Tag size={22} className="gold-sparkle" />
                            </div>
                            <span className="pillar-title">AFFORDABLE</span>
                            <span className="pillar-desc">Wear high-value occasion wear starting at ₹599 without buying new.</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <div className="pillar-icon-box">
                                <Repeat size={22} className="gold-sparkle" />
                            </div>
                            <span className="pillar-title">CIRCULAR</span>
                            <span className="pillar-desc">Put idle PG wardrobes to work and keep outfits in circulation.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Occasion Ticker */}
            <section className="designer-showcase-bar py-lg">
                <div className="container text-center">
                    <span className="designer-kicker">CURATED FOR STUDENT LIFE</span>
                    <div className="designer-names-row mt-md">
                        <span>COLLEGE FESTS</span> • <span>FAREWELLS</span> • <span>ETHNIC DAYS</span> • <span>PLACEMENTS</span> • <span>PARTIES</span> • <span>BIRTHDAYS</span> • <span>PHOTOSHOOTS</span>
                    </div>
                </div>
            </section>

            {/* Studentized Occasion-First Discovery Section */}
            <section className="occasions-section py-3xl">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="section-kicker">WHAT ARE YOU DRESSING FOR?</span>
                        <h2>Campus Occasions & Events</h2>
                        <p>Explore outfits listed by students nearby for every moment on your university calendar.</p>
                    </div>

                    <div className="occasions-grid mt-2xl">
                        {OCCASIONS.map((occ) => (
                            <OccasionCard
                                key={occ.title}
                                title={occ.title}
                                count={occ.count}
                                image={occ.image}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Trust Layer */}
            <TrustLayer />

            {/* Featured Collection Section */}
            <section className="featured-section py-3xl">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="section-kicker">VERIFIED STUDENT CLOSETS</span>
                            <h2>Outfits Available Near You</h2>
                        </div>
                        <a href={getAppUrl('/browse')} className="view-all-link">
                            Explore All Nearby Outfits <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-4 mt-xl">
                        {featuredListings.map(item => (
                            <ClothingCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Two-Sided Marketplace Lifecycle: How VogueLoop Works */}
            <section id="how-it-works" className="how-it-works-section py-3xl">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="section-kicker">HOW THE PLATFORM WORKS</span>
                        <h2>A Shared Wardrobe for Your University</h2>
                        <p>VogueLoop facilitates secure, student-to-student rentals with transparent trust and safety.</p>

                        {/* Interactive Renter/Lender Flow Switcher */}
                        <div className="flow-switcher-pills mt-lg">
                            <button
                                type="button"
                                className={`flow-pill ${howItWorksTab === 'renter' ? 'active' : ''}`}
                                onClick={() => setHowItWorksTab('renter')}
                            >
                                How to Rent
                            </button>
                            <button
                                type="button"
                                className={`flow-pill ${howItWorksTab === 'lender' ? 'active' : ''}`}
                                onClick={() => setHowItWorksTab('lender')}
                            >
                                How to List & Earn
                            </button>
                        </div>
                    </div>

                    {howItWorksTab === 'renter' ? (
                        <div className="simple-lifecycle-grid mt-2xl animate-fade-in">
                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">01</div>
                                <h3>Discover Nearby</h3>
                                <p>Browse occasion wear listed by verified students living around your campus zone.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">02</div>
                                <h3>Request & Book</h3>
                                <p>Select your dates and check exact garment measurements with a refundable security deposit.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">03</div>
                                <h3>Campus Handover</h3>
                                <p>Meet at convenient, safe public campus spots (e.g. Main Campus Gate 1 or Student Center) to receive the outfit.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">04</div>
                                <h3>Wear & Return</h3>
                                <p>Look amazing at your event and return the garment as agreed to receive your full deposit refund.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="simple-lifecycle-grid mt-2xl animate-fade-in">
                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">01</div>
                                <h3>List Your Outfit</h3>
                                <p>Snap 3 photos of an unused outfit in your closet, add measurements, and get suggested pricing.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">02</div>
                                <h3>Accept Request</h3>
                                <p>Review incoming booking requests from verified campus students and confirm your available dates.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">03</div>
                                <h3>Hand Over Safely</h3>
                                <p>Exchange the outfit at a recognizable public meeting point with pre-rental condition photos.</p>
                            </div>

                            <div className="lifecycle-step-card">
                                <div className="lifecycle-step-num">04</div>
                                <h3>Earn Income</h3>
                                <p>Collect payout straight to your account once the outfit is safely returned to your wardrobe.</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-2xl">
                        <Link to="/how-it-works" className="btn btn-secondary">
                            View Detailed How-It-Works Guide <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Circular Fashion & Sustainability Section */}
            <section className="sustainability-section py-2xl">
                <div className="container">
                    <div className="sustainability-card">
                        <div className="sustainability-content">
                            <span className="badge badge-gold mb-sm">CIRCULAR FASHION IN ACTION</span>
                            <h2>Wear more. Buy less. Loop fashion.</h2>
                            <p>
                                One outfit shouldn't have only one moment. VogueLoop helps student wardrobes circulate through the campus community instead of leaving beautiful occasion wear sitting unused in PG closets.
                            </p>
                        </div>
                        <div className="sustainability-quote">
                            <blockquote>
                                "The most sustainable garment is the one already in your university's closets."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lender Callout CTA Banner */}
            <section className="lender-cta-section py-2xl">
                <div className="container">
                    <div className="lender-cta-banner">
                        <div className="lender-cta-grid">
                            <div className="lender-cta-content">
                                <span className="badge badge-gold mb-md">STUDENT WARDROBE LENDER</span>
                                <h2>Turn Your Closet Into Income</h2>
                                <p>
                                    List occasion wear sitting unused in your wardrobe and earn whenever another student nearby rents it. Zero inventory fees, flexible availability calendar.
                                </p>
                                <div className="lender-cta-actions mt-xl">
                                    <a href={getAppUrl('/upload')} className="btn btn-lg btn-burgundy">
                                        List Your Outfit on Marketplace
                                    </a>
                                </div>
                            </div>

                            <div className="lender-cta-visual">
                                <div className="lender-feature-list">
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>Refundable Renter Deposit</strong>
                                            <p>Security deposits encourage responsible student care and protect lenders.</p>
                                        </div>
                                    </div>
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>Condition Documentation</strong>
                                            <p>Pre- and post-rental photo checks verify the outfit's state at handover.</p>
                                        </div>
                                    </div>
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>Safe Local Meeting Points</strong>
                                            <p>Suggest recognizable public campus spots for safe and transparent exchanges.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
