/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Activity Log Model (Mongoose Schema)
 * =============================================================================
 * 
 * Tracks all user actions: add, edit, delete books with timestamps.
 * Each log entry is associated with a specific user.
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

const mongoose = require('mongoose');

// =============================================================================
// ACTIVITY LOG SCHEMA DEFINITION
// =============================================================================

const activityLogSchema = new mongoose.Schema({
    /**
     * Reference to the user who performed the action
     */
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * Type of action performed
     */
    action: {
        type: String,
        enum: ['ADD', 'EDIT', 'DELETE'],
        required: true
    },

    /**
     * Description of the action
     */
    description: {
        type: String,
        required: true
    },

    /**
     * Book title involved in the action
     */
    bookTitle: {
        type: String,
        required: true
    },

    /**
     * Additional details about the action
     */
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    /**
     * Timestamp of the action
     */
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    versionKey: false
});

// =============================================================================
// INDEXES
// =============================================================================

// Index for faster queries by user and timestamp
activityLogSchema.index({ user: 1, timestamp: -1 });

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Create a new activity log entry
 * @param {Object} data - Log data
 */
activityLogSchema.statics.logActivity = async function(userId, action, bookTitle, description, details = {}) {
    return await this.create({
        user: userId,
        action,
        bookTitle,
        description,
        details,
        timestamp: new Date()
    });
};

/**
 * Get activity history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of records to return
 */
activityLogSchema.statics.getUserHistory = async function(userId, limit = 50) {
    return await this.find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(limit);
};

// =============================================================================
// MODEL EXPORT
// =============================================================================

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
