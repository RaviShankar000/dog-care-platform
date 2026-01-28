# Validators

This directory contains request validation schemas.

## Validator Files:

- `authValidator.js` - Authentication request validation
- `userValidator.js` - User data validation
- `petValidator.js` - Pet data validation
- `employeeValidator.js` - Employee data validation
- `serviceValidator.js` - Service data validation
- `bookingValidator.js` - Booking data validation
- `productValidator.js` - Product data validation
- `orderValidator.js` - Order data validation
- `reminderValidator.js` - Reminder data validation
- `breedingValidator.js` - Breeding record validation
- `reviewValidator.js` - Review data validation
- `messageValidator.js` - Message data validation
- `commonValidator.js` - Reusable validation schemas

## Validation Library:

Using **Joi** for schema validation (can also use express-validator or Yup).

## Example Validator Structure:
```javascript
const Joi = require('joi');

// Register validation
exports.register = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, and number'
    }),
  
  role: Joi.string()
    .valid('owner', 'employee')
    .required(),
  
  profile: Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    phoneNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
  }).required()
});

// Login validation
exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Update profile validation
exports.updateProfile = Joi.object({
  profile: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    bio: Joi.string().max(500)
  }),
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean()
    })
  })
});
```

## Common Validation Patterns:

### ObjectId Validation
```javascript
const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Invalid ID format'
  });
```

### Date Validation
```javascript
const futureDate = Joi.date()
  .min('now')
  .messages({
    'date.min': 'Date must be in the future'
  });
```

### Pagination
```javascript
const pagination = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
};
```

### File Upload
```javascript
const fileUpload = Joi.object({
  mimetype: Joi.string()
    .valid('image/jpeg', 'image/png', 'image/jpg')
    .required(),
  size: Joi.number()
    .max(5 * 1024 * 1024) // 5MB
    .required()
});
```

## Usage in Routes:

```javascript
const { validate } = require('../middlewares/validation');
const validators = require('../validators/userValidator');

router.post(
  '/register',
  validate(validators.register),
  controller.register
);
```

## Best Practices:

- Define separate schemas for create, update, and query operations
- Reuse common validation patterns
- Provide clear, user-friendly error messages
- Validate all user inputs (body, params, query)
- Use strict validation (disallow unknown fields)
- Consider using `.strip()` to remove unknown fields instead of failing
- Test validation schemas independently
