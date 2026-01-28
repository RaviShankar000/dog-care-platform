/**
 * Authentication Routes
 * Define authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const { validate } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');
const rateLimit = require('../middlewares/rateLimit');

// Public routes
router.post(
  '/register',
  rateLimit.auth,
  validate(authValidator.register),
  authController.register
);

router.post(
  '/login',
  rateLimit.auth,
  validate(authValidator.login),
  authController.login
);

router.post(
  '/refresh',
  rateLimit.general,
  authController.refreshToken
);

// Protected routes (require authentication)
router.use(protect);

router.post('/logout', authController.logout);

router.post('/logout-all', authController.logoutAll);

router.get('/me', authController.getCurrentUser);

router.put(
  '/change-password',
  validate(authValidator.changePassword),
  authController.changePassword
);

module.exports = router;
