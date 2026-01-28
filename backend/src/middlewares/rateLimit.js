/**
 * Rate Limiting Middleware
 * Prevent brute force and DDoS attacks
 */

const rateLimit = require('express-rate-limit');

/**
 * General rate limiter
 */
exports.general = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Authentication rate limiter (stricter)
 */
exports.auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * API rate limiter
 */
exports.api = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});
