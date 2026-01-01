/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Auth Context
 * =============================================================================
 * 
 * Provides authentication state and methods throughout the app.
 * Handles login, signup, logout, and token management.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app and provides auth state
 */
export const AuthProvider = ({ children }) => {
    // User state
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Configure axios with auth token
     */
    const configureAxios = useCallback((authToken) => {
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);

    /**
     * Load user from token on mount
     */
    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem('token');
            
            if (savedToken) {
                configureAxios(savedToken);
                try {
                    const response = await axios.get(`${API_URL}/auth/me`);
                    if (response.data.success) {
                        setUser(response.data.user);
                        setToken(savedToken);
                    }
                } catch (err) {
                    // Token invalid or expired
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    configureAxios(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, [configureAxios]);

    /**
     * Register new user
     */
    const signup = async (name, email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password
            });

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                configureAxios(newToken);
                
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    /**
     * Login user
     */
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token: newToken, user: userData } = response.data;
                
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                configureAxios(newToken);
                
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        configureAxios(null);
    };

    /**
     * Update user theme preference
     */
    const updateTheme = async (theme) => {
        if (!token) return;
        
        try {
            await axios.put(`${API_URL}/auth/theme`, { theme });
            setUser(prev => ({ ...prev, theme }));
        } catch (err) {
            console.error('Failed to update theme:', err);
        }
    };

    /**
     * Clear error
     */
    const clearError = () => setError(null);

    // Context value
    const value = {
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        updateTheme,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
