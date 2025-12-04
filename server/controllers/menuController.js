const Menu = require('../models/Menu');

const menuController = {
    getAll: async (req, res) => {
        try {
            const { includeUnavailable, restaurantId } = req.query;
            const filter = includeUnavailable === 'true' ? {} : { available: true };

            // Filter by restaurant if provided
            if (restaurantId) {
                filter.restaurantId = restaurantId;
            }

            const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });
            res.json(menuItems);
        } catch (error) {
            console.error('Get menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { name, description, price, category, image, restaurantId } = req.body;

            // Validate restaurantId
            if (!restaurantId) {
                return res.status(400).json({
                    message: 'Restaurant ID is required. Please complete restaurant setup first.'
                });
            }

            const menuItem = new Menu({
                restaurantId,
                name,
                description,
                price,
                category,
                image: image || '/assets/burger.png'
            });
            await menuItem.save();
            res.status(201).json(menuItem);
        } catch (error) {
            console.error('Create menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const menuItem = await Menu.findByIdAndUpdate(id, updates, { new: true });
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            res.json(menuItem);
        } catch (error) {
            console.error('Update menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const menuItem = await Menu.findByIdAndDelete(id);

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            res.json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            console.error('Delete menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = menuController;
