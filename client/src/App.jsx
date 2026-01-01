/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Main App Component v2.0
 * =============================================================================
 * 
 * Root component with authentication, theme toggle, and routing.
 * Features smooth 120fps animations throughout.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import components
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HistoryPage from './pages/HistoryPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Import styles
import './styles/App.css';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner-large">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Public Route Component
 * Redirects to home if already authenticated
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return null;
    }
    
    return isAuthenticated ? <Navigate to="/" /> : children;
};

/**
 * App Layout Component
 */
const AppLayout = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* Animated Background with floating elements */}
            <div className="animated-background">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-shape shape-5"></div>
            </div>

            {/* Main App Container */}
            <div className="app-container">
                {/* Main Content Area */}
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                        {/* Home - accessible to all */}
                        <Route path="/" element={<HomePage />} />

                        {/* Protected Routes */}
                        <Route path="/history" element={
                            <ProtectedRoute>
                                <HistoryPage />
                            </ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>

            {/* Toast Notification Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    background: 'rgba(30, 30, 50, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                }}
            />
        </>
    );
};

/**
 * App Component
 * Wraps everything in providers
 */
function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <AppLayout />
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
