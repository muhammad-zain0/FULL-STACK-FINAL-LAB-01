/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Login Page
 * =============================================================================
 * 
 * Beautiful glassmorphic login form with smooth animations.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaBook, FaMoon, FaSun } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Auth.css';

/**
 * LoginPage Component
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { login, error, clearError } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) clearError();
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            toast.success('Welcome back! 🎉');
            navigate('/');
        } else {
            toast.error(result.message);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="auth-page">
            {/* Theme Toggle */}
            <button 
                className="auth-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>

            <div className="auth-container">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="logo-icon-large">
                        <FaBook />
                    </div>
                    <h1>Smart Library</h1>
                    <p>Welcome back! Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Email Input */}
                    <div className={`auth-input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className={`auth-input-group ${focusedField === 'password' ? 'focused' : ''}`}>
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="forgot-password-wrapper">
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="spinner" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FaSignInAlt />
                                Sign In
                            </>
                        )}
                    </button>

                    {/* Continue without login */}
                    <Link to="/" className="skip-login-btn">
                        Continue without login
                    </Link>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
