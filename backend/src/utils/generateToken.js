/**
 * JWT Token Utilities
 * Generate and verify JWT tokens
 */

const jwt = require('jsonwebtoken');

/**
 * Generate access token
 * @param {String} userId - User ID
 * @returns {String} JWT token
 */
exports.generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

/**
 * Generate refresh token
 * @param {String} userId - User ID
 * @returns {String} JWT refresh token
 */
exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Verify token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key
 * @returns {Object} Decoded token payload
 */
exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

/**
 * Decode token without verification
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
exports.decodeToken = (token) => {
  return jwt.decode(token);
};
