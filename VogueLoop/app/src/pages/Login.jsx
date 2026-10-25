import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MobileBottomNav from '../components/MobileBottomNav';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const location = useLocation();
    const destination = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/browse';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
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

        // Get stored users
        const users = JSON.parse(localStorage.getItem('vogueloop_users') || '[]');

        // Find user with matching credentials
        const user = users.find(u =>
            u.email === formData.email && u.password === formData.password
        );

        if (user) {
            const { password, ...userWithoutPassword } = user;
            login(userWithoutPassword);
            navigate(destination);
        } else {
            // Auto login for demo
            login({ id: 1, name: formData.email.split('@')[0] || 'Valued Member', email: formData.email, role: 'customer' });
            navigate(destination);
        }
    };

    return (
        <div className="auth-page">
            <div className="container py-3xl">
                <div className="auth-card-wrapper">
                    <div className="auth-card">
                        <div className="auth-header text-center">
                            <span className="auth-logo-brand">VOGUE<span style={{ color: '#D4AF37' }}>LOOP</span></span>
                            <span className="auth-logo-tagline">Campus P2P Fashion Marketplace</span>
                            <h2>Welcome Back</h2>
                            <p>Sign in to manage your campus rentals, wishlist, and closet listings</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && (
                                <div className="auth-error-banner">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
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
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="input-icon-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="input with-icon"
                                        placeholder="Enter password"
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

                            <div className="form-options-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <Link to="#" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" className="btn btn-lg btn-primary auth-submit-btn">
                                <LogIn size={18} />
                                Sign In to Account
                            </button>
                        </form>

                        <div className="auth-footer text-center">
                            <p>Don't have an account? <Link to="/signup" className="auth-switch-link">Create Account</Link></p>
                        </div>
                    </div>
                </div>
            </div>
                        <MobileBottomNav wishlistCount={0} />
        </div>
    );
};

export default Login;

