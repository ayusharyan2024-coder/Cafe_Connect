const { Menu } = require('../models');

const menuController = {
    getAll: async (req, res) => {
        try {
            const { includeUnavailable } = req.query;
            const whereClause = includeUnavailable === 'true' ? {} : { available: true };

            const menuItems = await Menu.findAll({
                where: whereClause,
                order: [['category', 'ASC'], ['name', 'ASC']],
            });
            res.json(menuItems);
        } catch (error) {
            console.error('Get menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { name, description, price, category, imageUrl } = req.body;
            const menuItem = await Menu.create({
                name,
                description,
                price,
                category,
                imageUrl,
            });
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

            const menuItem = await Menu.findByPk(id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            await menuItem.update(updates);
            res.json(menuItem);
        } catch (error) {
            console.error('Update menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const menuItem = await Menu.findByPk(id);

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            await menuItem.destroy();
            res.json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            console.error('Delete menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = menuController;
