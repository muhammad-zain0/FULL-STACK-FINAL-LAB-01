/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Theme Context
 * =============================================================================
 * 
 * Provides theme state (dark/light) throughout the app.
 * Syncs with user preference and localStorage.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create Theme Context
const ThemeContext = createContext(null);

/**
 * Theme Provider Component
 */
export const ThemeProvider = ({ children }) => {
    const { user, updateTheme, isAuthenticated } = useAuth();
    
    // Initialize theme from user preference or localStorage
    const [theme, setTheme] = useState(() => {
        if (user?.theme) return user.theme;
        return localStorage.getItem('theme') || 'dark';
    });

    /**
     * Sync theme with user preference when authenticated
     */
    useEffect(() => {
        if (isAuthenticated && user?.theme) {
            setTheme(user.theme);
        }
    }, [isAuthenticated, user?.theme]);

    /**
     * Apply theme to document
     */
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * Toggle between dark and light theme
     */
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Save to server if authenticated
        if (isAuthenticated) {
            updateTheme(newTheme);
        }
    };

    /**
     * Set specific theme
     */
    const setSpecificTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
            setTheme(newTheme);
            if (isAuthenticated) {
                updateTheme(newTheme);
            }
        }
    };

    const value = {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme: setSpecificTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to use theme context
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
