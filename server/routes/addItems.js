const express = require('express');
const router = express.Router();
const { Menu } = require('../models');

// Add new menu items (can be called manually)
router.post('/add-new-items', async (req, res) => {
    try {
        const newItems = [
            // Additional Meals
            {
                name: 'Veg Sandwich',
                description: 'Fresh vegetables with mayo and cheese in toasted bread.',
                price: 80,
                category: 'Meals',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Paneer Wrap',
                description: 'Grilled paneer wrapped in soft tortilla with veggies.',
                price: 110,
                category: 'Meals',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Pizza Slice',
                description: 'Cheesy pizza slice with your choice of toppings.',
                price: 60,
                category: 'Meals',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            // Additional Beverages
            {
                name: 'Cold Coffee',
                description: 'Refreshing iced coffee with a hint of vanilla.',
                price: 100,
                category: 'Beverages',
                imageUrl: '/assets/coffee.png',
                available: true,
            },
            {
                name: 'Lemon Soda',
                description: 'Fizzy lemon drink perfect for hot days.',
                price: 40,
                category: 'Beverages',
                imageUrl: '/assets/chai.png',
                available: true,
            },
            {
                name: 'Mango Shake',
                description: 'Thick and creamy mango milkshake.',
                price: 90,
                category: 'Beverages',
                imageUrl: '/assets/coffee.png',
                available: true,
            },
            // Additional Snacks
            {
                name: 'Samosa',
                description: 'Crispy pastry filled with spiced potatoes and peas.',
                price: 25,
                category: 'Snacks',
                imageUrl: '/assets/momos.png',
                available: true,
            },
            {
                name: 'French Fries',
                description: 'Golden crispy fries with ketchup.',
                price: 70,
                category: 'Snacks',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Pav Bhaji',
                description: 'Spicy mashed vegetables served with buttered bread.',
                price: 100,
                category: 'Snacks',
                imageUrl: '/assets/momos.png',
                available: true,
            },
            // Desserts
            {
                name: 'Brownie',
                description: 'Rich chocolate brownie with vanilla ice cream.',
                price: 120,
                category: 'Desserts',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Ice Cream Sundae',
                description: 'Three scoops of ice cream with toppings.',
                price: 110,
                category: 'Desserts',
                imageUrl: '/assets/coffee.png',
                available: true,
            },
            {
                name: 'Gulab Jamun',
                description: 'Soft milk dumplings soaked in sweet syrup.',
                price: 50,
                category: 'Desserts',
                imageUrl: '/assets/momos.png',
                available: true,
            },
            {
                name: 'Chocolate Cake',
                description: 'Moist chocolate cake with chocolate frosting.',
                price: 130,
                category: 'Desserts',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Fruit Salad',
                description: 'Fresh seasonal fruits with honey dressing.',
                price: 80,
                category: 'Desserts',
                imageUrl: '/assets/chai.png',
                available: true,
            },
        ];

        // Check which items already exist
        const existingItems = await Menu.findAll({
            where: {
                name: newItems.map(item => item.name)
            }
        });

        const existingNames = existingItems.map(item => item.name);
        const itemsToAdd = newItems.filter(item => !existingNames.includes(item.name));

        if (itemsToAdd.length === 0) {
            return res.json({
                message: 'All items already exist in the menu',
                existingCount: existingItems.length
            });
        }

        const addedItems = await Menu.bulkCreate(itemsToAdd);

        res.json({
            message: 'New menu items added successfully',
            addedCount: addedItems.length,
            totalItems: await Menu.count(),
            addedItems: addedItems.map(item => ({ id: item.id, name: item.name }))
        });
    } catch (error) {
        console.error('Error adding new menu items:', error);
        res.status(500).json({ error: 'Failed to add new menu items' });
    }
});

module.exports = router;
