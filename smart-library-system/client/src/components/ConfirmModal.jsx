/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Delete Confirmation Modal Component
 * =============================================================================
 * 
 * A glassmorphic modal dialog for confirming book deletion.
 * Features beautiful frosted glass effect with backdrop blur.
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

import { useEffect } from 'react';
import { FaExclamationTriangle, FaTimes, FaTrashAlt } from 'react-icons/fa';
import '../styles/ConfirmModal.css';

/**
 * ConfirmModal Component
 * Renders a glassmorphic confirmation dialog
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {boolean} props.isLoading - Loading state for confirm button
 * @returns {JSX.Element|null} The rendered modal or null if closed
 */
const ConfirmModal = ({ 
  isOpen, 
  title = 'Confirm Delete', 
  message, 
  onConfirm, 
  onCancel,
  isLoading = false 
}) => {
  // =========================================================================
  // KEYBOARD HANDLING
  // =========================================================================

  /**
   * Handle escape key to close modal
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel, isLoading]);

  // Don't render if not open
  if (!isOpen) return null;

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="modal-overlay" onClick={!isLoading ? onCancel : undefined}>
      {/* Glassmorphic Modal Card */}
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        {/* Warning Icon */}
        <div className="modal-icon">
          <FaExclamationTriangle />
        </div>

        {/* Modal Title */}
        <h2 id="modal-title" className="modal-title">{title}</h2>

        {/* Modal Message */}
        <p className="modal-message">{message}</p>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button 
            className="modal-btn cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="modal-btn confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Deleting...
              </>
            ) : (
              <>
                <FaTrashAlt />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
