const express = require('express');
const router = express.Router();
const { Menu } = require('../models');

// Seed some initial menu items
const seedMenu = async () => {
    const count = await Menu.count();
    if (count === 0) {
        await Menu.bulkCreate([
            // Meals
            {
                name: 'Classic Burger',
                description: 'Juicy patty with fresh lettuce, tomatoes, and our secret sauce.',
                price: 120,
                category: 'Meals',
                imageUrl: '/assets/burger.png',
                available: true,
            },
            {
                name: 'Cheese Burger',
                description: 'Classic burger loaded with melted cheddar cheese.',
                price: 140,
                category: 'Meals',
                imageUrl: '/assets/burger.png',
                available: true,
            },
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
            // Beverages
            {
                name: 'Masala Chai',
                description: 'Authentic Indian tea brewed with aromatic spices.',
                price: 20,
                category: 'Beverages',
                imageUrl: '/assets/chai.png',
                available: true,
            },
            {
                name: 'Cappuccino',
                description: 'Rich espresso topped with frothy milk foam.',
                price: 150,
                category: 'Beverages',
                imageUrl: '/assets/coffee.png',
                available: true,
            },
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
            // Snacks
            {
                name: 'Steamed Momos',
                description: 'Delicate dumplings filled with seasoned vegetables, served with spicy chutney.',
                price: 80,
                category: 'Snacks',
                imageUrl: '/assets/momos.png',
                available: true,
            },
            {
                name: 'Fried Momos',
                description: 'Crispy fried dumplings for that extra crunch.',
                price: 90,
                category: 'Snacks',
                imageUrl: '/assets/momos.png',
                available: true,
            },
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
        ]);
        console.log('Menu seeded successfully with 20 items');
    }
};

// Call seed function
seedMenu();

module.exports = router;
