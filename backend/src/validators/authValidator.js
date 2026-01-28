/**
 * Authentication Validators
 * Joi validation schemas for authentication requests
 */

const Joi = require('joi');
const ROLES = require('../constants/roles');

/**
 * Register validation schema
 */
exports.register = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),

  role: Joi.string()
    .valid(...Object.values(ROLES))
    .default(ROLES.OWNER)
    .messages({
      'any.only': 'Invalid role specified'
    }),

  profile: Joi.object({
    firstName: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'any.required': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters'
      }),

    lastName: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'any.required': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters'
      }),

    phoneNumber: Joi.string()
      .required()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .messages({
        'any.required': 'Phone number is required',
        'string.pattern.base': 'Please provide a valid phone number'
      }),

    dateOfBirth: Joi.date()
      .max('now')
      .messages({
        'date.max': 'Date of birth cannot be in the future'
      }),

    gender: Joi.string()
      .valid('male', 'female', 'other')
  }).required()
});

/**
 * Login validation schema
 */
exports.login = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * Refresh token validation schema
 */
exports.refreshToken = Joi.object({
  refreshToken: Joi.string()
    .when(Joi.ref('$cookies.refreshToken'), {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .messages({
      'any.required': 'Refresh token is required'
    })
});

/**
 * Change password validation schema
 */
exports.changePassword = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),

  newPassword: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .invalid(Joi.ref('currentPassword'))
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required',
      'any.invalid': 'New password must be different from current password'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});
