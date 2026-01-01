/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Edit Book Modal Component v2.0
 * =============================================================================
 * 
 * Glassmorphic modal for editing book details.
 * Features smooth animations and form validation.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { FiEdit3, FiX, FiSave, FiLoader } from 'react-icons/fi';

// Import styles
import '../styles/EditBookModal.css';

/**
 * EditBookModal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Object} props.book - Book data to edit
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 */
const EditBookModal = ({ 
    isOpen, 
    book, 
    onSave, 
    onCancel, 
    isLoading 
}) => {
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        publishedYear: ''
    });

    // Populate form when book changes
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                isbn: book.isbn || '',
                publishedYear: book.publishedYear || ''
            });
        }
    }, [book]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Don't render if not open
    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay" onClick={onCancel}>
            <div 
                className="edit-modal-content glass-effect" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="edit-modal-header">
                    <div className="edit-modal-title">
                        <FiEdit3 className="edit-icon" />
                        <h2>Edit Book</h2>
                    </div>
                    <button 
                        className="edit-modal-close"
                        onClick={onCancel}
                        disabled={isLoading}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Edit Form */}
                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="edit-form-grid">
                        <div className="form-group">
                            <label htmlFor="edit-title">Title *</label>
                            <input
                                type="text"
                                id="edit-title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-author">Author *</label>
                            <input
                                type="text"
                                id="edit-author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-isbn">ISBN *</label>
                            <input
                                type="text"
                                id="edit-isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-year">Published Year</label>
                            <input
                                type="number"
                                id="edit-year"
                                name="publishedYear"
                                value={formData.publishedYear}
                                onChange={handleChange}
                                min="1000"
                                max={new Date().getFullYear()}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="edit-form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="spinner" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;
