# Authentication & Authorization System

## Overview
This backend implements a complete JWT-based authentication and role-based access control (RBAC) system with production-grade security features.

## Features

### Authentication
- ✅ **JWT Access Tokens** - Short-lived tokens for API authentication
- ✅ **Refresh Tokens** - Long-lived tokens for obtaining new access tokens
- ✅ **HTTP-Only Cookies** - Secure storage for refresh tokens
- ✅ **Password Hashing** - Bcrypt with salt rounds for secure password storage
- ✅ **Account Locking** - Automatic lockout after failed login attempts
- ✅ **Token Revocation** - Ability to invalidate tokens (logout)
- ✅ **Multi-Device Logout** - Revoke all tokens across devices

### Authorization
- ✅ **Role-Based Access Control (RBAC)**
  - Owner (Dog owners)
  - Employee (Caregivers/Staff)
  - Rider (Delivery personnel)
  - Admin (Platform administrators)
- ✅ **Protected Routes** - Middleware to require authentication
- ✅ **Role-Based Permissions** - Restrict access by user role
- ✅ **Optional Authentication** - Public routes with optional user context

### Security Features
- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **Password Complexity** - Enforce strong password requirements
- ✅ **Account Status** - Active, suspended, deactivated states
- ✅ **Password Change Detection** - Invalidate old tokens after password change
- ✅ **Request Metadata** - Track IP address and user agent
- ✅ **Secure Defaults** - Production-ready security configurations

---

## API Endpoints

### Public Endpoints

#### 1. Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "owner",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "role": "owner",
      "profile": { ... },
      "status": "active"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Refresh token is set in HTTP-only cookie automatically.

#### 3. Refresh Token
```http
POST /api/v1/auth/refresh
Cookie: refreshToken=<refresh_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Endpoints (Require Authentication)

#### 4. Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "role": "owner",
    "profile": { ... },
    "status": "active",
    "verification": { ... },
    "preferences": { ... }
  }
}
```

#### 5. Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
Cookie: refreshToken=<refresh_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### 6. Logout All Devices
```http
POST /api/v1/auth/logout-all
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices"
}
```

#### 7. Change Password
```http
PUT /api/v1/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456",
  "confirmPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

---

## Usage Examples

### Frontend Integration

#### Register User
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    role: 'owner',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890'
    }
  })
});

const data = await response.json();
// Store accessToken in memory or state management
const accessToken = data.data.accessToken;
```

#### Login User
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();
const accessToken = data.data.accessToken;
```

#### Make Authenticated Request
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  credentials: 'include'
});

const userData = await response.json();
```

#### Refresh Token
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/refresh', {
  method: 'POST',
  credentials: 'include' // Sends refresh token cookie
});

const data = await response.json();
const newAccessToken = data.data.accessToken;
```

---

## Middleware Usage

### Protect Routes (Require Authentication)
```javascript
const { protect } = require('../middlewares/auth');

router.get('/profile', protect, userController.getProfile);
```

### Authorize Specific Roles
```javascript
const { protect, authorize } = require('../middlewares/auth');
const ROLES = require('../constants/roles');

// Only admin can access
router.delete('/users/:id', 
  protect, 
  authorize(ROLES.ADMIN), 
  userController.deleteUser
);

// Admin or employee can access
router.get('/bookings', 
  protect, 
  authorize(ROLES.ADMIN, ROLES.EMPLOYEE), 
  bookingController.getAllBookings
);
```

### Optional Authentication
```javascript
const { optionalAuth } = require('../middlewares/auth');

// Public route with optional user context
router.get('/services', 
  optionalAuth, 
  serviceController.getServices
);
```

---

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### Token Security
- **Access Token:** Short-lived (24 hours by default)
- **Refresh Token:** Long-lived (7 days by default)
- Refresh tokens stored in HTTP-only cookies
- Access tokens sent in Authorization header

### Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes
- Failed login attempts: Account locked after 5 failures

### Account Security
- Passwords hashed with bcrypt (12 rounds)
- Account locking after multiple failed attempts
- Token revocation on password change
- Session tracking with IP and user agent

---

## Database Models

### User Model
- Email (unique, required)
- Password (hashed, not returned in queries)
- Role (owner, employee, rider, admin)
- Profile information
- Verification status
- Security settings
- Preferences
- Account status

### RefreshToken Model
- Token (unique)
- User reference
- Expiration date
- Revocation status
- Request metadata

---

## Error Handling

### Common Errors

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

#### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again after 15 minutes"
}
```

---

## Testing

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "owner",
    "profile": {
      "firstName": "Test",
      "lastName": "User",
      "phoneNumber": "+1234567890"
    }
  }'
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Environment Variables

Required environment variables:
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRE=7d
```

---

## Architecture

```
Request
  ↓
Rate Limiter
  ↓
Validator (Joi)
  ↓
Auth Middleware (if protected)
  ↓
Controller (thin layer)
  ↓
Service (business logic)
  ↓
Model (database)
  ↓
Response
```

---

## Next Steps

1. Implement password reset via email
2. Add email verification
3. Implement two-factor authentication (2FA)
4. Add OAuth providers (Google, Facebook)
5. Implement session management dashboard
6. Add audit logs for security events

---

This authentication system is production-ready and follows industry best practices for security, scalability, and maintainability.
