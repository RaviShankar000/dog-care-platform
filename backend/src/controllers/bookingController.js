/**
 * Booking Controller
 * Handle booking-related HTTP requests
 */

const asyncHandler = require('../utils/asyncHandler');
const Booking = require('../models/Booking');
const Pet = require('../models/Pet');
const HTTP_STATUS = require('../constants/httpStatus');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Create a new booking
 * @route   POST /api/v1/bookings
 * @access  Private
 */
exports.createBooking = asyncHandler(async (req, res) => {
  const { pet: petId } = req.body;

  // Validate pet exists
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new ErrorResponse('Pet not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure pet belongs to logged-in user
  if (pet.owner.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(
      'Not authorized to book services for this pet',
      HTTP_STATUS.FORBIDDEN
    );
  }

  // Create booking
  const booking = await Booking.create({
    ...req.body,
    user: req.user._id
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking }
  });
});

/**
 * @desc    Get all bookings for the authenticated user
 * @route   GET /api/v1/bookings
 * @access  Private
 */
exports.getMyBookings = asyncHandler(async (req, res) => {
  // TODO: Add filtering, sorting, pagination
  // - Filter by status
  // - Filter by date range
  // - Sort by date

  const bookings = await Booking.find({ user: req.user._id })
    .populate('pet', 'name breed')
    .populate('assignedEmployee', 'fullName email')
    .sort('-date');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: bookings.length,
    data: { bookings }
  });
});

/**
 * @desc    Update booking status
 * @route   PUT /api/v1/bookings/:id/status
 * @access  Private
 */
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // TODO: Implement status update logic
  // - Verify ownership or employee authorization
  // - Validate status transition
  // - Send notifications

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ErrorResponse('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Basic ownership check
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(
      'Not authorized to update this booking',
      HTTP_STATUS.FORBIDDEN
    );
  }

  booking.status = status;
  await booking.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Booking status updated successfully',
    data: { booking }
  });
});

/**
 * @desc    Cancel a booking
 * @route   DELETE /api/v1/bookings/:id
 * @access  Private
 */
exports.cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // TODO: Implement cancellation logic
  // - Check cancellation policy
  // - Verify cancellation window
  // - Process refund if applicable

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ErrorResponse('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Basic ownership check
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(
      'Not authorized to cancel this booking',
      HTTP_STATUS.FORBIDDEN
    );
  }

  booking.status = 'CANCELLED';
  await booking.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking }
  });
});
