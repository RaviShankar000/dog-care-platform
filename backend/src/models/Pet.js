/**
 * Pet Model
 * Mongoose schema for pet profiles
 */

const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true
    },

    breed: {
      type: String,
      trim: true
    },

    age: {
      type: Number,
      min: [0, 'Age cannot be negative']
    },

    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pet must be linked to an owner']
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
petSchema.index({ owner: 1 });
petSchema.index({ name: 1 });
petSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Pet', petSchema);
