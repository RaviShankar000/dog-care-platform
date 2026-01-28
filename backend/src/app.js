/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Import middlewares
const { errorHandler } = require('./middlewares/errorHandler');
const { notFound } = require('./middlewares/notFound');

// Import routes
const routes = require('./routes');

// Initialize app
const app = express();

// =================================
// SECURITY MIDDLEWARE
// =================================
// Set security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// =================================
// BODY PARSERS
// =================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// =================================
// COMPRESSION
// =================================
app.use(compression());

// =================================
// LOGGING
// =================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// =================================
// API ROUTES
// =================================
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1', routes);

// =================================
// ERROR HANDLING
// =================================
// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
