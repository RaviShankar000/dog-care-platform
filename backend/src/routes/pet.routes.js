/**
 * Pet Routes
 * Define pet management endpoints
 */

const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const petValidator = require('../validators/petValidator');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');

// All pet routes require authentication
router.use(protect);

// Pet CRUD operations
router
  .route('/')
  .post(
    validate(petValidator.createPet),
    petController.createPet
  )
  .get(petController.getMyPets);

router
  .route('/:id')
  .put(
    validate(petValidator.petId, 'params'),
    validate(petValidator.updatePet),
    petController.updatePet
  )
  .delete(
    validate(petValidator.petId, 'params'),
    petController.deletePet
  );

module.exports = router;
