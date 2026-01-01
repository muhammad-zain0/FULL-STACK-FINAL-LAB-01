/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Book Model (Mongoose Schema)
 * =============================================================================
 * 
 * This file defines the MongoDB schema and model for Book documents.
 * It specifies the structure, validation rules, and data types for books
 * stored in the database.
 * 
 * Fields:
 * - title: The title of the book (required)
 * - author: The author's name (required)
 * - isbn: International Standard Book Number (required, unique)
 * - year: Publication year (required)
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

const mongoose = require('mongoose');

// =============================================================================
// BOOK SCHEMA DEFINITION
// =============================================================================

/**
 * Book Schema
 * Defines the structure and validation for book documents in MongoDB
 * Each book belongs to a specific user (owner)
 */
const bookSchema = new mongoose.Schema({
    /**
     * Reference to the user who owns this book
     */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * Book Title
     * The name/title of the book
     */
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true, // Remove whitespace from both ends
        minlength: [1, 'Title must be at least 1 character long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    /**
     * Author Name
     * The name of the book's author
     */
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true,
        minlength: [1, 'Author name must be at least 1 character long'],
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },

    /**
     * ISBN Number
     * International Standard Book Number - unique identifier for books
     */
    isbn: {
        type: String,
        required: [true, 'ISBN number is required'],
        trim: true,
        unique: true, // Ensures no duplicate ISBN numbers in the database
        minlength: [10, 'ISBN must be at least 10 characters'],
        maxlength: [17, 'ISBN cannot exceed 17 characters (including hyphens)']
    },

    /**
     * Publication Year
     * The year the book was published
     */
    year: {
        type: Number,
        required: [true, 'Publication year is required'],
        min: [1000, 'Year must be a valid 4-digit year'],
        max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    }
}, {
    /**
     * Schema Options
     */
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false // Disables the __v version key
});

// =============================================================================
// SCHEMA INDEXES
// =============================================================================

/**
 * Create index on ISBN for faster queries
 * This also enforces uniqueness at the database level
 */
bookSchema.index({ isbn: 1 }, { unique: true });

/**
 * Create compound index for title and author for search optimization
 */
bookSchema.index({ title: 1, author: 1 });

// =============================================================================
// VIRTUAL PROPERTIES
// =============================================================================

/**
 * Virtual property to get a formatted display of the book
 * Useful for logging and display purposes
 */
bookSchema.virtual('displayInfo').get(function() {
    return `"${this.title}" by ${this.author} (${this.year})`;
});

// =============================================================================
// MODEL EXPORT
// =============================================================================

/**
 * Book Model
 * Creates and exports the Mongoose model based on the book schema
 * This model will interact with the 'books' collection in MongoDB
 */
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
