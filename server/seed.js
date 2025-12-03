const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Menu = require('./models/Menu');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Menu.deleteMany({});

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@cafe.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();

        // Create test user
        const user = new User({
            name: 'Test User',
            email: 'user@test.com',
            password: 'user123',
            role: 'user'
        });
        await user.save();

        // Create 25 menu items (5 categories x 5 items)
        const categories = ['Coffee', 'Tea', 'Pastry', 'Desserts', 'Snacks'];
        const defaultImage = '/assets/burger.png';

        const menuItems = [
            // Coffee
            { name: 'Espresso', category: 'Coffee', price: 150, description: 'Strong and bold coffee shot.', image: defaultImage },
            { name: 'Cappuccino', category: 'Coffee', price: 200, description: 'Espresso with steamed milk foam.', image: defaultImage },
            { name: 'Latte', category: 'Coffee', price: 220, description: 'Espresso with steamed milk.', image: defaultImage },
            { name: 'Mocha', category: 'Coffee', price: 240, description: 'Chocolate flavored warm coffee.', image: defaultImage },
            { name: 'Americano', category: 'Coffee', price: 180, description: 'Diluted espresso with hot water.', image: defaultImage },

            // Tea
            { name: 'Masala Chai', category: 'Tea', price: 50, description: 'Spiced Indian tea with milk.', image: defaultImage },
            { name: 'Green Tea', category: 'Tea', price: 80, description: 'Healthy antioxidant-rich tea.', image: defaultImage },
            { name: 'Lemon Tea', category: 'Tea', price: 70, description: 'Refreshing tea with lemon zest.', image: defaultImage },
            { name: 'Earl Grey', category: 'Tea', price: 100, description: 'Black tea flavored with bergamot.', image: defaultImage },
            { name: 'Iced Tea', category: 'Tea', price: 120, description: 'Chilled tea with lemon and mint.', image: defaultImage },

            // Pastry
            { name: 'Butter Croissant', category: 'Pastry', price: 120, description: 'Flaky and buttery crescent roll.', image: defaultImage },
            { name: 'Chocolate Muffin', category: 'Pastry', price: 100, description: 'Rich chocolate muffin.', image: defaultImage },
            { name: 'Blueberry Danish', category: 'Pastry', price: 140, description: 'Pastry topped with blueberries.', image: defaultImage },
            { name: 'Cinnamon Roll', category: 'Pastry', price: 110, description: 'Sweet roll with cinnamon swirl.', image: defaultImage },
            { name: 'Apple Pie', category: 'Pastry', price: 150, description: 'Classic pie with spiced apple filling.', image: defaultImage },

            // Desserts
            { name: 'Chocolate Brownie', category: 'Desserts', price: 130, description: 'Fudgy brownie with walnuts.', image: defaultImage },
            { name: 'Cheesecake', category: 'Desserts', price: 200, description: 'Creamy cheesecake slice.', image: defaultImage },
            { name: 'Tiramisu', category: 'Desserts', price: 220, description: 'Coffee-flavored Italian dessert.', image: defaultImage },
            { name: 'Ice Cream Sundae', category: 'Desserts', price: 180, description: 'Vanilla ice cream with toppings.', image: defaultImage },
            { name: 'Fruit Tart', category: 'Desserts', price: 160, description: 'Pastry shell with custard and fruit.', image: defaultImage },

            // Snacks
            { name: 'Veg Burger', category: 'Snacks', price: 150, description: 'Classic vegetable burger.', image: defaultImage },
            { name: 'French Fries', category: 'Snacks', price: 100, description: 'Crispy salted potato fries.', image: defaultImage },
            { name: 'Club Sandwich', category: 'Snacks', price: 180, description: 'Triple-layer grilled sandwich.', image: defaultImage },
            { name: 'Paneer Wrap', category: 'Snacks', price: 160, description: 'Spiced paneer in a soft roll.', image: defaultImage },
            { name: 'Garlic Bread', category: 'Snacks', price: 120, description: 'Toasted bread with garlic butter.', image: defaultImage },
        ];

        // Add available: true to all items
        const itemsWithAvailability = menuItems.map(item => ({ ...item, available: true }));

        await Menu.insertMany(itemsWithAvailability);

        console.log('✅ Database seeded successfully!');
        console.log('Admin: admin@cafe.com / admin123');
        console.log('User: user@test.com / user123');
        console.log(`${itemsWithAvailability.length} menu items created`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
