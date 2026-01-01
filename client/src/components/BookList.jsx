/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Book List Component v2.0
 * =============================================================================
 * 
 * A functional component to display all books in a beautiful card format.
 * Features a modern 3D card design with glassmorphic elements.
 * Now with EDIT functionality and 120fps smooth animations.
 * 
 * Features:
 * - Responsive card grid layout
 * - 3D hover effects with 120fps smoothness
 * - Edit and Delete functionality
 * - Empty state handling
 * - Loading state handling
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

import React from 'react';
import { FaBook, FaUser, FaBarcode, FaCalendarAlt, FaTrashAlt, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/BookList.css';

/**
 * BookCard Component
 * Renders a single book card with 3D effects
 * 
 * @param {Object} props - Component props
 * @param {Object} props.book - Book data object
 * @param {Function} props.onDelete - Callback function to delete the book
 * @param {Function} props.onEdit - Callback function to edit the book
 * @param {boolean} props.isDeleting - Whether this book is being deleted
 * @param {number} props.index - Card index for color cycling
 * @returns {JSX.Element} The rendered BookCard component
 */
const BookCard = ({ book, onDelete, onEdit, isDeleting, index = 0 }) => {
  // Color palette for cycling
  const colors = [
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(168, 85, 247, 0.8)',   // Violet
    'rgba(14, 165, 233, 0.8)',   // Sky
    'rgba(245, 158, 11, 0.8)',   // Amber
  ];
  
  const cardColor = colors[index % colors.length];

  return (
    <article 
      className={`book-card ${isDeleting ? 'deleting' : ''}`}
      style={{ '--card-color': cardColor }}
    >
      {/* Card Content */}
      <div className="card-content">
        {/* Book Icon Header */}
        <div className="card-header">
          <div className="book-icon-wrapper" style={{ background: `linear-gradient(135deg, ${cardColor}, ${cardColor.replace('0.8', '0.6')})` }}>
            <FaBook className="book-icon" />
          </div>
        </div>

        {/* Book Title */}
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        {/* Book Details */}
        <div className="book-details">
          <div className="detail-item">
            <FaUser className="detail-icon" />
            <span className="detail-label">Author:</span>
            <span className="detail-value">{book.author}</span>
          </div>

          <div className="detail-item">
            <FaBarcode className="detail-icon" />
            <span className="detail-label">ISBN:</span>
            <span className="detail-value isbn">{book.isbn}</span>
          </div>

          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span className="detail-label">Year:</span>
            <span className="detail-value">{book.publishedYear || book.year || 'N/A'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          {/* Edit Button */}
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(book)}
            disabled={isDeleting}
            title="Edit this book"
            aria-label={`Edit ${book.title}`}
          >
            <FaEdit className="action-icon" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(book._id, book.title)}
            disabled={isDeleting}
            title="Delete this book"
            aria-label={`Delete ${book.title}`}
          >
            <FaTrashAlt className="action-icon" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

/**
 * EmptyState Component
 * Displayed when there are no books in the library
 * 
 * @returns {JSX.Element} The rendered EmptyState component
 */
const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FaBook />
      </div>
      <h3>No Books Found</h3>
      <p>Your library is empty. Start by adding your first book using the form above!</p>
    </div>
  );
};

/**
 * LoadingState Component
 * Displayed while books are being fetched
 * 
 * @returns {JSX.Element} The rendered LoadingState component
 */
const LoadingState = () => {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p>Loading your library...</p>
    </div>
  );
};

/**
 * ErrorState Component
 * Displayed when there's an error fetching books
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Callback to retry fetching
 * @returns {JSX.Element} The rendered ErrorState component
 */
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-icon">
        <FaExclamationTriangle />
      </div>
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

/**
 * BookList Component
 * Main component that renders the list of all books
 * 
 * @param {Object} props - Component props
 * @param {Array} props.books - Array of book objects
 * @param {Function} props.onDeleteBook - Callback function to delete a book
 * @param {Function} props.onEditBook - Callback function to edit a book
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onRetry - Callback to retry fetching
 * @param {string} props.deletingId - ID of book currently being deleted
 * @returns {JSX.Element} The rendered BookList component
 */
const BookList = ({ books, onDeleteBook, onEditBook, isLoading, error, onRetry, deletingId }) => {
  // =========================================================================
  // RENDER STATES
  // =========================================================================

  // Show loading state
  if (isLoading) {
    return (
      <section className="book-list-section">
        <LoadingState />
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="book-list-section">
        <ErrorState message={error} onRetry={onRetry} />
      </section>
    );
  }

  // Show empty state
  if (!books || books.length === 0) {
    return (
      <section className="book-list-section">
        <EmptyState />
      </section>
    );
  }

  // =========================================================================
  // RENDER BOOK LIST
  // =========================================================================

  return (
    <section className="book-list-section">
      {/* Section Header */}
      <div className="section-header">
        <h2>
          <FaBook className="section-icon" />
          Library Collection
        </h2>
        <span className="book-count">{books.length} {books.length === 1 ? 'Book' : 'Books'}</span>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {books.map((book, index) => (
          <BookCard
            key={book._id}
            book={book}
            index={index}
            onDelete={onDeleteBook}
            onEdit={onEditBook}
            isDeleting={deletingId === book._id}
          />
        ))}
      </div>
    </section>
  );
};

export default BookList;
