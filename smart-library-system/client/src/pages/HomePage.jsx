/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Home Page Component v2.0
 * =============================================================================
 * 
 * Main library page with user-specific data.
 * Features smooth animations and dynamic updates.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignOutAlt, FaUser, FaMoon, FaSun, FaHistory, FaChevronDown, FaChevronUp, FaPlus, FaEdit, FaTrash, FaClock, FaBook } from 'react-icons/fa';
import axios from 'axios';

// Import contexts
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Import components
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import ConfirmModal from '../components/ConfirmModal';
import EditBookModal from '../components/EditBookModal';

// Import styles
import '../styles/HomePage.css';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * HomePage Component
 */
const HomePage = () => {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const menuRef = useRef(null);
    
    // State management
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);
    
    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        bookId: null,
        bookTitle: '',
        isDeleting: false
    });

    // Edit modal state
    const [editModal, setEditModal] = useState({
        isOpen: false,
        book: null,
        isEditing: false
    });

    /**
     * Configure axios headers
     */
    const getAuthHeaders = useCallback(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    /**
     * Fetch user's books
     */
    const fetchBooks = useCallback(async () => {
        // If not authenticated, don't fetch
        if (!user || !token) {
            setBooks([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(
                `${API_BASE_URL}/books`,
                getAuthHeaders()
            );

            if (response.data.success) {
                setBooks(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to load books. Please try again.');
            toast.error('Failed to load books');
        } finally {
            setIsLoading(false);
        }
    }, [user, token, getAuthHeaders]);

    /**
     * Fetch books on mount
     */
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    /**
     * Close profile menu when clicking outside
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Add new book
     */
    const handleAddBook = async (bookData) => {
        // Guest mode - add to local state only (not saved to database)
        if (!user || !token) {
            const guestBook = {
                _id: `guest-${Date.now()}`,
                ...bookData,
                createdAt: new Date().toISOString(),
                isGuestBook: true
            };
            setBooks(prev => [guestBook, ...prev]);
            toast.success(`"${bookData.title}" added to your session (not saved - login to save permanently)`);
            return true;
        }

        // Authenticated mode - save to database
        try {
            setIsAdding(true);

            const response = await axios.post(
                `${API_BASE_URL}/books`,
                bookData,
                getAuthHeaders()
            );

            if (response.data.success) {
                setBooks(prev => [response.data.data, ...prev]);
                toast.success(`"${bookData.title}" added to your library!`);
                return true;
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to add book';
            toast.error(message);
            return false;
        } finally {
            setIsAdding(false);
        }
    };

    /**
     * Open delete confirmation
     */
    const handleDeleteClick = (bookId, bookTitle) => {
        setDeleteModal({
            isOpen: true,
            bookId,
            bookTitle,
            isDeleting: false
        });
    };

    /**
     * Confirm delete
     */
    const handleConfirmDelete = async () => {
        try {
            setDeleteModal(prev => ({ ...prev, isDeleting: true }));

            // Guest mode - just remove from local state
            const bookToDelete = books.find(b => b._id === deleteModal.bookId);
            if (bookToDelete?.isGuestBook) {
                setBooks(prev => prev.filter(book => book._id !== deleteModal.bookId));
                toast.success(`"${deleteModal.bookTitle}" removed from session`);
                setDeleteModal({ isOpen: false, bookId: null, bookTitle: '', isDeleting: false });
                return;
            }

            // Authenticated mode - delete from database
            const response = await axios.delete(
                `${API_BASE_URL}/books/${deleteModal.bookId}`,
                getAuthHeaders()
            );

            if (response.data.success) {
                setBooks(prev => prev.filter(book => book._id !== deleteModal.bookId));
                toast.success(`"${deleteModal.bookTitle}" removed from library`);
            }
        } catch (err) {
            toast.error('Failed to delete book');
        } finally {
            setDeleteModal({
                isOpen: false,
                bookId: null,
                bookTitle: '',
                isDeleting: false
            });
        }
    };

    /**
     * Cancel delete
     */
    const handleCancelDelete = () => {
        if (!deleteModal.isDeleting) {
            setDeleteModal({
                isOpen: false,
                bookId: null,
                bookTitle: '',
                isDeleting: false
            });
        }
    };

    /**
     * Open edit modal
     */
    const handleEditClick = (book) => {
        setEditModal({
            isOpen: true,
            book,
            isEditing: false
        });
    };

    /**
     * Save edited book
     */
    const handleSaveEdit = async (updatedData) => {
        try {
            setEditModal(prev => ({ ...prev, isEditing: true }));

            // Guest mode - update local state only
            if (editModal.book?.isGuestBook) {
                setBooks(prev => prev.map(book => 
                    book._id === editModal.book._id ? { ...book, ...updatedData } : book
                ));
                toast.success('Book updated in session');
                setEditModal({ isOpen: false, book: null, isEditing: false });
                return;
            }

            // Authenticated mode - update in database
            const response = await axios.put(
                `${API_BASE_URL}/books/${editModal.book._id}`,
                updatedData,
                getAuthHeaders()
            );

            if (response.data.success) {
                setBooks(prev => prev.map(book => 
                    book._id === editModal.book._id ? response.data.data : book
                ));
                toast.success('Book updated successfully');
                setEditModal({ isOpen: false, book: null, isEditing: false });
            }
        } catch (err) {
            toast.error('Failed to update book');
            setEditModal(prev => ({ ...prev, isEditing: false }));
        }
    };

    /**
     * Cancel edit
     */
    const handleCancelEdit = () => {
        if (!editModal.isEditing) {
            setEditModal({ isOpen: false, book: null, isEditing: false });
        }
    };

    /**
     * Handle logout
     */
    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    /**
     * Fetch activity history
     */
    const fetchHistory = useCallback(async () => {
        if (!user || !token || historyLogs.length > 0) return;
        
        setHistoryLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/logs`,
                getAuthHeaders()
            );
            if (response.data.success) {
                setHistoryLogs(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setHistoryLoading(false);
        }
    }, [user, token, historyLogs.length, getAuthHeaders]);

    /**
     * Toggle history expansion
     */
    const handleHistoryToggle = () => {
        if (!isHistoryExpanded) {
            fetchHistory();
        }
        setIsHistoryExpanded(!isHistoryExpanded);
        setIsProfileMenuOpen(false);
    };

    /**
     * Format date and time
     */
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        return {
            date: date.toLocaleDateString('en-US', dateOptions),
            time: date.toLocaleTimeString('en-US', timeOptions)
        };
    };

    /**
     * Get action icon
     */
    const getActionIcon = (action) => {
        switch (action) {
            case 'ADD': return <FaPlus className="action-icon add" />;
            case 'EDIT': return <FaEdit className="action-icon edit" />;
            case 'DELETE': return <FaTrash className="action-icon delete" />;
            default: return <FaBook className="action-icon" />;
        }
    };

    return (
        <div className="home-page">
            {/* Profile Icon and Theme Toggle in Corner */}
            <div className="top-corner-actions">
                {/* Theme Toggle */}
                <button 
                    className="corner-theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>

                {/* Profile Menu */}
                <div className="profile-menu-container" ref={menuRef}>
                    <button 
                        className="profile-icon-btn"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        <FaUser />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="profile-dropdown">
                            {user ? (
                                <>
                                    <div className="profile-dropdown-header">
                                        <span className="profile-name">{user.name}</span>
                                        <span className="profile-email">{user.email}</span>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item"
                                        onClick={handleHistoryToggle}
                                    >
                                        <FaHistory />
                                        Activity History
                                        {isHistoryExpanded ? <FaChevronUp className="expand-icon" /> : <FaChevronDown className="expand-icon" />}
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item logout-item"
                                        onClick={() => {
                                            handleLogout();
                                            setIsProfileMenuOpen(false);
                                        }}
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="guest-note-dropdown">
                                        <span>📚 Browsing as Guest</span>
                                        <small>Login to save books permanently</small>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link 
                                        to="/login" 
                                        className="dropdown-item"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="dropdown-item signup-item"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expandable History Section */}
            {user && isHistoryExpanded && (
                <div className="history-panel">
                    <div className="history-panel-content">
                        <div className="history-panel-header">
                            <h3>
                                <FaHistory />
                                Activity History
                            </h3>
                            <button 
                                className="close-history-btn"
                                onClick={() => setIsHistoryExpanded(false)}
                            >
                                <FaChevronUp />
                            </button>
                        </div>
                        <div className="history-list">
                            {historyLoading ? (
                                <div className="history-loading">
                                    <div className="spinner-ring"></div>
                                    <p>Loading history...</p>
                                </div>
                            ) : historyLogs.length === 0 ? (
                                <div className="history-empty">
                                    <FaHistory className="empty-icon" />
                                    <p>No activity yet</p>
                                    <small>Your book actions will appear here</small>
                                </div>
                            ) : (
                                historyLogs.map((log, index) => {
                                    const { date, time } = formatDateTime(log.timestamp);
                                    return (
                                        <div key={log._id || index} className="history-item">
                                            <div className="history-icon-wrapper">
                                                {getActionIcon(log.action)}
                                            </div>
                                            <div className="history-content">
                                                <div className="history-header">
                                                    <span className={`history-action ${log.action.toLowerCase()}`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="history-book">{log.bookTitle}</span>
                                                </div>
                                                <p className="history-description">{log.description}</p>
                                            </div>
                                            <div className="history-time">
                                                <div className="time-badge">
                                                    <FaClock className="time-icon" />
                                                    <span className="time-text">{time}</span>
                                                </div>
                                                <span className="date-text">{date}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1 className="page-title">
                            <span className="title-emoji">📚</span>
                            {user ? `Welcome, ${user.name.split(' ')[0]}!` : 'Smart Library'}
                        </h1>
                        <p className="page-subtitle">
                            {user ? 'Manage your personal book collection' : 'Browse as guest or login to save your collection'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid - Always visible */}
            <div className="content-grid">
                {/* Book Entry Form */}
                <aside className="form-section">
                    <BookForm 
                        onAddBook={handleAddBook} 
                        isLoading={isAdding} 
                    />
                </aside>

                {/* Book List */}
                <section className="list-section">
                    <BookList
                        books={books}
                        onDeleteBook={handleDeleteClick}
                        onEditBook={handleEditClick}
                        isLoading={isLoading}
                        error={error}
                        onRetry={fetchBooks}
                        deletingId={deleteModal.isDeleting ? deleteModal.bookId : null}
                    />
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Book"
                message={`Are you sure you want to remove "${deleteModal.bookTitle}" from your library?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={deleteModal.isDeleting}
            />

            {/* Edit Book Modal */}
            <EditBookModal
                isOpen={editModal.isOpen}
                book={editModal.book}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                isLoading={editModal.isEditing}
            />
        </div>
    );
};

export default HomePage;
