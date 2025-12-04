const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Create restaurant
router.post('/', restaurantController.createRestaurant);

// Get all restaurants
router.get('/', restaurantController.getRestaurants);

// Get single restaurant
router.get('/:id', restaurantController.getRestaurantById);

// Update restaurant
router.put('/:id', restaurantController.updateRestaurant);

// Delete restaurant
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;
