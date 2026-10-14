import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, MapPin, Ruler, Info, HelpCircle } from 'lucide-react';
import { useListings, CAMPUS_LOCALITIES, STUDENT_OCCASIONS } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import './UploadListing.css';

const UploadListing = () => {
    const navigate = useNavigate();
    const { addListing, wishlist } = useListings();
    const { user, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lehenga',
        occasion: 'Festive & Ethnic Day',
        rental3DayPrice: '',
        originalPurchasePrice: '',
        securityDeposit: '',
        condition: 'Like New',
        primarySize: 'M',
        sizes: ['M'],
        locality: 'University Hub',
        distanceKm: 0.8,
        handoverSpot: 'Main Campus Gate 1',
        purchaseYear: '2024',
        timesWorn: '1-2 times',
        bust: '36"',
        waist: '30"',
        length: '42"',
        shoulder: '15"',
        alterationAllowance: '1.5"',
        owner: user?.name ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1]?.[0] || 'K'}.` : 'Student Lender',
    });

    const [images, setImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Distance mapping for localities relative to Central Campus
    const localityDistances = {
        'University Hub': 0.8,
        'Near Campus': 0.3,
        'Tavarekere': 1.2,
        'Koramangala': 2.2,
        'Within 1 km': 0.9,
        'Within 2 km': 1.8,
        'All Localities': 1.0,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Update distance when locality changes
            if (name === 'locality') {
                updated.distanceKm = localityDistances[value] || 1.0;
            }

            // Auto-calculate suggested rental and deposit when original price changes
            if (name === 'originalPurchasePrice' && value && !prev.rental3DayPrice) {
                const origVal = parseFloat(value);
                if (!isNaN(origVal) && origVal > 0) {
                    const suggestedRental = Math.round((origVal * 0.12) / 50) * 50; // ~12% rounded to nearest 50
                    updated.rental3DayPrice = Math.max(499, Math.min(suggestedRental, 1299));
                    updated.securityDeposit = Math.round(updated.rental3DayPrice);
                }
            }

            return updated;
        });
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return {
                ...prev,
                sizes: newSizes.length > 0 ? newSizes : [size],
                primarySize: newSizes[0] || size,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (images.length < 3) {
            alert('Please upload at least 3 photos (Front view, Back view, and Fabric/Condition detail)');
            return;
        }

        if (formData.sizes.length === 0) {
            alert('Please select at least one available size');
            return;
        }

        const rental3Day = parseFloat(formData.rental3DayPrice) || 799;
        const origPrice = formData.originalPurchasePrice ? parseFloat(formData.originalPurchasePrice) : rental3Day * 8;
        const deposit = formData.securityDeposit ? parseFloat(formData.securityDeposit) : Math.round(rental3Day);

        const listing = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            occasion: formData.occasion,
            rental3DayPrice: rental3Day,
            pricePerDay: Math.round(rental3Day / 3),
            originalPurchasePrice: origPrice,
            securityDeposit: deposit,
            condition: formData.condition,
            sizes: formData.sizes,
            primarySize: formData.primarySize,
            purchaseYear: parseInt(formData.purchaseYear, 10) || 2024,
            timesWorn: formData.timesWorn,
            locality: formData.locality,
            distanceKm: formData.distanceKm,
            handoverSpot: formData.handoverSpot,
            measurements: {
                bust: formData.bust,
                waist: formData.waist,
                length: formData.length,
                shoulder: formData.shoulder,
                alterationAllowance: formData.alterationAllowance,
            },
            owner: formData.owner,
            isVerifiedOwner: true,
            available: true,
            images,
        };

        addListing(listing);
        setSubmitted(true);

        setTimeout(() => {
            navigate('/dashboard?tab=listings');
        }, 2200);
    };

    if (submitted) {
        return (
            <div className="upload-page">
                <div className="container py-3xl">
                    <div className="upload-success-card">
                        <CheckCircle2 size={64} className="sage-icon" />
                        <h2>Outfit Listed & Live on Campus!</h2>
                        <p>Your listing is now visible to verified students nearby with refundable security deposit protection.</p>
                        <span className="redirect-hint">Redirecting to your student closet dashboard...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
    const categories = ['Lehenga', 'Sherwani', 'Saree', 'Anarkali', 'Indo-Western', 'Kurta', 'Suit'];
    const conditions = ['Like New', 'Excellent Condition', 'Gently Worn', 'Pristine Condition'];
    const filteredLocalities = CAMPUS_LOCALITIES.filter(l => !l.startsWith('All') && !l.startsWith('Within'));

    // Dynamic suggested price range calculation
    const parsedOrig = parseFloat(formData.originalPurchasePrice);
    const hasOrig = !isNaN(parsedOrig) && parsedOrig > 0;
    const suggestedLow = hasOrig ? Math.max(499, Math.round((parsedOrig * 0.10) / 50) * 50) : 599;
    const suggestedHigh = hasOrig ? Math.max(699, Math.round((parsedOrig * 0.15) / 50) * 50) : 899;

    return (
        <div className="upload-page">
            <div className="container py-2xl">
                {/* Header */}
                <div className="upload-header-banner">
                    <div>
                        <span className="badge badge-gold mb-xs">STUDENT CLOSET MARKETPLACE</span>
                        <h1>List Your Outfit for Rent</h1>
                        <p className="text-secondary">
                            Turn ethnic & occasion wear sitting in your wardrobe into earnings. Peer-to-peer, verified student borrowers nearby, and refundable security deposits.
                        </p>
                    </div>
                </div>

                {/* Trust Notice */}
                <div className="lender-protection-banner mb-xl">
                    <ShieldCheck size={24} className="wine-gold-icon" />
                    <div className="banner-text">
                        <strong>Student Lender Protection</strong>
                        <p>All renters are verified students. Borrowers pay a refundable security deposit before meetup. Exchange safely at campus landmarks (e.g. Main Campus Gate 1).</p>
                    </div>
                </div>

                <div className="upload-wizard-container">
                    <form onSubmit={handleSubmit} className="upload-form-card">
                        {/* Section 1: Garment Details & Occasion */}
                        <div className="wizard-section">
                            <div className="section-title-bar">
                                <span className="section-step-num">1</span>
                                <div>
                                    <h3>Garment Details & Student Occasion</h3>
                                    <span className="section-sub">Describe what makes your outfit special</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Garment Title *</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Royal Blue Zari Silk Lehenga with Embroidered Dupatta"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">Description & Styling Notes *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="input"
                                    placeholder="Describe the fabric, embroidery, color shade, how it fits, and which campus occasions it suits best..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Garment Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="input"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="occasion" className="form-label">Best Suited Student Occasion *</label>
                                    <select
                                        id="occasion"
                                        name="occasion"
                                        className="input"
                                        value={formData.occasion}
                                        onChange={handleChange}
                                        required
                                    >
                                        {STUDENT_OCCASIONS.filter(o => o !== 'All Occasions').map(occ => (
                                            <option key={occ} value={occ}>{occ}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="purchaseYear" className="form-label">Year of Purchase</label>
                                    <select
                                        id="purchaseYear"
                                        name="purchaseYear"
                                        className="input"
                                        value={formData.purchaseYear}
                                        onChange={handleChange}
                                    >
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022 or earlier</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="timesWorn" className="form-label">How Many Times Worn?</label>
                                    <select
                                        id="timesWorn"
                                        name="timesWorn"
                                        className="input"
                                        value={formData.timesWorn}
                                        onChange={handleChange}
                                    >
                                        <option value="Brand New (Never Worn)">Brand New (Never Worn)</option>
                                        <option value="1-2 times">1-2 times</option>
                                        <option value="3-5 times">3-5 times</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Hyperlocal Campus Location */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">2</span>
                                <div>
                                    <h3>Hyperlocal Campus Location</h3>
                                    <span className="section-sub">Help nearby students find outfits within walking distance</span>
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="locality" className="form-label">Campus Locality / Zone *</label>
                                    <select
                                        id="locality"
                                        name="locality"
                                        className="input"
                                        value={formData.locality}
                                        onChange={handleChange}
                                        required
                                    >
                                        {filteredLocalities.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="handoverSpot" className="form-label">Preferred Safe Meetup Spot *</label>
                                    <input
                                        id="handoverSpot"
                                        name="handoverSpot"
                                        type="text"
                                        className="input"
                                        placeholder="e.g., Main Campus Gate 1 / Student Center"
                                        value={formData.handoverSpot}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <span className="form-helper-text">
                                <MapPin size={13} />
                                Safe handovers occur at public campus landmarks or your verified PG/hostel gate.
                            </span>
                        </div>

                        {/* Section 3: Sizing & Accurate Garment Measurements */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">3</span>
                                <div>
                                    <h3>Size & Garment Measurements</h3>
                                    <span className="section-sub">Real measurements eliminate fit issues between students</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Primary Tag Size *</label>
                                <div className="size-toggle-grid">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`size-toggle-btn ${formData.sizes.includes(size) ? 'active' : ''}`}
                                            onClick={() => handleSizeToggle(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="measurements-input-grid">
                                <div className="form-group">
                                    <label htmlFor="bust" className="form-label">Bust / Chest (in)</label>
                                    <input
                                        id="bust"
                                        name="bust"
                                        type="text"
                                        className="input"
                                        placeholder='e.g., 36"'
                                        value={formData.bust}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="waist" className="form-label">Waist (in)</label>
                                    <input
                                        id="waist"
                                        name="waist"
                                        type="text"
                                        className="input"
                                        placeholder='e.g., 30-32"'
                                        value={formData.waist}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="length" className="form-label">Length (in)</label>
                                    <input
                                        id="length"
                                        name="length"
                                        type="text"
                                        className="input"
                                        placeholder='e.g., 42"'
                                        value={formData.length}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="alterationAllowance" className="form-label">Margin / Margin (in)</label>
                                    <input
                                        id="alterationAllowance"
                                        name="alterationAllowance"
                                        type="text"
                                        className="input"
                                        placeholder='e.g., 1.5" inside'
                                        value={formData.alterationAllowance}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-md">
                                <label htmlFor="condition" className="form-label">Garment Condition Rating *</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    className="input"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                >
                                    {conditions.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section 4: Pricing, Original Value & Refundable Deposit */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">4</span>
                                <div>
                                    <h3>Pricing & Security Deposit</h3>
                                    <span className="section-sub">Realistic student pricing ensures frequent rentals</span>
                                </div>
                            </div>

                            <div className="form-row-3">
                                <div className="form-group">
                                    <label htmlFor="originalPurchasePrice" className="form-label">Original Purchase Price (₹)</label>
                                    <input
                                        id="originalPurchasePrice"
                                        name="originalPurchasePrice"
                                        type="number"
                                        className="input"
                                        placeholder="e.g., 6500"
                                        value={formData.originalPurchasePrice}
                                        onChange={handleChange}
                                        min="500"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="rental3DayPrice" className="form-label">3-Day Rental Bundle (₹) *</label>
                                    <input
                                        id="rental3DayPrice"
                                        name="rental3DayPrice"
                                        type="number"
                                        className="input"
                                        placeholder="e.g., 799"
                                        value={formData.rental3DayPrice}
                                        onChange={handleChange}
                                        required
                                        min="299"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="securityDeposit" className="form-label">Refundable Deposit (₹) *</label>
                                    <input
                                        id="securityDeposit"
                                        name="securityDeposit"
                                        type="number"
                                        className="input"
                                        placeholder="e.g., 800"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                        required
                                        min="200"
                                    />
                                </div>
                            </div>

                            {/* Suggested Pricing Callout */}
                            <div className="pricing-suggestion-box">
                                <Sparkles size={18} className="gold-icon" />
                                <div>
                                    <strong>💡 Suggested Student Pricing for Campus Market:</strong>
                                    <span>
                                        {hasOrig
                                            ? ` For an outfit bought at ₹${parsedOrig.toLocaleString('en-IN')}, a 3-day rental fee of ₹${suggestedLow} – ₹${suggestedHigh} with a ₹${suggestedLow} refundable deposit gets rented 3x faster.`
                                            : ` Typical student bundles rent for ₹599 – ₹899 for 3 days with an equal refundable deposit.`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Real Garment Photos */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">5</span>
                                <div>
                                    <h3>Real Garment Photos (Min 3 Photos) *</h3>
                                    <span className="section-sub">Real, unedited photos build immediate trust</span>
                                </div>
                            </div>

                            <div className="photo-checklist-guide mb-md">
                                <div className="checklist-item">
                                    <span className="chk-num">1</span>
                                    <span>Full Front View (worn or on hanger)</span>
                                </div>
                                <div className="checklist-item">
                                    <span className="chk-num">2</span>
                                    <span>Full Back View (closure / back design)</span>
                                </div>
                                <div className="checklist-item">
                                    <span className="chk-num">3</span>
                                    <span>Detail / Fabric Close-up (proof of condition)</span>
                                </div>
                            </div>

                            <ImageUpload images={images} onImagesChange={setImages} maxImages={5} minImages={3} />
                        </div>

                        {/* Submit Actions */}
                        <div className="form-action-bar mt-2xl">
                            <button
                                type="button"
                                className="btn btn-lg btn-secondary"
                                onClick={() => navigate('/browse')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-lg btn-primary submit-listing-btn">
                                <UploadIcon size={18} />
                                List Outfit on Campus Loop
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default UploadListing;
