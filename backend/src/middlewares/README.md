# Middlewares

This directory contains custom Express middlewares.

## Middleware Files:

- `auth.js` - Authentication (protect, authorize roles)
- `errorHandler.js` - Global error handling middleware
- `notFound.js` - 404 handler for undefined routes
- `validation.js` - Request validation middleware wrapper
- `rateLimit.js` - Rate limiting configurations
- `upload.js` - File upload handling (Multer)
- `cors.js` - CORS configuration
- `sanitize.js` - Input sanitization
- `logger.js` - Request logging (Morgan)
- `pagination.js` - Query pagination helper
- `cache.js` - Response caching middleware
- `requestId.js` - Request ID generation for tracking
- `compression.js` - Response compression

## Key Middlewares:

### 1. Authentication (`auth.js`)
```javascript
// Protect routes - requires valid JWT
exports.protect = async (req, res, next) => {
  // Verify JWT token
  // Attach user to req.user
  // Call next() or throw error
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user.role is in allowed roles
    // Call next() or throw error
  };
};

// Optional authentication (for public routes with optional user context)
exports.optionalAuth = async (req, res, next) => {
  // Verify token if present, but don't require it
};
```

### 2. Error Handler (`errorHandler.js`)
```javascript
// Centralized error handling
exports.errorHandler = (err, req, res, next) => {
  // Log error
  // Format error response
  // Send appropriate status code and message
};
```

### 3. Validation (`validation.js`)
```javascript
// Wrapper for validation schemas
exports.validate = (schema) => {
  return (req, res, next) => {
    // Validate req.body/params/query against schema
    // Call next() or throw validation error
  };
};
```

### 4. Rate Limiting (`rateLimit.js`)
```javascript
// Different rate limit configs for different routes
exports.general = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

exports.auth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // stricter limit for auth endpoints
});
```

## Middleware Order:

In `app.js`, middlewares should be applied in this order:
1. Security headers (Helmet)
2. CORS
3. Body parsers
4. Request ID
5. Logging
6. Rate limiting (if global)
7. Routes
8. 404 handler
9. Error handler (must be last)

## Best Practices:

- Keep middlewares focused on single responsibility
- Use `next()` to pass control to next middleware
- Use `next(error)` to trigger error handling
- Document middleware purpose and usage
- Test middlewares independently
- Make middlewares reusable and configurable
