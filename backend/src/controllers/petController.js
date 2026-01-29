/**
 * Pet Controller
 * Handle pet-related HTTP requests
 */

const asyncHandler = require('../utils/asyncHandler');
const PetService = require('../services/petService');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * @desc    Create a new pet
 * @route   POST /api/v1/pets
 * @access  Private
 */
exports.createPet = asyncHandler(async (req, res) => {
  const pet = await PetService.createPet(req.body, req.user._id);

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
  const pets = await PetService.getUserPets(req.user._id);

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
  const pet = await PetService.updatePet(
    req.params.id,
    req.user._id,
    req.body
  );

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
  await PetService.deletePet(req.params.id, req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Pet deleted successfully',
    data: {}
  });
});
