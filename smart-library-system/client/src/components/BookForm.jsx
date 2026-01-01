/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Book Form Component
 * =============================================================================
 * 
 * A functional component for the book entry form with input fields:
 * - Book Title
 * - Author Name
 * - ISBN Number
 * - Publication Year
 * 
 * Features:
 * - Controlled form inputs with state management
 * - Form validation
 * - Beautiful glassmorphic styling
 * - Props passing for reusability
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

import { useState, useRef } from 'react';
import { FaBook, FaUser, FaBarcode, FaCalendarAlt, FaPlusCircle, FaSpinner } from 'react-icons/fa';
import '../styles/BookForm.css';

/**
 * BookForm Component
 * Renders a form for adding new books to the library
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onAddBook - Callback function when a book is submitted
 * @param {boolean} props.isLoading - Loading state for form submission
 * @returns {JSX.Element} The rendered BookForm component
 */
const BookForm = ({ onAddBook, isLoading = false }) => {
  const formRef = useRef(null);

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  
  /**
   * Form data state using useState hook
   * Manages all input field values
   */
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: ''
  });

  /**
   * Form errors state for validation feedback
   */
  const [errors, setErrors] = useState({});

  /**
   * Focus state for input animation
   */
  const [focusedField, setFocusedField] = useState(null);

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  /**
   * Handle input change
   * Updates the corresponding field in formData state
   * 
   * @param {Object} e - Event object from input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data state
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data before submission
   * 
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    }

    // Validate author
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }

    // Validate ISBN
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN number is required';
    } else if (formData.isbn.trim().length < 10) {
      newErrors.isbn = 'ISBN must be at least 10 characters';
    }

    // Validate year
    if (!formData.year) {
      newErrors.year = 'Publication year is required';
    } else {
      const yearNum = parseInt(formData.year, 10);
      if (isNaN(yearNum) || yearNum < 1000 || yearNum > currentYear + 1) {
        newErrors.year = `Year must be between 1000 and ${currentYear + 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Validates data and calls the onAddBook callback
   * 
   * @param {Object} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Call parent callback with form data
    const success = await onAddBook({
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      year: parseInt(formData.year, 10)
    });

    // Reset form if submission was successful
    if (success) {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        year: ''
      });
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  const handleMouseMove = (e) => {
    if (!formRef.current) return;
    const form = formRef.current;
    const rect = form.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    form.style.setProperty('--mouse-x', `${x}%`);
    form.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div 
      className="book-form-container" 
      ref={formRef}
      onMouseMove={handleMouseMove}
    >
      <div className="form-glow"></div>
      {/* Form Header */}
      <div className="form-header">
        <div className="form-icon">
          <FaPlusCircle />
        </div>
        <h2>Add New Book</h2>
        <p>Fill in the details to add a book to the library</p>
      </div>

      {/* Book Entry Form */}
      <form onSubmit={handleSubmit} className="book-form" noValidate>
        {/* Book Title Input */}
        <div className={`form-group ${focusedField === 'title' ? 'focused' : ''} ${errors.title ? 'error' : ''}`}>
          <label htmlFor="title">
            <FaBook className="input-icon" />
            <span>Book Title</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter the book title..."
            className={errors.title ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Author Name Input */}
        <div className={`form-group ${focusedField === 'author' ? 'focused' : ''} ${errors.author ? 'error' : ''}`}>
          <label htmlFor="author">
            <FaUser className="input-icon" />
            <span>Author Name</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            onFocus={() => setFocusedField('author')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter the author's name..."
            className={errors.author ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>

        {/* ISBN Number Input */}
        <div className={`form-group ${focusedField === 'isbn' ? 'focused' : ''} ${errors.isbn ? 'error' : ''}`}>
          <label htmlFor="isbn">
            <FaBarcode className="input-icon" />
            <span>ISBN Number</span>
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            onFocus={() => setFocusedField('isbn')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter ISBN (e.g., 978-3-16-148410-0)..."
            className={errors.isbn ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.isbn && <span className="error-message">{errors.isbn}</span>}
        </div>

        {/* Publication Year Input */}
        <div className={`form-group ${focusedField === 'year' ? 'focused' : ''} ${errors.year ? 'error' : ''}`}>
          <label htmlFor="year">
            <FaCalendarAlt className="input-icon" />
            <span>Publication Year</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            onFocus={() => setFocusedField('year')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter publication year (e.g., 2024)..."
            min="1000"
            max={new Date().getFullYear() + 1}
            className={errors.year ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.year && <span className="error-message">{errors.year}</span>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              <span>Adding Book...</span>
            </>
          ) : (
            <>
              <FaPlusCircle />
              <span>Add Book to Library</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
