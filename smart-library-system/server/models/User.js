/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - User Model (Mongoose Schema)
 * =============================================================================
 * 
 * User authentication model with password hashing.
 * Each user has their own library collection.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// =============================================================================
// USER SCHEMA DEFINITION
// =============================================================================

const userSchema = new mongoose.Schema({
    /**
     * User's display name
     */
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    /**
     * User's email address (unique identifier for login)
     */
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },

    /**
     * User's password (hashed)
     */
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },

    /**
     * User's preferred theme
     */
    theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark'
    },

    /**
     * Password reset token (hashed)
     */
    resetPasswordToken: {
        type: String,
        select: false
    },

    /**
     * Password reset token expiration
     */
    resetPasswordExpire: {
        type: Date,
        select: false
    },

    /**
     * Account creation date
     */
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// =============================================================================
// PASSWORD HASHING MIDDLEWARE
// =============================================================================

/**
 * Hash password before saving
 */
userSchema.pre('save', async function(next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Password to compare
 * @returns {boolean} True if passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// =============================================================================
// MODEL EXPORT
// =============================================================================

const User = mongoose.model('User', userSchema);

module.exports = User;
