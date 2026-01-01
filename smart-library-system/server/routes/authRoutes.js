/**
 * =============================================================================
 * SMART LIBRARY SYSTEM - Authentication Routes
 * =============================================================================
 * 
 * Handles user registration, login, logout, and profile management.
 * Uses JWT for token-based authentication.
 * 
 * Endpoints:
 * - POST /api/auth/register - Register a new user
 * - POST /api/auth/login    - Login user
 * - GET  /api/auth/me       - Get current user profile
 * - PUT  /api/auth/theme    - Update user theme preference
 * 
 * Author: Smart Library Team
 * Version: 2.0.0
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

/**
 * Send token response
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme,
            createdAt: user.createdAt
        }
    });
};

// =============================================================================
// REGISTER NEW USER
// =============================================================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create account. Please try again.'
        });
    }
});

// =============================================================================
// LOGIN USER
// =============================================================================

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// =============================================================================
// GET CURRENT USER
// =============================================================================

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user data'
        });
    }
});

// =============================================================================
// UPDATE THEME PREFERENCE
// =============================================================================

/**
 * @route   PUT /api/auth/theme
 * @desc    Update user's theme preference
 * @access  Private
 */
router.put('/theme', protect, async (req, res) => {
    try {
        const { theme } = req.body;

        if (!theme || !['dark', 'light'].includes(theme)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid theme. Must be "dark" or "light"'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { theme },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Theme updated successfully',
            theme: user.theme
        });
    } catch (error) {
        console.error('Update theme error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update theme'
        });
    }
});

// =============================================================================
// FORGOT PASSWORD
// =============================================================================

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email address'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with that email address'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save token to user (expires in 1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'zainmalik55786@gmail.com',
                pass: process.env.EMAIL_PASS || 'zmikvbummognqfah'
            }
        });

        const mailOptions = {
            from: `"Smart Library System" <${process.env.EMAIL_USER || 'zainmalik55786@gmail.com'}>`,
            to: user.email,
            subject: 'Password Reset Request - Smart Library',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <div style="background: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #667eea; margin-bottom: 20px;">📚 Smart Library System</h2>
                        <h3 style="color: #333;">Password Reset Request</h3>
                        <p style="color: #666; line-height: 1.6;">
                            Hello <strong>${user.name}</strong>,
                        </p>
                        <p style="color: #666; line-height: 1.6;">
                            We received a request to reset your password. Click the button below to create a new password:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Or copy and paste this link in your browser:<br>
                            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                        </p>
                        <p style="color: #999; font-size: 13px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                            This link will expire in 1 hour.<br>
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reset email. Please try again.'
        });
    }
});

// =============================================================================
// RESET PASSWORD
// =============================================================================

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Hash the token from params
        const resetTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again.'
        });
    }
});

// =============================================================================
// EXPORT ROUTER
// =============================================================================

module.exports = router;
