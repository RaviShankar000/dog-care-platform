/**
 * Authentication Middleware
 * Protect routes and authorize based on roles
 */

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const ERROR_MESSAGES = require('../constants/errorMessages');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Protect routes - Require authentication
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(
      new ErrorResponse(
        ERROR_MESSAGES.AUTH.TOKEN_MISSING,
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  try {
    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(
        new ErrorResponse(
          ERROR_MESSAGES.AUTH.TOKEN_INVALID,
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorResponse(
          ERROR_MESSAGES.USER.NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(
        new ErrorResponse(
          ERROR_MESSAGES.AUTH.UNAUTHORIZED,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorResponse(
          'Password was recently changed. Please login again.',
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        ERROR_MESSAGES.AUTH.TOKEN_INVALID,
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }
});

/**
 * Authorize specific roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Express middleware
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ErrorResponse(
          ERROR_MESSAGES.AUTH.UNAUTHORIZED,
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          'You do not have permission to access this resource',
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  };
};

/**
 * Optional authentication - Attach user if token is valid, but don't require it
 */
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without authentication
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    if (decoded) {
      // Find user
      const user = await User.findById(decoded.id);

      if (user && user.status === 'active') {
        // Attach user to request
        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status
        };
      }
    }
  } catch (error) {
    // Silently fail and continue without user
  }

  next();
});
