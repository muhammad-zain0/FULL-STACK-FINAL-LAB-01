/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Book Routes (RESTful API Endpoints) v2.0
 * =============================================================================
 * 
 * Protected routes for book management. Each user has their own library.
 * All actions are logged in activity history.
 * 
 * Endpoints:
 * - GET    /api/books     - Get user's books
 * - POST   /api/books     - Add a new book
 * - PUT    /api/books/:id - Update a book
 * - DELETE /api/books/:id - Delete a book
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// =============================================================================
// GET ALL BOOKS (User's Library)
// =============================================================================

/**
 * @route   GET /api/books
 * @desc    Retrieve all books belonging to the current user
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        // Fetch only books belonging to the logged-in user
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('❌ Error fetching books:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve books. Please try again later.'
        });
    }
});

// =============================================================================
// GET SINGLE BOOK BY ID
// =============================================================================

/**
 * @route   GET /api/books/:id
 * @desc    Retrieve a single book by its ID (must belong to user)
 * @access  Private
 */
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('❌ Error fetching book:', error.message);
        
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve book'
        });
    }
});

// =============================================================================
// ADD NEW BOOK
// =============================================================================

/**
 * @route   POST /api/books
 * @desc    Add a new book to user's library
 * @access  Private
 */
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, year } = req.body;

        // Validate required fields
        if (!title || !author || !isbn || !year) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (title, author, isbn, year)'
            });
        }

        // Check if ISBN already exists for this user
        const existingBook = await Book.findOne({ 
            isbn: isbn.trim(), 
            user: req.user._id 
        });
        
        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: 'A book with this ISBN already exists in your library'
            });
        }

        // Create new book with user reference
        const newBook = new Book({
            user: req.user._id,
            title: title.trim(),
            author: author.trim(),
            isbn: isbn.trim(),
            year: parseInt(year, 10)
        });

        const savedBook = await newBook.save();

        // Log the activity
        await ActivityLog.logActivity(
            req.user._id,
            'ADD',
            savedBook.title,
            `Added "${savedBook.title}" by ${savedBook.author} to the library`,
            { bookId: savedBook._id, author: savedBook.author, isbn: savedBook.isbn, year: savedBook.year }
        );

        res.status(201).json({
            success: true,
            message: 'Book added successfully to your library',
            data: savedBook
        });
    } catch (error) {
        console.error('❌ Error adding book:', error.message);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A book with this ISBN already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to add book. Please try again later.'
        });
    }
});

// =============================================================================
// UPDATE BOOK
// =============================================================================

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book in user's library
 * @access  Private
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, author, isbn, year } = req.body;

        // Find book and verify ownership
        const book = await Book.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Store old values for logging
        const oldTitle = book.title;

        // Update fields
        if (title) book.title = title.trim();
        if (author) book.author = author.trim();
        if (isbn) book.isbn = isbn.trim();
        if (year) book.year = parseInt(year, 10);

        const updatedBook = await book.save();

        // Log the activity
        await ActivityLog.logActivity(
            req.user._id,
            'EDIT',
            updatedBook.title,
            `Updated "${oldTitle}" book details`,
            { bookId: updatedBook._id, changes: req.body }
        );

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error) {
        console.error('❌ Error updating book:', error.message);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update book'
        });
    }
});

// =============================================================================
// DELETE BOOK
// =============================================================================

/**
 * @route   DELETE /api/books/:id
 * @desc    Remove a book from user's library
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete book (only if it belongs to user)
        const deletedBook = await Book.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Log the activity
        await ActivityLog.logActivity(
            req.user._id,
            'DELETE',
            deletedBook.title,
            `Removed "${deletedBook.title}" by ${deletedBook.author} from the library`,
            { author: deletedBook.author, isbn: deletedBook.isbn, year: deletedBook.year }
        );

        res.status(200).json({
            success: true,
            message: `"${deletedBook.title}" has been removed from your library`,
            data: deletedBook
        });
    } catch (error) {
        console.error('❌ Error deleting book:', error.message);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete book'
        });
    }
});

module.exports = router;
