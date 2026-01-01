/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Activity Log Routes
 * =============================================================================
 * 
 * API endpoints for retrieving user activity history.
 * 
 * Endpoints:
 * - GET /api/logs - Get user's activity history
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect } = require('../middleware/auth');

// =============================================================================
// GET USER ACTIVITY HISTORY
// =============================================================================

/**
 * @route   GET /api/logs
 * @desc    Get current user's activity history
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        // Get limit from query params (default 50)
        const limit = parseInt(req.query.limit) || 50;

        // Fetch user's activity logs
        const logs = await ActivityLog.getUserHistory(req.user._id, limit);

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve activity history'
        });
    }
});

// =============================================================================
// CLEAR ACTIVITY HISTORY
// =============================================================================

/**
 * @route   DELETE /api/logs
 * @desc    Clear user's activity history
 * @access  Private
 */
router.delete('/', protect, async (req, res) => {
    try {
        await ActivityLog.deleteMany({ user: req.user._id });

        res.status(200).json({
            success: true,
            message: 'Activity history cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear activity history'
        });
    }
});

module.exports = router;
