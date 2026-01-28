/**
 * Pet Controller
 * Handle pet-related HTTP requests
 */

const asyncHandler = require('../utils/asyncHandler');
const Pet = require('../models/Pet');
const ErrorResponse = require('../utils/errorResponse');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * @desc    Create a new pet
 * @route   POST /api/v1/pets
 * @access  Private
 */
exports.createPet = asyncHandler(async (req, res) => {
  // Automatically link pet to authenticated user
  // Prevent manual owner manipulation from request body
  req.body.owner = req.user._id;

  const pet = await Pet.create(req.body);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Pet created successfully',
    data: { pet }
  });
});

/**
 * @desc    Get all pets for the authenticated user
 * @route   GET /api/v1/pets
 * @access  Private
 */
exports.getMyPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id })
    .sort('-createdAt')
    .select('-__v');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    count: pets.length,
    data: { pets }
  });
});

/**
 * @desc    Update pet details
 * @route   PUT /api/v1/pets/:id
 * @access  Private
 */
exports.updatePet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format (already handled by validator, but extra safety check)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ErrorResponse('Invalid pet ID format', HTTP_STATUS.BAD_REQUEST);
  }

  // Find pet and verify ownership
  let pet = await Pet.findById(id);

  if (!pet) {
    throw new ErrorResponse('Pet not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure user owns the pet (enforce ownership validation)
  if (pet.owner.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(
      'Not authorized to update this pet',
      HTTP_STATUS.FORBIDDEN
    );
  }

  // Prevent changing the owner (pets remain linked to original user)
  delete req.body.owner;

  // Update pet
  pet = await Pet.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).select('-__v');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Pet updated successfully',
    data: { pet }
  });
});

/**
 * @desc    Delete a pet
 * @route   DELETE /api/v1/pets/:id
 * @access  Private
 */
exports.deletePet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format (already handled by validator, but extra safety check)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ErrorResponse('Invalid pet ID format', HTTP_STATUS.BAD_REQUEST);
  }

  // Find pet and verify ownership
  const pet = await Pet.findById(id);

  if (!pet) {
    throw new ErrorResponse('Pet not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure user owns the pet (enforce ownership validation)
  if (pet.owner.toString() !== req.user._id.toString()) {
    throw new ErrorResponse(
      'Not authorized to delete this pet',
      HTTP_STATUS.FORBIDDEN
    );
  }

  // Delete pet
  await pet.deleteOne();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Pet deleted successfully',
    data: {}
  });
});
