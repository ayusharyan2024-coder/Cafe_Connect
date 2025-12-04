const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

const restaurantController = {
    // Create restaurant (called after restaurant owner signup)
    createRestaurant: async (req, res) => {
        try {
            const { name, description, address, phone, ownerId } = req.body;

            // Check if owner already has a restaurant
            const existingRestaurant = await Restaurant.findOne({ ownerId });
            if (existingRestaurant) {
                return res.status(400).json({ message: 'Owner already has a restaurant' });
            }

            const restaurant = new Restaurant({
                name,
                description,
                address,
                phone,
                ownerId,
                isActive: true
            });

            await restaurant.save();

            // Update user with restaurantId
            await User.findByIdAndUpdate(ownerId, { restaurantId: restaurant._id });

            res.status(201).json({
                message: 'Restaurant created successfully',
                restaurant
            });
        } catch (error) {
            console.error('Create restaurant error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get all active restaurants
    getRestaurants: async (req, res) => {
        try {
            const restaurants = await Restaurant.find({ isActive: true })
                .populate('ownerId', 'name email')
                .sort({ createdAt: -1 });

            res.json(restaurants);
        } catch (error) {
            console.error('Get restaurants error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get single restaurant by ID
    getRestaurantById: async (req, res) => {
        try {
            const { id } = req.params;

            const restaurant = await Restaurant.findById(id)
                .populate('ownerId', 'name email');

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            res.json(restaurant);
        } catch (error) {
            console.error('Get restaurant error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update restaurant
    updateRestaurant: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, address, phone, image } = req.body;

            const restaurant = await Restaurant.findByIdAndUpdate(
                id,
                { name, description, address, phone, image },
                { new: true }
            );

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            res.json({
                message: 'Restaurant updated successfully',
                restaurant
            });
        } catch (error) {
            console.error('Update restaurant error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Delete restaurant (soft delete)
    deleteRestaurant: async (req, res) => {
        try {
            const { id } = req.params;

            const restaurant = await Restaurant.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            res.json({
                message: 'Restaurant deleted successfully'
            });
        } catch (error) {
            console.error('Delete restaurant error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = restaurantController;
