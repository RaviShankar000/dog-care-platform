/**
 * Refresh Token Model
 * Store refresh tokens for JWT authentication
 */

const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isRevoked: {
      type: Boolean,
      default: false
    },

    revokedAt: Date,

    replacedByToken: String,

    createdByIp: String,

    userAgent: String
  },
  {
    timestamps: true
  }
);

// =================================
// INDEXES
// =================================
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });
refreshTokenSchema.index({ isRevoked: 1 });

// =================================
// VIRTUAL FIELDS
// =================================
refreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

refreshTokenSchema.virtual('isActive').get(function () {
  return !this.isRevoked && !this.isExpired;
});

// =================================
// STATIC METHODS
// =================================

/**
 * Find active refresh token
 * @param {String} token - Refresh token
 * @returns {Promise<Object>} Refresh token document
 */
refreshTokenSchema.statics.findActiveToken = function (token) {
  return this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: Date.now() }
  });
};

/**
 * Revoke token
 * @param {String} token - Refresh token to revoke
 * @param {String} replacedByToken - New token that replaces this one
 * @returns {Promise<Object>} Updated token document
 */
refreshTokenSchema.statics.revokeToken = async function (token, replacedByToken = null) {
  const refreshToken = await this.findOne({ token });
  
  if (!refreshToken) {
    throw new Error('Token not found');
  }

  refreshToken.isRevoked = true;
  refreshToken.revokedAt = Date.now();
  
  if (replacedByToken) {
    refreshToken.replacedByToken = replacedByToken;
  }

  await refreshToken.save();
  return refreshToken;
};

/**
 * Revoke all tokens for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Update result
 */
refreshTokenSchema.statics.revokeUserTokens = function (userId) {
  return this.updateMany(
    { userId, isRevoked: false },
    {
      $set: {
        isRevoked: true,
        revokedAt: Date.now()
      }
    }
  );
};

/**
 * Clean up expired tokens
 * @returns {Promise<Object>} Delete result
 */
refreshTokenSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    expiresAt: { $lt: Date.now() }
  });
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
