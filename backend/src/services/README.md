# Services

This directory contains the business logic layer of the application.

## Services:

- `authService.js` - Authentication logic (token generation, password hashing, verification)
- `userService.js` - User management business logic
- `petService.js` - Pet management logic
- `employeeService.js` - Employee operations and matching algorithms
- `serviceService.js` - Service management logic
- `bookingService.js` - Booking logic, availability checking, scheduling
- `productService.js` - Product management and inventory logic
- `orderService.js` - Order processing, fulfillment logic
- `reminderService.js` - Reminder scheduling and notification logic
- `breedingService.js` - Breeding and adoption workflow logic
- `reviewService.js` - Review aggregation and management
- `messageService.js` - Message delivery and conversation management
- `notificationService.js` - Notification dispatch logic
- `paymentService.js` - Payment processing, refunds, payouts
- `emailService.js` - Email sending logic
- `smsService.js` - SMS sending logic
- `uploadService.js` - File upload to cloud storage
- `searchService.js` - Search indexing and query logic
- `analyticsService.js` - Data aggregation and reporting
- `cacheService.js` - Redis cache operations

## Service Layer Responsibilities:

Services are **fat** and handle:
1. Core business logic
2. Data validation and transformation
3. Database operations (via models)
4. Integration with external APIs
5. Complex calculations and algorithms
6. Transaction management
7. Event triggering
8. Cache management

## Best Practices:

- Keep services framework-agnostic (no req, res objects)
- Return data or throw errors (don't handle HTTP responses)
- Use dependency injection where possible
- Write unit tests for all service methods
- Handle transactions for multi-document operations
- Use async/await consistently
- Log important operations

## Example Structure:
```javascript
const Model = require('../models/Model');
const ErrorResponse = require('../utils/errorResponse');

class ServiceName {
  /**
   * Description of method
   * @param {Object} params - Method parameters
   * @returns {Promise<Object>} - Result object
   * @throws {ErrorResponse} - On validation or business logic errors
   */
  static async methodName(params) {
    // Validate business rules
    if (!params.required) {
      throw new ErrorResponse('Required field missing', 400);
    }

    // Perform business logic
    const result = await Model.find(params);

    // Transform and return
    return result;
  }

  static async anotherMethod(data) {
    // Business logic
    return processedData;
  }
}

module.exports = ServiceName;
```

## Service Communication:

Services can call other services but should avoid circular dependencies. Use dependency injection or event-driven architecture for complex inter-service communication.
