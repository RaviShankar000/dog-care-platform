/**
 * Pet Validation Schemas
 * Validate pet-related inputs using Joi
 */

const Joi = require('joi');

/**
 * Validation schema for creating a pet
 */
exports.createPet = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Pet name is required',
      'string.min': 'Pet name must be at least 1 character',
      'string.max': 'Pet name cannot exceed 50 characters',
      'any.required': 'Pet name is required'
    }),

  breed: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Breed cannot exceed 50 characters'
    }),

  age: Joi.number()
    .min(0)
    .max(50)
    .optional()
    .messages({
      'number.min': 'Age must be a positive number',
      'number.max': 'Age cannot exceed 50 years',
      'number.base': 'Age must be a valid number'
    }),

  weight: Joi.number()
    .min(0)
    .max(500)
    .optional()
    .messages({
      'number.min': 'Weight must be a positive number',
      'number.max': 'Weight cannot exceed 500 kg',
      'number.base': 'Weight must be a valid number'
    }),

  vaccinations: Joi.array()
    .items(
      Joi.object({
        vaccineName: Joi.string().trim().required(),
        dateGiven: Joi.date().required(),
        nextDueDate: Joi.date().optional(),
        notes: Joi.string().trim().optional().allow('')
      })
    )
    .optional(),

  medicalHistory: Joi.array()
    .items(
      Joi.object({
        illness: Joi.string().trim().required(),
        treatment: Joi.string().trim().required(),
        vetName: Joi.string().trim().required(),
        visitDate: Joi.date().required(),
        notes: Joi.string().trim().optional().allow('')
      })
    )
    .optional(),

  // Owner should not be accepted from request body
  owner: Joi.forbidden()
    .messages({
      'any.unknown': 'Owner cannot be set manually'
    })
});

/**
 * Validation schema for updating a pet
 */
exports.updatePet = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.empty': 'Pet name cannot be empty',
      'string.min': 'Pet name must be at least 1 character',
      'string.max': 'Pet name cannot exceed 50 characters'
    }),

  breed: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Breed cannot exceed 50 characters'
    }),

  age: Joi.number()
    .min(0)
    .max(50)
    .optional()
    .messages({
      'number.min': 'Age must be a positive number',
      'number.max': 'Age cannot exceed 50 years',
      'number.base': 'Age must be a valid number'
    }),

  weight: Joi.number()
    .min(0)
    .max(500)
    .optional()
    .messages({
      'number.min': 'Weight must be a positive number',
      'number.max': 'Weight cannot exceed 500 kg',
      'number.base': 'Weight must be a valid number'
    }),

  vaccinations: Joi.array()
    .items(
      Joi.object({
        vaccineName: Joi.string().trim().required(),
        dateGiven: Joi.date().required(),
        nextDueDate: Joi.date().optional(),
        notes: Joi.string().trim().optional().allow('')
      })
    )
    .optional(),

  medicalHistory: Joi.array()
    .items(
      Joi.object({
        illness: Joi.string().trim().required(),
        treatment: Joi.string().trim().required(),
        vetName: Joi.string().trim().required(),
        visitDate: Joi.date().required(),
        notes: Joi.string().trim().optional().allow('')
      })
    )
    .optional(),

  // Owner should not be accepted from request body
  owner: Joi.forbidden()
    .messages({
      'any.unknown': 'Owner cannot be modified'
    })
});

/**
 * Validation schema for pet ID parameter
 */
exports.petId = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid pet ID format',
      'any.required': 'Pet ID is required'
    })
});
