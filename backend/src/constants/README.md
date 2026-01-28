# Constants

This directory contains application-wide constants and enumerations.

## Constant Files:

- `roles.js` - User role constants
- `status.js` - Status enumerations (booking, order, payment, etc.)
- `permissions.js` - Permission constants for RBAC
- `errorMessages.js` - Standardized error messages
- `successMessages.js` - Standardized success messages
- `httpStatus.js` - HTTP status codes
- `regex.js` - Common regex patterns
- `config.js` - Application configuration constants

## Example Structures:

### roles.js
```javascript
module.exports = {
  OWNER: 'owner',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  SUPPORT: 'support'
};
```

### status.js
```javascript
module.exports = {
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
    NO_SHOW: 'no-show',
    REFUNDED: 'refunded'
  },
  
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },
  
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELED: 'canceled',
    RETURNED: 'returned'
  },
  
  EMPLOYEE_STATUS: {
    ACTIVE: 'active',
    ON_LEAVE: 'on-leave',
    TERMINATED: 'terminated'
  },
  
  USER_STATUS: {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    DEACTIVATED: 'deactivated'
  }
};
```

### permissions.js
```javascript
module.exports = {
  // User permissions
  USER: {
    READ_OWN: 'user:read:own',
    UPDATE_OWN: 'user:update:own',
    DELETE_OWN: 'user:delete:own'
  },
  
  // Pet permissions
  PET: {
    CREATE: 'pet:create',
    READ_OWN: 'pet:read:own',
    UPDATE_OWN: 'pet:update:own',
    DELETE_OWN: 'pet:delete:own',
    READ_ALL: 'pet:read:all'
  },
  
  // Booking permissions
  BOOKING: {
    CREATE: 'booking:create',
    READ_OWN: 'booking:read:own',
    UPDATE_OWN: 'booking:update:own',
    CANCEL_OWN: 'booking:cancel:own',
    READ_ALL: 'booking:read:all',
    MANAGE_ALL: 'booking:manage:all'
  },
  
  // Admin permissions
  ADMIN: {
    MANAGE_USERS: 'admin:manage:users',
    MANAGE_BOOKINGS: 'admin:manage:bookings',
    MANAGE_PRODUCTS: 'admin:manage:products',
    VIEW_ANALYTICS: 'admin:view:analytics',
    MANAGE_SETTINGS: 'admin:manage:settings'
  }
};
```

### errorMessages.js
```javascript
module.exports = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Not authorized to access this resource',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'No token provided',
    EMAIL_EXISTS: 'Email already registered',
    EMAIL_NOT_VERIFIED: 'Please verify your email first'
  },
  
  USER: {
    NOT_FOUND: 'User not found',
    UPDATE_FAILED: 'Failed to update user',
    DELETE_FAILED: 'Failed to delete user'
  },
  
  PET: {
    NOT_FOUND: 'Pet not found',
    NOT_OWNER: 'You are not the owner of this pet',
    CREATION_FAILED: 'Failed to create pet profile'
  },
  
  BOOKING: {
    NOT_FOUND: 'Booking not found',
    NOT_AVAILABLE: 'Selected time slot is not available',
    ALREADY_EXISTS: 'Booking already exists for this time slot',
    CANCELLATION_PERIOD_EXPIRED: 'Cancellation period has expired'
  },
  
  VALIDATION: {
    INVALID_INPUT: 'Invalid input data',
    REQUIRED_FIELD: 'Required field is missing',
    INVALID_FORMAT: 'Invalid data format'
  }
};
```

### regex.js
```javascript
module.exports = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  OBJECTID: /^[0-9a-fA-F]{24}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/
};
```

### httpStatus.js
```javascript
module.exports = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};
```

## Benefits of Using Constants:

1. **Consistency:** Single source of truth for values used across the app
2. **Maintainability:** Easy to update values in one place
3. **Type Safety:** Prevents typos and magic strings
4. **Documentation:** Self-documenting code
5. **Refactoring:** Easy to find and replace values
6. **Testing:** Easy to test against known values

## Usage Example:

```javascript
const { ROLES } = require('../constants/roles');
const { BOOKING_STATUS } = require('../constants/status');
const { ERROR_MESSAGES } = require('../constants/errorMessages');

// In middleware
if (req.user.role !== ROLES.ADMIN) {
  throw new ErrorResponse(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 403);
}

// In service
booking.status = BOOKING_STATUS.CONFIRMED;
```
