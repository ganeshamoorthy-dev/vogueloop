import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import './Login.css';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer', // 'lender' or 'customer'
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            createdAt: new Date().toISOString(),
        };

        const users = JSON.parse(localStorage.getItem('vogueloop_users') || '[]');
        users.push({ ...newUser, password: formData.password });
        localStorage.setItem('vogueloop_users', JSON.stringify(users));

        signup(newUser);
        navigate('/browse');
    };

    return (
        <div className="auth-page">
            <div className="container py-3xl">
                <div className="auth-card-wrapper">
                    <div className="auth-card">
                        <div className="auth-header text-center">
                            <span className="auth-logo-brand">VOGUE<span style={{ color: '#D4AF37' }}>LOOP</span></span>
                            <span className="auth-logo-tagline">Campus P2P Fashion Marketplace</span>
                            <h2>Create Your Student Account</h2>
                            <p>Join the verified campus peer-to-peer fashion rental loop</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && (
                                <div className="auth-error-banner">
                                    {error}
                                </div>
                            )}

                            {/* Role Selection */}
                            <div className="role-selection-box mb-lg">
                                <label className="form-label">I want to join as *</label>
                                <div className="role-options-grid">
                                    <button
                                        type="button"
                                        className={`role-select-card ${formData.role === 'customer' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
                                    >
                                        <span className="role-icon">👔</span>
                                        <div className="role-text">
                                            <strong>Student Renter</strong>
                                            <span>Rent outfits for fests & events</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className={`role-select-card ${formData.role === 'lender' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'lender' }))}
                                    >
                                        <span className="role-icon">💼</span>
                                        <div className="role-text">
                                            <strong>Wardrobe Host</strong>
                                            <span>List outfits you own & earn</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name *</label>
                                <div className="input-icon-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="input with-icon"
                                        placeholder="Ananya Sharma"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address *</label>
                                <div className="input-icon-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="input with-icon"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password *</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="input with-icon"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="input with-icon"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <label className="checkbox-label mb-lg">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                />
                                <span>I agree to the <Link to="/policies" target="_blank" className="underline text-gold">VogueLoop Student Terms & Policies</Link></span>
                            </label>

                            <button type="submit" className="btn btn-lg btn-primary auth-submit-btn">
                                <UserPlus size={18} />
                                Create Account
                            </button>
                        </form>

                        <div className="auth-footer text-center">
                            <p>Already have an account? <Link to="/login" className="auth-switch-link">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <MobileBottomNav wishlistCount={0} />
        </div>
    );
};

export default Signup;
