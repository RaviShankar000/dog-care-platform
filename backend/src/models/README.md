# Mongoose Models

This directory contains all Mongoose schema definitions and models.

## Models:

- `User.js` - User model (owners, employees, admins)
- `Pet.js` - Pet/Dog profile model
- `Employee.js` - Employee/caregiver extended profile
- `Service.js` - Service offering model
- `Booking.js` - Booking and appointment model
- `Product.js` - Product catalog model
- `Order.js` - Order and transaction model
- `Reminder.js` - Reminder and notification scheduler model
- `BreedingRecord.js` - Breeding and adoption record model
- `Review.js` - Review and rating model
- `Message.js` - Messaging model
- `Notification.js` - Notification model
- `PaymentTransaction.js` - Payment transaction model
- `RefreshToken.js` - JWT refresh token model

## Model Structure:

Each model file should include:
1. Schema definition with validation rules
2. Virtual fields and computed properties
3. Instance methods
4. Static methods
5. Pre/post middleware hooks
6. Indexes for performance optimization
7. Schema options (timestamps, toJSON, toObject)

## Example Structure:
```javascript
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // field definitions
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
schema.index({ field: 1 });

// Virtual fields
schema.virtual('virtualField').get(function() {
  return this.someField;
});

// Instance methods
schema.methods.instanceMethod = function() {
  // logic
};

// Static methods
schema.statics.staticMethod = function() {
  // logic
};

// Middleware
schema.pre('save', function(next) {
  // logic
  next();
});

module.exports = mongoose.model('ModelName', schema);
```
