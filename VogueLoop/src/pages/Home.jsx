import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import ClothingCard from '../components/ClothingCard';
import OccasionCard from '../components/OccasionCard';
import TrustLayer from '../components/TrustLayer';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { handleImageError, FALLBACK_IMAGE } from '../utils/imageFallback';
import './Home.css';

const OCCASIONS = [
  {
    title: 'Wedding',
    count: '48 Outfits',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Reception',
    count: '32 Outfits',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Party',
    count: '24 Outfits',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Cocktail',
    count: '29 Outfits',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Birthday',
    count: '18 Outfits',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Formal',
    count: '35 Outfits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Date Night',
    count: '20 Outfits',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Festive',
    count: '42 Outfits',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
];

const Home = () => {
    const { listings, wishlist } = useListings();
    const [searchParams] = useSearchParams();
    const selectedOccasionParam = searchParams.get('occasion');
    const featuredListings = listings.slice(0, 4);

    // Mouse Parallax for Hero Image
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX / window.innerWidth - 0.5) * 12; // -6px to 6px
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
                            {/* Eyebrow - Burgundy Fashion Badge */}
                            <div className="hero-pill-badge hero-anim-eyebrow">
                                <Sparkles size={14} className="gold-sparkle" />
                                <span>Midnight Wine Luxury Rental</span>
                            </div>

                            {/* Headline */}
                            <h1 className="hero-headline hero-anim-headline">
                                Find the look for your <span className="fashion-highlight-text">moment.</span>
                            </h1>

                            {/* Description */}
                            <p className="hero-subtext hero-anim-desc">
                                Dresses made for moments worth remembering. Explore evening gowns, lehengas, and suits for weddings, celebrations and every occasion in between.
                            </p>

                            {/* Buttons: Primary Navy Transactional & Secondary Burgundy Discovery */}
                            <div className="hero-cta-group hero-anim-buttons">
                                <Link to="/browse" className="btn btn-lg btn-primary hero-btn-main">
                                    Explore Collection
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/upload" className="btn btn-lg btn-burgundy hero-btn-lender">
                                    List Your Dress
                                </Link>
                            </div>

                            {/* Micro-Trust Indicators */}
                            <div className="hero-micro-trust hero-anim-trust">
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Dry Cleaned & Sanitized</span>
                                </div>
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Verified Owners</span>
                                </div>
                                <div className="micro-trust-item">
                                    <CheckCircle2 size={16} className="sage-check" />
                                    <span>Doorstep Delivery & Return</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Container */}
                        <div className="hero-visual-card hero-anim-image">
                            <div className="hero-image-frame">
                                <img
                                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                                    alt="Royal Blue Zari Lehenga"
                                    className="hero-main-img"
                                    onError={handleImageError}
                                    style={{
                                        transform: `scale(1.02) translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
                                        transition: 'transform 200ms cubic-bezier(0.2, 0, 0.2, 1)',
                                    }}
                                />

                                {/* Floating Product Card */}
                                <div className="hero-floating-card hero-anim-floating">
                                    <div className="floating-card-badge">✓ Available Now</div>
                                    <h4 className="floating-card-title">Royal Blue Zari Lehenga</h4>
                                    <p className="floating-card-price">₹1,499 / 3 days</p>
                                    <div className="floating-card-rating">
                                        <Star size={12} fill="#C9A96E" color="#C9A96E" />
                                        <span>4.9 (28 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Authority Stat Bar */}
            <section className="brand-stat-bar py-xl">
                <div className="container">
                    <div className="stat-bar-grid">
                        <div className="brand-stat-item">
                            <span className="stat-number-gold">50,000+</span>
                            <span className="stat-text-label">Designer Rentals Delivered</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <span className="stat-number-gold">₹15 Cr+</span>
                            <span className="stat-text-label">Curated Closet Inventory</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <span className="stat-number-gold">100%</span>
                            <span className="stat-text-label">Eco Sanitized & Inspected</span>
                        </div>
                        <div className="stat-divider-line"></div>
                        <div className="brand-stat-item">
                            <span className="stat-number-gold">4.9 ★</span>
                            <span className="stat-text-label">Luxury Member Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Couture Designer Showcase */}
            <section className="designer-showcase-bar py-lg">
                <div className="container text-center">
                    <span className="designer-kicker">FEATURED COUTURE ARCHIVES</span>
                    <div className="designer-names-row mt-md">
                        <span>SABYASACHI</span> • <span>MANISH MALHOTRA</span> • <span>ANITA DONGRE</span> • <span>TARUN TAHILIANI</span> • <span>SEEMA GUJRAL</span> • <span>FALGUNI SHANE PEACOCK</span>
                    </div>
                </div>
            </section>

            {/* Occasion-First Discovery Section */}
            <section className="occasions-section py-3xl">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="section-kicker">CURATED EVENING EDIT</span>
                        <h2>What are you dressing for?</h2>
                        <p>Discover outfits tailored for your event's vibe and dress code.</p>
                    </div>

                    <div className="occasions-grid mt-2xl">
                        {OCCASIONS.map((occ) => (
                            <OccasionCard
                                key={occ.title}
                                title={occ.title}
                                count={occ.count}
                                image={occ.image}
                                selected={selectedOccasionParam === occ.title}
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
                            <span className="section-kicker">EDITOR'S PICK</span>
                            <h2>Featured Evening Outfits</h2>
                        </div>
                        <Link to="/browse" className="view-all-link">
                            View All Outfits <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-4 mt-xl">
                        {featuredListings.map(item => (
                            <ClothingCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple 4-Step Homepage Lifecycle Section */}
            <section id="how-it-works" className="how-it-works-section py-3xl">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="section-kicker">SEAMLESS RENTAL LIFECYCLE</span>
                        <h2>How VogueLoop Works</h2>
                        <p>Rent luxury fashion in 4 simple steps with complete peace of mind.</p>
                    </div>

                    <div className="simple-lifecycle-grid mt-2xl">
                        <div className="lifecycle-step-card">
                            <div className="lifecycle-step-num">01</div>
                            <h3>Discover</h3>
                            <p>Browse designer dresses, select your size, and choose your rental dates.</p>
                        </div>

                        <div className="lifecycle-step-card">
                            <div className="lifecycle-step-num">02</div>
                            <h3>Rent</h3>
                            <p>Order safely with refundable security deposit protection and doorstep delivery.</p>
                        </div>

                        <div className="lifecycle-step-card">
                            <div className="lifecycle-step-num">03</div>
                            <h3>Wear</h3>
                            <p>Look incredible at your wedding, party, or celebration without retail price commitment.</p>
                        </div>

                        <div className="lifecycle-step-card">
                            <div className="lifecycle-step-num">04</div>
                            <h3>Return</h3>
                            <p>Pack the dress in the included return bag. Courier picks up. Cleaning is on us!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lender Callout CTA */}
            <section className="lender-cta-section py-2xl">
                <div className="container">
                    <div className="lender-cta-banner">
                        <div className="lender-cta-grid">
                            <div className="lender-cta-content">
                                <span className="badge badge-gold mb-md">OWNER MARKETPLACE</span>
                                <h2>Turn Your Closet Into Income</h2>
                                <p>
                                    Monetize your designer lehengas, sarees, and suits. List your closet archives on VogueLoop with 100% deposit protection and verified renters.
                                </p>
                                <div className="lender-cta-actions mt-xl">
                                    <Link to="/upload" className="btn btn-lg btn-burgundy">
                                        List Your Dress Now
                                    </Link>
                                </div>
                            </div>

                            <div className="lender-cta-visual">
                                <div className="lender-feature-list">
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>100% Damage Deposit Cover</strong>
                                            <span>Full protection against garment loss or stains</span>
                                        </div>
                                    </div>
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>Doorstep Pickup Included</strong>
                                            <span>Couriers collect and return garments directly</span>
                                        </div>
                                    </div>
                                    <div className="lender-feature-item">
                                        <CheckCircle2 size={20} className="gold-check" />
                                        <div>
                                            <strong>Earn Up To 85% Per Rental</strong>
                                            <span>Passive revenue on luxury clothes in your wardrobe</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Home;
