# Utility Functions

This directory contains reusable utility functions and helpers.

## Utility Files:

- `errorResponse.js` - Custom error class for consistent error handling
- `asyncHandler.js` - Async middleware wrapper to catch errors
- `sendEmail.js` - Email sending utility
- `sendSMS.js` - SMS sending utility
- `generateToken.js` - JWT token generation
- `apiFeatures.js` - Query filtering, sorting, pagination, field limiting
- `geocoder.js` - Geocoding utility for address to coordinates
- `fileUpload.js` - File upload helpers
- `dateHelpers.js` - Date manipulation utilities
- `stringHelpers.js` - String formatting utilities
- `encryption.js` - Encryption/decryption utilities
- `logger.js` - Custom logger utility
- `validators.js` - Custom validation helper functions
- `slugify.js` - Slug generation from strings
- `randomGenerator.js` - Random string/number generation
- `pagination.js` - Pagination helper

## Key Utilities:

### 1. Error Response Class
```javascript
// errorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
```

### 2. Async Handler
```javascript
// asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

### 3. API Features
```javascript
// apiFeatures.js
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filtering logic
    return this;
  }

  sort() {
    // Sorting logic
    return this;
  }

  limitFields() {
    // Field limiting logic
    return this;
  }

  paginate() {
    // Pagination logic
    return this;
  }
}

module.exports = APIFeatures;
```

### 4. Token Generation
```javascript
// generateToken.js
const jwt = require('jsonwebtoken');

exports.generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
```

### 5. Email Sender
```javascript
// sendEmail.js
const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    // Configuration
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html || options.text
  };

  // Send email
  await transporter.sendMail(mailOptions);
};
```

### 6. Pagination Helper
```javascript
// pagination.js
exports.getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

exports.getPaginationMetadata = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};
```

### 7. Random Generators
```javascript
// randomGenerator.js
exports.generateBookingNumber = () => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BKG-${date}-${random}`;
};

exports.generateOrderNumber = () => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${date}-${random}`;
};

exports.generateRandomString = (length = 32) => {
  return require('crypto').randomBytes(length).toString('hex');
};
```

## Best Practices:

- Keep utilities pure and framework-agnostic
- Make utilities testable
- Document parameters and return values
- Handle errors appropriately
- Export individual functions, not entire modules
- Keep utilities focused on single responsibility
- Use TypeScript or JSDoc for type documentation
