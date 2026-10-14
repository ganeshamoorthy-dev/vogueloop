import { ShieldCheck, Lock, RefreshCw, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { useListings } from '../context/ListingsContext';
import './Policies.css';

const Policies = () => {
    const { wishlist } = useListings();

    return (
        <div className="policies-page">
            <div className="container py-2xl">
                <div className="policies-header text-center">
                    <span className="badge badge-gold mb-sm">PILOT PROTOTYPE GOVERNANCE</span>
                    <h1>Trust, Safety & Marketplace Policies</h1>
                    <p className="policies-sub">
                        The Vogue Loop is a zero-inventory, hyperlocal peer-to-peer fashion rental marketplace for verified university students. These policies protect both lenders and renters.
                    </p>
                </div>

                <div className="policies-grid mt-2xl">
                    {/* Policy Card 1 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <ShieldCheck size={28} className="wine-icon" />
                        </div>
                        <h3>1. Zero-Inventory Marketplace Model</h3>
                        <p>
                            Vogue Loop does not curate, own, store, or warehouse fashion inventory. Every garment listed on the platform is privately owned by a verified student in the local campus community. Vogue Loop acts strictly as the discovery, trust-verification, and deposit-escrow facilitator.
                        </p>
                    </div>

                    {/* Policy Card 2 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <Lock size={28} className="gold-icon" />
                        </div>
                        <h3>2. Refundable Security Deposit Policy</h3>
                        <p>
                            To protect lenders against loss or severe damage, every rental includes a refundable security deposit (suggested at ₹600–₹1,000, aligning with the garment's 3-day rental fee). The deposit is held securely during the rental period and is refunded immediately once the lender confirms the return inspection at the campus handover spot.
                        </p>
                    </div>

                    {/* Policy Card 3 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <MapPin size={28} className="sage-icon" />
                        </div>
                        <h3>3. Hyperlocal Campus Handover Protocol</h3>
                        <p>
                            All garment handovers and returns occur at agreed safe public campus spots (such as Main Campus Gate 1, University Library Plaza, or verified hostel/PG gates). No third-party courier shipping is involved during the pilot, eliminating transit delays and delivery fees.
                        </p>
                    </div>

                    {/* Policy Card 4 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <RefreshCw size={28} className="wine-icon" />
                        </div>
                        <h3>4. Joint Condition Checklist & Garment Care</h3>
                        <p>
                            At the moment of campus handover, both student lender and renter perform a quick 60-second condition check (fabric condition, closures/zippers, and hems). Renters agree to wear garments with care and must not alter or machine-wash garments without explicit lender approval.
                        </p>
                    </div>

                    {/* Policy Card 5 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <CheckCircle2 size={28} className="sage-icon" />
                        </div>
                        <h3>5. Student Identity Verification</h3>
                        <p>
                            Participation is restricted to enrolled university students verified via institutional email IDs (.edu or campus domain) or physical student identity verification during campus handovers.
                        </p>
                    </div>

                    {/* Policy Card 6 */}
                    <div className="policy-section-card">
                        <div className="policy-icon-wrapper">
                            <AlertCircle size={28} className="gold-icon" />
                        </div>
                        <h3>6. Dispute Resolution & Fair Protection</h3>
                        <p>
                            In the rare event of unrepairable stains, tears, or late returns, the lender may submit a condition report within 24 hours of the return meetup. Vogue Loop reviews photo documentation from the initial listing and handover checklist to fairly deduct repair costs from the security deposit.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
            <MobileBottomNav wishlistCount={wishlist.length} />
        </div>
    );
};

export default Policies;
