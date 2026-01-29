/**
 * Booking Model
 * Mongoose schema for service bookings
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },

    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet is required']
    },

    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: ['GROOMING', 'WALKING', 'VET', 'TRAINING', 'BOARDING'],
        message: '{VALUE} is not a valid service type'
      }
    },

    serviceDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    date: {
      type: Date,
      required: [true, 'Booking date is required']
    },

    timeSlot: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: {
        values: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        message: '{VALUE} is not a valid booking status'
      },
      default: 'REQUESTED'
    },

    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// =================================
// INDEXES
// =================================
bookingSchema.index({ user: 1 });
bookingSchema.index({ pet: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ assignedEmployee: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
