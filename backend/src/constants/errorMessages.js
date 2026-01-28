/**
 * Standardized Error Messages
 */

module.exports = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Not authorized to access this resource',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'No authentication token provided',
    TOKEN_EXPIRED: 'Token has expired',
    EMAIL_EXISTS: 'Email is already registered',
    EMAIL_NOT_VERIFIED: 'Please verify your email address first',
    ACCOUNT_SUSPENDED: 'Your account has been suspended',
    ACCOUNT_DEACTIVATED: 'Your account has been deactivated',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    REFRESH_TOKEN_EXPIRED: 'Refresh token has expired'
  },
  
  USER: {
    NOT_FOUND: 'User not found',
    UPDATE_FAILED: 'Failed to update user',
    DELETE_FAILED: 'Failed to delete user',
    CREATION_FAILED: 'Failed to create user'
  },
  
  VALIDATION: {
    INVALID_INPUT: 'Invalid input data provided',
    REQUIRED_FIELD: 'Required field is missing',
    INVALID_FORMAT: 'Invalid data format',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PASSWORD: 'Password does not meet requirements',
    PASSWORD_MISMATCH: 'Passwords do not match'
  },
  
  SERVER: {
    INTERNAL_ERROR: 'Internal server error occurred',
    SERVICE_UNAVAILABLE: 'Service is temporarily unavailable'
  }
};
