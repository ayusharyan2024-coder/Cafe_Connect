const mockData = require('../mockData');

const menuController = {
    getAll: async (req, res) => {
        try {
            const { includeUnavailable } = req.query;
            let menuItems = mockData.menuItems;

            if (includeUnavailable !== 'true') {
                menuItems = menuItems.filter(item => item.available);
            }

            // Sort by category then name
            menuItems.sort((a, b) => {
                if (a.category !== b.category) {
                    return a.category.localeCompare(b.category);
                }
                return a.name.localeCompare(b.name);
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
            const newItem = {
                id: mockData.getNextMenuId(),
                name,
                description,
                price,
                category,
                image: imageUrl,
                available: true
            };
            mockData.menuItems.push(newItem);
            res.status(201).json(newItem);
        } catch (error) {
            console.error('Create menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const menuItem = mockData.menuItems.find(item => item.id === parseInt(id));
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            Object.assign(menuItem, updates);
            res.json(menuItem);
        } catch (error) {
            console.error('Update menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const index = mockData.menuItems.findIndex(item => item.id === parseInt(id));

            if (index === -1) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            mockData.menuItems.splice(index, 1);
            res.json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            console.error('Delete menu error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = menuController;
