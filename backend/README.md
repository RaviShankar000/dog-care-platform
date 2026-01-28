# Dog Care Platform - Backend

Production-grade Node.js + Express + MongoDB backend with JWT authentication and role-based access control.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi / Express-validator
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Winston / Morgan
- **Testing:** Jest / Supertest
- **Documentation:** Swagger/OpenAPI

## Folder Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── models/           # Mongoose models/schemas
│   ├── controllers/      # Route controllers
│   ├── services/         # Business logic layer
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── validators/       # Request validation schemas
│   ├── utils/            # Utility functions
│   ├── constants/        # Constants and enums
│   └── app.js            # Express app setup
│
├── tests/                # Test files
├── scripts/              # Utility scripts
├── logs/                 # Application logs
├── uploads/              # Temporary file uploads
├── docs/                 # API documentation
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── server.js             # Application entry point
```

## Environment Variables

Required environment variables (see `.env.example`):
- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRE`
- And more...

## Getting Started

1. Install dependencies: `npm install`
2. Setup environment: `cp .env.example .env`
3. Configure `.env` with your settings
4. Run development: `npm run dev`
5. Run tests: `npm test`
6. Build production: `npm run build`

## API Structure

All API endpoints are prefixed with `/api/v1/`

### Main Routes:
- `/api/v1/auth` - Authentication (login, register, refresh)
- `/api/v1/users` - User management
- `/api/v1/pets` - Pet profiles
- `/api/v1/employees` - Employee/caregiver management
- `/api/v1/services` - Service offerings
- `/api/v1/bookings` - Booking management
- `/api/v1/products` - Product catalog
- `/api/v1/orders` - Order processing
- `/api/v1/reminders` - Reminder management
- `/api/v1/breeding` - Breeding & adoption records
- `/api/v1/reviews` - Reviews and ratings
- `/api/v1/messages` - Messaging system
- `/api/v1/notifications` - Notifications
- `/api/v1/admin` - Admin operations

## Architecture Patterns

- **MVC Pattern:** Separation of concerns
- **Service Layer:** Business logic abstraction
- **Repository Pattern:** Data access abstraction
- **Middleware Chain:** Request processing pipeline
- **Error Handling:** Centralized error management
- **Validation:** Input validation at route level
- **Authentication:** JWT-based with refresh tokens
- **Authorization:** Role-based access control (RBAC)

## Security Measures

- JWT token authentication
- Password hashing (bcrypt)
- Request rate limiting
- CORS configuration
- Helmet security headers
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Environment variable management

## Development Guidelines

1. Follow ESLint configuration
2. Write unit tests for services
3. Write integration tests for routes
4. Document all APIs with Swagger
5. Use meaningful commit messages
6. Keep controllers thin, services fat
7. Handle errors properly
8. Log important events
9. Validate all inputs
10. Never commit sensitive data
