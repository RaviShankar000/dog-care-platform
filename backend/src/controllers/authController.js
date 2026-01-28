/**
 * Authentication Controller
 * Handle authentication HTTP requests
 */

const asyncHandler = require('../utils/asyncHandler');
const AuthService = require('../services/authService');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const requestInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    source: 'web'
  };

  const result = await AuthService.register(req.body, requestInfo);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const requestInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  const result = await AuthService.login(email, password, requestInfo);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken
    }
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Refresh token not provided'
    });
  }

  const requestInfo = {
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  const result = await AuthService.refreshAccessToken(refreshToken, requestInfo);

  // Set new refresh token in cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken
    }
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  await AuthService.logout(refreshToken);

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @desc    Logout from all devices
 * @route   POST /api/v1/auth/logout-all
 * @access  Private
 */
exports.logoutAll = asyncHandler(async (req, res) => {
  await AuthService.logoutAll(req.user.id);

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out from all devices'
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.user.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await AuthService.changePassword(req.user.id, currentPassword, newPassword);

  // Clear refresh token cookie (force re-login)
  res.clearCookie('refreshToken');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Password changed successfully. Please login again.'
  });
});
