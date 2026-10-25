import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Upload as UploadIcon, CheckCircle2, AlertCircle, ShieldCheck, Sparkles,
    MapPin, Ruler, Info, HelpCircle, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft,
    Tag, DollarSign, Camera, Check, Lock
} from 'lucide-react';
import { useListings, CAMPUS_LOCALITIES, STUDENT_OCCASIONS } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import MobileBottomNav from '../components/MobileBottomNav';
import './UploadListing.css';

const STEPS = [
    { id: 1, title: 'Garment & Occasion', desc: 'Title, category & history', icon: Tag },
    { id: 2, title: 'Campus Location', desc: 'Locality & safe meetup spot', icon: MapPin },
    { id: 3, title: 'Sizing & Measurements', desc: 'Fit, measurements & condition', icon: Ruler },
    { id: 4, title: 'Pricing & Deposit', desc: '3-day rental & security escrow', icon: DollarSign },
    { id: 5, title: 'Garment Photos', desc: 'Real photos & review', icon: Camera },
];

const UploadListing = () => {
    const navigate = useNavigate();
    const { addListing, wishlist } = useListings();
    const { user, isAuthenticated } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [stepError, setStepError] = useState('');

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
            navigate('/login', { state: { from: '/upload' } });
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
        setStepError('');
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
                    const suggestedRental = Math.round((origVal * 0.12) / 50) * 50;
                    updated.rental3DayPrice = Math.max(499, Math.min(suggestedRental, 1299));
                    updated.securityDeposit = Math.round(updated.rental3DayPrice);
                }
            }

            return updated;
        });
    };

    const handleSizeToggle = (size) => {
        setStepError('');
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

    const validateStep = (step) => {
        setStepError('');
        if (step === 1) {
            if (!formData.title.trim()) {
                setStepError('Please enter a descriptive garment title.');
                return false;
            }
            if (!formData.description.trim()) {
                setStepError('Please enter description or styling details.');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.handoverSpot.trim()) {
                setStepError('Please enter your preferred safe campus meetup spot (e.g., Main Campus Gate 1).');
                return false;
            }
        }
        if (step === 3) {
            if (formData.sizes.length === 0) {
                setStepError('Please select at least one available tag size.');
                return false;
            }
        }
        if (step === 4) {
            const rental = parseFloat(formData.rental3DayPrice);
            if (isNaN(rental) || rental < 299) {
                setStepError('Please enter a valid 3-day rental fee (minimum ₹299).');
                return false;
            }
            const deposit = parseFloat(formData.securityDeposit);
            if (isNaN(deposit) || deposit < 200) {
                setStepError('Please enter a refundable security deposit (minimum ₹200).');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
            window.scrollTo({ top: 80, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setStepError('');
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 80, behavior: 'smooth' });
    };

    const handleStepClick = (stepId) => {
        if (stepId < currentStep) {
            setStepError('');
            setCurrentStep(stepId);
            window.scrollTo({ top: 80, behavior: 'smooth' });
        } else if (stepId === currentStep + 1 && validateStep(currentStep)) {
            setCurrentStep(stepId);
            window.scrollTo({ top: 80, behavior: 'smooth' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (images.length < 3) {
            setStepError('Please upload at least 3 photos (Front view, Back view, and Fabric/Condition detail) before publishing.');
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
            </div>
        );
    }

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
    const categories = ['Lehenga', 'Sherwani', 'Saree', 'Anarkali', 'Indo-Western', 'Kurta', 'Suit'];
    const conditions = ['Like New', 'Excellent Condition', 'Gently Worn', 'Pristine Condition'];
    const filteredLocalities = CAMPUS_LOCALITIES.filter(l => !l.startsWith('All') && !l.startsWith('Within'));

    const parsedOrig = parseFloat(formData.originalPurchasePrice);
    const hasOrig = !isNaN(parsedOrig) && parsedOrig > 0;
    const suggestedLow = hasOrig ? Math.max(499, Math.round((parsedOrig * 0.10) / 50) * 50) : 599;
    const suggestedHigh = hasOrig ? Math.max(699, Math.round((parsedOrig * 0.15) / 50) * 50) : 899;

    return (
        <div className="upload-page">
            <div className="container py-2xl">
                {/* Top Return Navigation */}
                <div className="app-back-navigation mb-md">
                    <button onClick={() => navigate('/dashboard')} className="back-nav-btn">
                        <ChevronLeft size={16} />
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* Header Banner */}
                <div className="upload-header-banner">
                    <div>
                        <span className="badge badge-gold mb-xs">STUDENT CLOSET MARKETPLACE</span>
                        <h1>List Your Outfit for Rent</h1>
                        <p className="text-secondary">
                            Turn occasion wear in your closet into passive earnings. Monitored meetups, verified student borrowers, and 100% escrow deposits.
                        </p>
                    </div>
                </div>

                {/* Stepper Two-Column Layout */}
                <div className="upload-stepper-layout">
                    {/* Left: Vertical Stepper Navigation Sidebar */}
                    <aside className="upload-stepper-sidebar">
                        <div className="stepper-nav-card">
                            <span className="stepper-title">Progress Overview</span>
                            <div className="vertical-stepper">
                                {STEPS.map((step) => {
                                    const isCompleted = currentStep > step.id;
                                    const isActive = currentStep === step.id;
                                    const StepIcon = step.icon;

                                    return (
                                        <div
                                            key={step.id}
                                            className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => handleStepClick(step.id)}
                                        >
                                            <div className="stepper-node">
                                                <div className="stepper-icon-circle">
                                                    {isCompleted ? (
                                                        <Check size={14} className="check-icon" />
                                                    ) : (
                                                        <span>{step.id}</span>
                                                    )}
                                                </div>
                                                {step.id < STEPS.length && <div className="stepper-connector-line" />}
                                            </div>

                                            <div className="stepper-text">
                                                <div className="stepper-label-row">
                                                    <span className="stepper-label">{step.title}</span>
                                                    {isActive && <span className="stepper-active-pill">Current</span>}
                                                    {isCompleted && <span className="stepper-done-pill">Saved</span>}
                                                </div>
                                                <span className="stepper-desc">{step.desc}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Trust Notice Box */}
                            <div className="stepper-trust-box mt-lg">
                                <div className="trust-box-header">
                                    <ShieldCheck size={16} className="gold-icon" />
                                    <span>Lender Protection Escrow</span>
                                </div>
                                <ul className="trust-box-list">
                                    <li>Verified student accounts only</li>
                                    <li>Refundable security deposit upfront</li>
                                    <li>Photo checklist verification on return</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Active Step Form Card */}
                    <main className="upload-stepper-content">
                        <form onSubmit={handleSubmit} className="stepper-active-card">
                            {/* Step Indicator Header */}
                            <div className="step-content-header">
                                <div className="step-kicker-row">
                                    <span className="step-counter-badge">Step {currentStep} of {STEPS.length}</span>
                                    <span className="step-kicker-title">{STEPS[currentStep - 1].title}</span>
                                </div>
                                <h2>{STEPS[currentStep - 1].desc}</h2>
                            </div>

                            {/* Error Banner if validation fails */}
                            {stepError && (
                                <div className="step-error-banner mt-sm">
                                    <AlertCircle size={16} className="error-icon" />
                                    <span>{stepError}</span>
                                </div>
                            )}

                            {/* STEP 1: Garment Details & Occasion */}
                            {currentStep === 1 && (
                                <div className="step-fields-container mt-lg">
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
                                            placeholder="Describe fabric, embroidery, color shade, how it fits, and recommended campus occasions..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows={4}
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
                                            <label htmlFor="timesWorn" className="form-label">Times Worn</label>
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
                            )}

                            {/* STEP 2: Campus Location & Safe Landmark Meetup */}
                            {currentStep === 2 && (
                                <div className="step-fields-container mt-lg">
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
                                        <span className="form-helper-text">
                                            Distance to Central Campus Hub: approx. {formData.distanceKm} km.
                                        </span>
                                    </div>

                                    <div className="form-group mt-md">
                                        <label htmlFor="handoverSpot" className="form-label">Preferred Safe Handover Spot *</label>
                                        <input
                                            id="handoverSpot"
                                            name="handoverSpot"
                                            type="text"
                                            className="input"
                                            placeholder="e.g., Main Campus Gate 1 / Student Center Plaza / University Library"
                                            value={formData.handoverSpot}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="form-helper-text">
                                            <MapPin size={13} />
                                            Always meet at public university landmarks or your verified campus hostel gate.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Size, Exact Fit & Condition */}
                            {currentStep === 3 && (
                                <div className="step-fields-container mt-lg">
                                    <div className="form-group">
                                        <label className="form-label">Tag Sizes Available *</label>
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
                                        <span className="form-helper-text">Click to select multiple sizes if adjustable or free size.</span>
                                    </div>

                                    <div className="measurements-card mt-lg">
                                        <div className="measurements-header">
                                            <Ruler size={16} className="gold-icon" />
                                            <span>Precise Measurements (Inches)</span>
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
                                                <label htmlFor="alterationAllowance" className="form-label">Margin / Alteration</label>
                                                <input
                                                    id="alterationAllowance"
                                                    name="alterationAllowance"
                                                    type="text"
                                                    className="input"
                                                    placeholder='e.g., 1.5" margin'
                                                    value={formData.alterationAllowance}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mt-lg">
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
                            )}

                            {/* STEP 4: Pricing & Security Deposit */}
                            {currentStep === 4 && (
                                <div className="step-fields-container mt-lg">
                                    <div className="form-row-3">
                                        <div className="form-group">
                                            <label htmlFor="originalPurchasePrice" className="form-label">Original Price (₹)</label>
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
                                    <div className="pricing-suggestion-box mt-md">
                                        <Sparkles size={18} className="gold-icon" />
                                        <div>
                                            <strong>Suggested Campus Pricing:</strong>
                                            <span>
                                                {hasOrig
                                                    ? ` For an outfit bought at ₹${parsedOrig.toLocaleString('en-IN')}, a 3-day rental fee of ₹${suggestedLow} – ₹${suggestedHigh} with a ₹${suggestedLow} refundable deposit rents 3x faster.`
                                                    : ` Typical campus outfits rent for ₹599 – ₹899 for 3 days with a comparable refundable deposit.`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: Real Garment Photos & Review */}
                            {currentStep === 5 && (
                                <div className="step-fields-container mt-lg">
                                    <div className="photo-checklist-guide mb-md">
                                        <div className="checklist-item">
                                            <span className="chk-num">1</span>
                                            <span>Full Front View</span>
                                        </div>
                                        <div className="checklist-item">
                                            <span className="chk-num">2</span>
                                            <span>Full Back View</span>
                                        </div>
                                        <div className="checklist-item">
                                            <span className="chk-num">3</span>
                                            <span>Fabric Detail Close-Up</span>
                                        </div>
                                    </div>

                                    <ImageUpload images={images} onImagesChange={setImages} maxImages={5} minImages={3} />

                                    {/* Summary Review Card */}
                                    <div className="listing-summary-preview mt-xl">
                                        <span className="summary-preview-title">Quick Review Before Listing</span>
                                        <div className="summary-preview-grid">
                                            <div className="summary-pill">
                                                <span className="pill-k">Title:</span>
                                                <span className="pill-v">{formData.title || 'Untitled'}</span>
                                            </div>
                                            <div className="summary-pill">
                                                <span className="pill-k">Category:</span>
                                                <span className="pill-v">{formData.category} ({formData.occasion})</span>
                                            </div>
                                            <div className="summary-pill">
                                                <span className="pill-k">Handover:</span>
                                                <span className="pill-v">📍 {formData.locality} • {formData.handoverSpot}</span>
                                            </div>
                                            <div className="summary-pill">
                                                <span className="pill-k">Pricing:</span>
                                                <span className="pill-v">₹{formData.rental3DayPrice || 799} / 3-day • Deposit: ₹{formData.securityDeposit || 800}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stepper Navigation Actions */}
                            <div className="stepper-action-bar mt-2xl">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        className="btn btn-secondary stepper-prev-btn"
                                        onClick={handlePrev}
                                    >
                                        <ArrowLeft size={16} />
                                        Previous Step
                                    </button>
                                ) : (
                                    <Link to="/dashboard" className="btn btn-secondary stepper-cancel-btn">
                                        Cancel
                                    </Link>
                                )}

                                {currentStep < 5 ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary stepper-next-btn"
                                        onClick={handleNext}
                                    >
                                        <span>Continue: {STEPS[currentStep].title}</span>
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-fashion stepper-submit-btn"
                                    >
                                        <UploadIcon size={18} />
                                        Publish Outfit on Campus Loop
                                    </button>
                                )}
                            </div>
                        </form>
                    </main>
                </div>
            </div>

            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default UploadListing;
