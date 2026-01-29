/**
 * Pet Service
 * Business logic for pet management
 */

const Pet = require('../models/Pet');
const ErrorResponse = require('../utils/errorResponse');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Create a new pet for a user
 * @param {Object} petData - Pet information
 * @param {String} userId - ID of the pet owner
 * @returns {Promise<Object>} Created pet
 */
exports.createPet = async (petData, userId) => {
  const pet = await Pet.create({
    ...petData,
    owner: userId
  });

  return pet;
};

/**
 * Get all pets for a specific user
 * @param {String} userId - ID of the pet owner
 * @returns {Promise<Array>} Array of pets
 */
exports.getUserPets = async (userId) => {
  const pets = await Pet.find({ owner: userId })
    .sort('-createdAt')
    .select('-__v');

  return pets;
};

/**
 * Find pet by ID and verify ownership
 * @param {String} petId - Pet ID
 * @param {String} userId - User ID to verify ownership
 * @returns {Promise<Object>} Pet document
 * @throws {ErrorResponse} If pet not found or user not authorized
 */
exports.findPetWithOwnership = async (petId, userId) => {
  // Validate ObjectId format
  if (!petId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ErrorResponse('Invalid pet ID format', HTTP_STATUS.BAD_REQUEST);
  }

  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new ErrorResponse('Pet not found', HTTP_STATUS.NOT_FOUND);
  }

  // Verify ownership
  if (pet.owner.toString() !== userId.toString()) {
    throw new ErrorResponse(
      'Not authorized to access this pet',
      HTTP_STATUS.FORBIDDEN
    );
  }

  return pet;
};

/**
 * Update pet details
 * @param {String} petId - Pet ID
 * @param {String} userId - User ID for ownership verification
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated pet
 */
exports.updatePet = async (petId, userId, updateData) => {
  // Verify ownership first
  await exports.findPetWithOwnership(petId, userId);

  // Remove owner from update data to prevent manipulation
  const { owner, ...safeUpdateData } = updateData;

  // Update pet
  const updatedPet = await Pet.findByIdAndUpdate(
    petId,
    safeUpdateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  return updatedPet;
};

/**
 * Delete a pet
 * @param {String} petId - Pet ID
 * @param {String} userId - User ID for ownership verification
 * @returns {Promise<void>}
 */
exports.deletePet = async (petId, userId) => {
  // Verify ownership
  const pet = await exports.findPetWithOwnership(petId, userId);

  // Delete pet
  await pet.deleteOne();
};
