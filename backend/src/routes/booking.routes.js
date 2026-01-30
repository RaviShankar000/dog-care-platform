/**
 * Booking Routes
 * Define booking management endpoints
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

// All booking routes require authentication
router.use(protect);

// Booking operations
router.post('/', bookingController.createBooking);

router.get('/my', bookingController.getMyBookings);

router.patch('/:id/status', bookingController.updateBookingStatus);

router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
