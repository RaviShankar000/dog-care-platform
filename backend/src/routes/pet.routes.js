/**
 * Pet Routes
 * Define pet management endpoints
 */

const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { protect } = require('../middlewares/auth');

// All pet routes require authentication
router.use(protect);

// Pet CRUD operations
router
  .route('/')
  .post(petController.createPet)
  .get(petController.getMyPets);

router
  .route('/:id')
  .put(petController.updatePet)
  .delete(petController.deletePet);

module.exports = router;
