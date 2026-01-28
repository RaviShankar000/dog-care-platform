# Controllers

This directory contains all route controllers that handle HTTP requests and responses.

## Controllers:

- `authController.js` - Authentication (register, login, logout, refresh token, forgot password)
- `userController.js` - User profile management
- `petController.js` - Pet CRUD operations
- `employeeController.js` - Employee management and availability
- `serviceController.js` - Service listing and management
- `bookingController.js` - Booking creation, updates, and management
- `productController.js` - Product catalog operations
- `orderController.js` - Order processing and fulfillment
- `reminderController.js` - Reminder management
- `breedingController.js` - Breeding and adoption records
- `reviewController.js` - Review submission and management
- `messageController.js` - Messaging operations
- `notificationController.js` - Notification management
- `paymentController.js` - Payment processing and webhooks
- `adminController.js` - Admin operations (user management, analytics, reports)
- `searchController.js` - Search and filter operations

## Controller Responsibilities:

Controllers should be **thin** and only handle:
1. Request parsing and validation triggering
2. Calling service layer methods
3. Formatting responses
4. Error handling delegation
5. HTTP status code management

## Best Practices:

- Keep controllers focused on HTTP concerns
- Delegate business logic to services
- Use async/await for asynchronous operations
- Return consistent response formats
- Handle errors with try-catch and pass to error middleware
- Use express-async-handler or custom async wrapper

## Example Structure:
```javascript
const asyncHandler = require('express-async-handler');
const ServiceName = require('../services/ServiceName');

// @desc    Description of endpoint
// @route   GET /api/v1/resource
// @access  Public/Private/Admin
exports.methodName = asyncHandler(async (req, res, next) => {
  const result = await ServiceName.methodName(req.params, req.body, req.user);
  
  res.status(200).json({
    success: true,
    data: result
  });
});
```
