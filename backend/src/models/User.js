/**
 * User Model
 * Mongoose schema for users with authentication
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't return password by default
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.OWNER,
      required: true
    },

    profile: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
      },
      avatar: {
        type: String,
        default: null
      },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ['male', 'female', 'other']
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
          type: String,
          default: 'USA'
        },
        coordinates: {
          type: {
            type: String,
            default: 'Point'
          },
          coordinates: {
            type: [Number],
            default: undefined
          }
        }
      },
      bio: {
        type: String,
        maxlength: 500
      }
    },

    verification: {
      isEmailVerified: {
        type: Boolean,
        default: false
      },
      emailVerificationToken: String,
      emailVerificationExpires: Date,
      isPhoneVerified: {
        type: Boolean,
        default: false
      },
      isIdentityVerified: {
        type: Boolean,
        default: false
      }
    },

    security: {
      passwordResetToken: String,
      passwordResetExpires: Date,
      passwordChangedAt: Date,
      lastLogin: Date,
      loginAttempts: {
        type: Number,
        default: 0
      },
      lockUntil: Date,
      twoFactorEnabled: {
        type: Boolean,
        default: false
      },
      twoFactorSecret: String
    },

    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        }
      },
      language: {
        type: String,
        default: 'en'
      },
      timezone: {
        type: String,
        default: 'America/New_York'
      }
    },

    status: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active'
    },

    metadata: {
      registrationSource: {
        type: String,
        enum: ['web', 'mobile', 'admin']
      },
      referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      lastActive: Date
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'profile.address.coordinates': '2dsphere' });
userSchema.index({ createdAt: -1 });

// =================================
// VIRTUAL FIELDS
// =================================
userSchema.virtual('fullName').get(function () {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

userSchema.virtual('isLocked').get(function () {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// =================================
// MIDDLEWARE
// =================================

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set password changed timestamp
    if (!this.isNew) {
      this.security.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is created after password change
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.security.passwordResetToken;
  delete obj.security.twoFactorSecret;
  delete obj.verification.emailVerificationToken;
  return obj;
};

// =================================
// INSTANCE METHODS
// =================================

/**
 * Compare password with hashed password
 * @param {String} candidatePassword - Plain text password to compare
 * @returns {Promise<Boolean>} True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Check if password was changed after JWT was issued
 * @param {Number} JWTTimestamp - JWT issued at timestamp
 * @returns {Boolean} True if password was changed after JWT was issued
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.security.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.security.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Increment failed login attempts
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // If lock has expired, reset attempts
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        'security.loginAttempts': 1
      },
      $unset: {
        'security.lockUntil': 1
      }
    });
  }

  // Increment attempts and lock account if max attempts reached
  const updates = {
    $inc: {
      'security.loginAttempts': 1
    }
  };

  // Lock account after 5 failed attempts
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours

  if (this.security.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = {
      'security.lockUntil': Date.now() + lockTime
    };
  }

  return this.updateOne(updates);
};

/**
 * Reset login attempts after successful login
 */
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: {
      'security.loginAttempts': 0,
      'security.lastLogin': Date.now(),
      'metadata.lastActive': Date.now()
    },
    $unset: {
      'security.lockUntil': 1
    }
  });
};

// =================================
// STATIC METHODS
// =================================

/**
 * Find user by email with password field
 * @param {String} email - User email
 * @returns {Promise<Object>} User document
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

/**
 * Find active users by role
 * @param {String} role - User role
 * @returns {Promise<Array>} Array of user documents
 */
userSchema.statics.findActiveByRole = function (role) {
  return this.find({ role, status: 'active' });
};

module.exports = mongoose.model('User', userSchema);
