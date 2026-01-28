# Configuration Files

This directory contains all configuration files for the application.

## Files:

- `database.js` - MongoDB connection configuration
- `jwt.js` - JWT token configuration
- `cloudinary.js` - Cloudinary/S3 file storage configuration
- `email.js` - Email service configuration (SendGrid/Nodemailer)
- `payment.js` - Payment gateway configuration (Stripe/PayPal)
- `redis.js` - Redis cache configuration
- `logger.js` - Winston logger configuration
- `socket.js` - Socket.io configuration for real-time features
- `swagger.js` - Swagger/OpenAPI documentation setup

## Usage:

All configuration files export their respective configurations based on environment variables defined in `.env` file.

Example:
```javascript
const { connectDB } = require('./config/database');
```
