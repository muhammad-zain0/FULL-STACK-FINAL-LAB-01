/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Signup Page
 * =============================================================================
 * 
 * Beautiful glassmorphic signup form with smooth animations.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSpinner, FaBook, FaMoon, FaSun } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Auth.css';

/**
 * SignupPage Component
 */
const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, error, clearError } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        // Validate
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        
        const result = await signup(formData.name, formData.email, formData.password);
        
        if (result.success) {
            toast.success('Account created successfully! 🎉');
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

            <div className="auth-container signup">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="logo-icon-large">
                        <FaBook />
                    </div>
                    <h1>Smart Library</h1>
                    <p>Create your account to get started</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name Input */}
                    <div className={`auth-input-group ${focusedField === 'name' ? 'focused' : ''}`}>
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            disabled={isLoading}
                            autoComplete="name"
                        />
                    </div>

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
                            placeholder="Password (min. 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className={`auth-input-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
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
                                Creating account...
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                Create Account
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
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
