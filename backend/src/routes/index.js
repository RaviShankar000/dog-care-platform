/**
 * Main Routes Index
 * Combines all API routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const petRoutes = require('./pet.routes');
// const userRoutes = require('./user.routes');
// const employeeRoutes = require('./employee.routes');
// const serviceRoutes = require('./service.routes');
// const bookingRoutes = require('./booking.routes');
// const productRoutes = require('./product.routes');
// const orderRoutes = require('./order.routes');
// const reminderRoutes = require('./reminder.routes');
// const breedingRoutes = require('./breeding.routes');
// const reviewRoutes = require('./review.routes');
// const messageRoutes = require('./message.routes');
// const notificationRoutes = require('./notification.routes');
// const paymentRoutes = require('./payment.routes');
// const adminRoutes = require('./admin.routes');

// API version info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dog Care Platform API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      pets: '/api/v1/pets',
      employees: '/api/v1/employees',
      services: '/api/v1/services',
      bookings: '/api/v1/bookings',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      reminders: '/api/v1/reminders',
      breeding: '/api/v1/breeding',
      reviews: '/api/v1/reviews',
      messages: '/api/v1/messages',
      notifications: '/api/v1/notifications',
      payments: '/api/v1/payments',
      admin: '/api/v1/admin'
    }
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
// router.use('/users', userRoutes);
// router.use('/employees', employeeRoutes);
// router.use('/services', serviceRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);
// router.use('/reminders', reminderRoutes);
// router.use('/breeding', breedingRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/messages', messageRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/admin', adminRoutes);

module.exports = router;
