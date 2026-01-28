/**
 * Authentication Service
 * Business logic for authentication operations
 */

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ErrorResponse = require('../utils/errorResponse');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/generateToken');
const ERROR_MESSAGES = require('../constants/errorMessages');
const HTTP_STATUS = require('../constants/httpStatus');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {Object} requestInfo - Request metadata (IP, user agent)
   * @returns {Promise<Object>} User data and tokens
   */
  static async register(userData, requestInfo = {}) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.EMAIL_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    // Create user
    const user = await User.create({
      ...userData,
      metadata: {
        registrationSource: requestInfo.source || 'web'
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        status: user.status
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @param {Object} requestInfo - Request metadata
   * @returns {Promise<Object>} User data and tokens
   */
  static async login(email, password, requestInfo = {}) {
    // Find user with password field
    const user = await User.findByEmail(email);

    if (!user) {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new ErrorResponse(
        'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Check account status
    if (user.status === 'suspended') {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.ACCOUNT_SUSPENDED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (user.status === 'deactivated') {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.ACCOUNT_DEACTIVATED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();
      
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        status: user.status
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  /**
   * Refresh access token
   * @param {String} refreshToken - Refresh token
   * @param {Object} requestInfo - Request metadata
   * @returns {Promise<Object>} New tokens
   */
  static async refreshAccessToken(refreshToken, requestInfo = {}) {
    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Find refresh token in database
    const storedToken = await RefreshToken.findActiveToken(refreshToken);

    if (!storedToken) {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.REFRESH_TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ErrorResponse(
        ERROR_MESSAGES.USER.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Check user status
    if (user.status !== 'active') {
      throw new ErrorResponse(
        ERROR_MESSAGES.AUTH.UNAUTHORIZED,
        HTTP_STATUS.FORBIDDEN
      );
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Revoke old refresh token and store new one
    await RefreshToken.revokeToken(refreshToken, newRefreshToken);
    
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdByIp: requestInfo.ip,
      userAgent: requestInfo.userAgent
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Logout user
   * @param {String} refreshToken - Refresh token to revoke
   * @returns {Promise<void>}
   */
  static async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    try {
      await RefreshToken.revokeToken(refreshToken);
    } catch (error) {
      // Silently fail if token doesn't exist
      console.error('Logout error:', error.message);
    }
  }

  /**
   * Logout from all devices
   * @param {String} userId - User ID
   * @returns {Promise<void>}
   */
  static async logoutAll(userId) {
    await RefreshToken.revokeUserTokens(userId);
  }

  /**
   * Get current user info
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User data
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorResponse(
        ERROR_MESSAGES.USER.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      status: user.status,
      verification: user.verification,
      preferences: user.preferences
    };
  }

  /**
   * Change password
   * @param {String} userId - User ID
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Promise<void>}
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ErrorResponse(
        ERROR_MESSAGES.USER.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new ErrorResponse(
        'Current password is incorrect',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens (force re-login on all devices)
    await RefreshToken.revokeUserTokens(userId);
  }
}

module.exports = AuthService;
