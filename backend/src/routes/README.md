# API Routes

This directory contains all Express router definitions.

## Route Files:

- `auth.routes.js` - Authentication routes
- `user.routes.js` - User management routes
- `pet.routes.js` - Pet management routes
- `employee.routes.js` - Employee management routes
- `service.routes.js` - Service routes
- `booking.routes.js` - Booking routes
- `product.routes.js` - Product routes
- `order.routes.js` - Order routes
- `reminder.routes.js` - Reminder routes
- `breeding.routes.js` - Breeding & adoption routes
- `review.routes.js` - Review routes
- `message.routes.js` - Message routes
- `notification.routes.js` - Notification routes
- `payment.routes.js` - Payment routes
- `admin.routes.js` - Admin routes
- `search.routes.js` - Search routes
- `index.js` - Main router that combines all routes

## Route Structure:

Each route file should:
1. Define RESTful endpoints
2. Apply appropriate middlewares (auth, validation, rate limiting)
3. Map to controller methods
4. Document with comments

## Example Route File:
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/resourceController');
const { protect, authorize } = require('../middlewares/auth');
const validator = require('../validators/resourceValidator');
const rateLimit = require('../middlewares/rateLimit');

// Public routes
router.get('/', rateLimit.general, controller.getAll);
router.get('/:id', controller.getById);

// Protected routes (authentication required)
router.use(protect);

router.post(
  '/',
  validator.create,
  controller.create
);

router.put(
  '/:id',
  validator.update,
  controller.update
);

// Admin only routes
router.delete(
  '/:id',
  authorize('admin'),
  controller.delete
);

module.exports = router;
```

## API Versioning:

All routes are versioned under `/api/v1/`. Future versions can be added as `/api/v2/`, etc.

## Route Naming Conventions:

Follow RESTful conventions:
- `GET /resources` - Get all resources (with pagination)
- `GET /resources/:id` - Get single resource
- `POST /resources` - Create resource
- `PUT /resources/:id` - Update resource (full)
- `PATCH /resources/:id` - Update resource (partial)
- `DELETE /resources/:id` - Delete resource

## Nested Routes:

For related resources:
- `GET /users/:userId/pets` - Get all pets for a user
- `GET /bookings/:bookingId/reviews` - Get reviews for a booking
- `POST /employees/:employeeId/availability` - Set employee availability
