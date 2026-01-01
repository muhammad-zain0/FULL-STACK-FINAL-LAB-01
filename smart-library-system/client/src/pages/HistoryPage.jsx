/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Activity History Page
 * =============================================================================
 * 
 * Displays user's activity log with timestamps.
 * Shows all add, edit, delete actions performed.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { FaHistory, FaPlus, FaEdit, FaTrash, FaClock, FaBook, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/HistoryPage.css';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Format date and time
 */
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    
    return {
        date: date.toLocaleDateString('en-US', dateOptions),
        time: date.toLocaleTimeString('en-US', timeOptions)
    };
};

/**
 * Get action icon based on type
 */
const getActionIcon = (action) => {
    switch (action) {
        case 'ADD':
            return <FaPlus className="action-icon add" />;
        case 'EDIT':
            return <FaEdit className="action-icon edit" />;
        case 'DELETE':
            return <FaTrash className="action-icon delete" />;
        default:
            return <FaBook className="action-icon" />;
    }
};

/**
 * Activity Item Component
 */
const ActivityItem = ({ log, index }) => {
    const { date, time } = formatDateTime(log.timestamp);
    
    return (
        <div 
            className="activity-item"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="activity-icon-wrapper">
                {getActionIcon(log.action)}
            </div>
            
            <div className="activity-content">
                <div className="activity-header">
                    <span className={`activity-action ${log.action.toLowerCase()}`}>
                        {log.action}
                    </span>
                    <span className="activity-book">{log.bookTitle}</span>
                </div>
                <p className="activity-description">{log.description}</p>
            </div>
            
            <div className="activity-time">
                <div className="time-badge">
                    <FaClock className="time-icon" />
                    <span className="time-text">{time}</span>
                </div>
                <span className="date-text">{date}</span>
            </div>
        </div>
    );
};

/**
 * HistoryPage Component
 */
const HistoryPage = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch activity logs
     */
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/logs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    setLogs(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch logs:', err);
                setError('Failed to load activity history');
                toast.error('Failed to load activity history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [token]);

    /**
     * Clear history
     */
    const handleClearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all activity history?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs([]);
            toast.success('Activity history cleared');
        } catch (err) {
            toast.error('Failed to clear history');
        }
    };

    return (
        <div className="history-page">
            {/* Page Header */}
            <div className="history-header">
                <Link to="/" className="back-btn">
                    <FaArrowLeft />
                    <span>Back to Library</span>
                </Link>
                
                <div className="header-content">
                    <div className="header-icon">
                        <FaHistory />
                    </div>
                    <div className="header-text">
                        <h1>Activity History</h1>
                        <p>Track all your library actions</p>
                    </div>
                </div>

                {logs.length > 0 && (
                    <button 
                        className="clear-btn"
                        onClick={handleClearHistory}
                    >
                        Clear History
                    </button>
                )}
            </div>

            {/* Activity List */}
            <div className="history-content">
                {isLoading ? (
                    <div className="history-loading">
                        <div className="loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                        </div>
                        <p>Loading activity history...</p>
                    </div>
                ) : error ? (
                    <div className="history-error">
                        <p>{error}</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="history-empty">
                        <div className="empty-icon">
                            <FaHistory />
                        </div>
                        <h3>No Activity Yet</h3>
                        <p>Your activity history will appear here once you start managing books.</p>
                        <Link to="/" className="start-btn">
                            Go to Library
                        </Link>
                    </div>
                ) : (
                    <div className="activity-list">
                        {logs.map((log, index) => (
                            <ActivityItem 
                                key={log._id} 
                                log={log} 
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
