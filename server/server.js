/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Main Server Entry Point
 * =============================================================================
 * 
 * This file initializes and configures the Express server for the Smart Library
 * Management System. It sets up middleware, database connection, and API routes.
 * 
 * Author: Smart Library Team
 * Version: 1.0.0
 * =============================================================================
 */

// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import route handlers
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');

// =============================================================================
// CONFIGURATION
// =============================================================================

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Define server port (default to 5000 if not specified in environment)
const PORT = process.env.PORT || 5000;

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

/**
 * CORS Middleware
 * Enables Cross-Origin Resource Sharing to allow frontend (React app)
 * running on a different port to communicate with this backend API
 */
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow React dev server origins
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
}));

/**
 * JSON Parser Middleware
 * Parses incoming JSON request bodies and makes them available
 * in req.body for route handlers
 */
app.use(express.json());

/**
 * URL Encoded Parser Middleware
 * Parses URL-encoded request bodies (form data)
 */
app.use(express.urlencoded({ extended: true }));

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

/**
 * MongoDB Connection
 * Connects to MongoDB database using Mongoose ODM
 * Uses connection string from environment variables
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-library');
        
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`📦 Database: ${conn.connection.name}`);
        console.log(`🌐 Host: ${conn.connection.host}`);
        console.log('═══════════════════════════════════════════════════════════');
    } catch (error) {
        // Log error and exit process if connection fails
        console.error('═══════════════════════════════════════════════════════════');
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('═══════════════════════════════════════════════════════════');
        process.exit(1); // Exit with failure code
    }
};

// Establish database connection
connectDB();

// =============================================================================
// API ROUTES
// =============================================================================

/**
 * Root endpoint - Health check
 * Returns a simple message to verify the server is running
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '📚 Welcome to Smart Library API',
        version: '1.0.0',
        endpoints: {
            getAllBooks: 'GET /api/books',
            addBook: 'POST /api/books',
            deleteBook: 'DELETE /api/books/:id'
        }
    });
});

/**
 * Book Routes
 * All book-related API endpoints are prefixed with /api/books
 */
app.use('/api/books', bookRoutes);

/**
 * Auth Routes
 * Authentication endpoints: register, login, profile
 */
app.use('/api/auth', authRoutes);

/**
 * Activity Log Routes
 * User activity history
 */
app.use('/api/logs', logRoutes);

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

/**
 * Global Error Handler
 * Catches and handles all errors thrown in the application
 */
app.use((error, req, res, next) => {
    console.error('❌ Server Error:', error.message);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// =============================================================================
// SERVER INITIALIZATION
// =============================================================================

/**
 * Start the Express server
 * Listens on the configured port for incoming requests
 */
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('        📚 SMART LIBRARY MANAGEMENT SYSTEM 📚');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  🚀 Server is running on port ${PORT}`);
    console.log(`  🌐 API URL: http://localhost:${PORT}`);
    console.log(`  📖 Books API: http://localhost:${PORT}/api/books`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
});

// Export app for testing purposes
module.exports = app;
