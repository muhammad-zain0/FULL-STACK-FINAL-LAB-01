/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Forgot Password Page
 * =============================================================================
 * 
 * Password reset request page with email verification.
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import '../styles/Auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPasswordPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
            toast.success(response.data.message || 'Password reset link sent to your email!');
            setEmailSent(true);
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-icon">
                            <FaEnvelope />
                        </div>
                        <h1 className="auth-title">Forgot Password?</h1>
                        <p className="auth-subtitle">
                            {emailSent 
                                ? 'Check your email for reset instructions' 
                                : 'Enter your email to receive a password reset link'}
                        </p>
                    </div>

                    {!emailSent ? (
                        <>
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <div className="input-wrapper">
                                        <FaEnvelope className="input-icon" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="your.email@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="auth-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="auth-footer">
                                <Link to="/login" className="auth-link back-link">
                                    <FaArrowLeft />
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">✉️</div>
                            <p className="success-text">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="success-subtext">
                                Please check your inbox and follow the instructions to reset your password.
                            </p>
                            <div className="auth-footer">
                                <Link to="/login" className="auth-button" style={{ marginTop: '1.5rem' }}>
                                    Return to Login
                                </Link>
                                <button 
                                    onClick={() => {
                                        setEmailSent(false);
                                        setEmail('');
                                    }}
                                    className="auth-link"
                                    style={{ marginTop: '1rem', cursor: 'pointer', background: 'none', border: 'none' }}
                                >
                                    Didn't receive the email? Try again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
