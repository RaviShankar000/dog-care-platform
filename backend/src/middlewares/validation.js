/**
 * Validation Middleware
 * Wrapper for Joi validation schemas
 */

const ErrorResponse = require('../utils/errorResponse');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Validate request against Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Source of data to validate ('body', 'params', 'query')
 * @returns {Function} Express middleware
 */
exports.validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
      context: { cookies: req.cookies } // Pass cookies for conditional validation
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return next(
        new ErrorResponse(
          'Validation failed',
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          errors
        )
      );
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};
