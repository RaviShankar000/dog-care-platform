/**
 * 404 Not Found Handler
 * Handle undefined routes
 */

const ErrorResponse = require('../utils/errorResponse');
const HTTP_STATUS = require('../constants/httpStatus');

exports.notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  next(new ErrorResponse(message, HTTP_STATUS.NOT_FOUND));
};
