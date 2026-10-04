import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import './UploadListing.css';

const UploadListing = () => {
    const navigate = useNavigate();
    const { addListing, wishlist } = useListings();
    const { user, isAuthenticated, isLender } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lehenga',
        occasion: 'Wedding',
        pricePerDay: '',
        retailValue: '',
        securityDeposit: '',
        condition: 'Pristine Condition',
        sizes: [],
        owner: user?.name || 'Verified Lender',
    });

    const [images, setImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (images.length < 3) {
            alert('Please upload at least 3 high-resolution photos of your garment');
            return;
        }

        if (formData.sizes.length === 0) {
            alert('Please select at least one available size');
            return;
        }

        const price = parseFloat(formData.pricePerDay);

        const listing = {
            ...formData,
            pricePerDay: price,
            retailValue: formData.retailValue ? parseFloat(formData.retailValue) : price * 15,
            securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : price,
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
                        <h2>Listing Created & Verified!</h2>
                        <p>Your outfit is now live on the VogueLoop marketplace with lender deposit protection.</p>
                        <span className="redirect-hint">Redirecting to your owner dashboard...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
    const categories = ['Lehenga', 'Sherwani', 'Saree', 'Anarkali', 'Indo-Western', 'Kurta'];
    const occasions = ['Wedding', 'Reception', 'Party', 'Cocktail', 'Birthday', 'Formal', 'Date Night'];
    const conditions = ['Pristine Condition', 'Like New', 'Excellent'];

    return (
        <div className="upload-page">
            <div className="container py-2xl">
                {/* Header */}
                <div className="upload-header-banner">
                    <div>
                        <span className="badge badge-gold mb-xs">LENDER MARKETPLACE</span>
                        <h1>List Your Garment for Rent</h1>
                        <p className="text-secondary">Earn steady income from your closet with 100% deposit protection and verified renters.</p>
                    </div>
                </div>

                <div className="upload-wizard-container mt-xl">
                    <form onSubmit={handleSubmit} className="upload-form-card">
                        {/* Section 1: Basic Information */}
                        <div className="wizard-section">
                            <div className="section-title-bar">
                                <span className="section-step-num">1</span>
                                <h3>Garment Details</h3>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title" className="form-label">Garment Title *</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Royal Blue Zari Embroidered Lehenga"
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
                                    placeholder="Describe the fabric, embroidery, occasion suitability, and fit details..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Category *</label>
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
                                    <label htmlFor="occasion" className="form-label">Primary Occasion *</label>
                                    <select
                                        id="occasion"
                                        name="occasion"
                                        className="input"
                                        value={formData.occasion}
                                        onChange={handleChange}
                                        required
                                    >
                                        {occasions.map(occ => (
                                            <option key={occ} value={occ}>{occ}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Pricing & Deposits */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">2</span>
                                <h3>Rental Pricing & Deposit</h3>
                            </div>

                            <div className="form-row-3">
                                <div className="form-group">
                                    <label htmlFor="pricePerDay" className="form-label">Rental Price / Day (₹) *</label>
                                    <input
                                        id="pricePerDay"
                                        name="pricePerDay"
                                        type="number"
                                        className="input"
                                        placeholder="1500"
                                        value={formData.pricePerDay}
                                        onChange={handleChange}
                                        required
                                        min="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="retailValue" className="form-label">Estimated Retail Value (₹)</label>
                                    <input
                                        id="retailValue"
                                        name="retailValue"
                                        type="number"
                                        className="input"
                                        placeholder="24000"
                                        value={formData.retailValue}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="securityDeposit" className="form-label">Refundable Security Deposit (₹)</label>
                                    <input
                                        id="securityDeposit"
                                        name="securityDeposit"
                                        type="number"
                                        className="input"
                                        placeholder="1500"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Sizing & Condition */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">3</span>
                                <h3>Size & Condition</h3>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Available Sizes *</label>
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

                            <div className="form-group">
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

                        {/* Section 4: Photography */}
                        <div className="wizard-section mt-xl">
                            <div className="section-title-bar">
                                <span className="section-step-num">4</span>
                                <h3>Photography (Min 3 Photos) *</h3>
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
                                Publish Garment Listing
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
