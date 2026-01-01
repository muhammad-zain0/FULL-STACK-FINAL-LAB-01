/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Header Component v2.0
 * =============================================================================
 * 
 * Navigation header with theme toggle, user menu, and logout.
 * Features glassmorphic design with smooth animations.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaBook, 
    FaSun, 
    FaMoon, 
    FaHistory, 
    FaSignOutAlt, 
    FaUser,
    FaChevronDown,
    FaSignInAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';

/**
 * Header Component
 */
const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    /**
     * Close menu when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo and Brand */}
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <div className="logo-icon">
                            <FaBook />
                        </div>
                        <div className="logo-text">
                            <h1>Smart Library</h1>
                            <span className="tagline">Your Personal Collection</span>
                        </div>
                    </div>
                </Link>

                {/* Right Section */}
                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button 
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <div className="theme-toggle-track">
                            <FaSun className="sun-icon" />
                            <FaMoon className="moon-icon" />
                            <div className={`theme-toggle-thumb ${theme}`} />
                        </div>
                    </button>

                    {/* Conditional rendering based on authentication */}
                    {user ? (
                        <>
                            {/* History Link */}
                            <Link to="/history" className="nav-link history-link">
                                <FaHistory />
                                <span>History</span>
                            </Link>

                            {/* User Menu */}
                            <div className="user-menu" ref={menuRef}>
                        <button 
                            className="user-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="user-avatar">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="user-name">{user?.name || 'User'}</span>
                            <FaChevronDown className={`chevron ${isMenuOpen ? 'open' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`user-dropdown ${isMenuOpen ? 'open' : ''}`}>
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="dropdown-user-info">
                                    <span className="dropdown-name">{user?.name}</span>
                                    <span className="dropdown-email">{user?.email}</span>
                                </div>
                            </div>
                            
                            <div className="dropdown-divider" />
                            
                            <Link 
                                to="/history" 
                                className="dropdown-item"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaHistory />
                                <span>Activity History</span>
                            </Link>
                            
                            <div className="dropdown-divider" />
                            
                            <button 
                                className="dropdown-item logout"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                        </>
                    ) : (
                        /* Login Button for guests */
                        <Link to="/login" className="nav-link login-link">
                            <FaSignInAlt />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
