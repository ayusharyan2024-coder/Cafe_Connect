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

        // Create menu items
        const menuItems = [
            { name: 'Espresso', category: 'Coffee', price: 2.50, description: 'Strong and bold', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', available: true },
            { name: 'Cappuccino', category: 'Coffee', price: 3.50, description: 'Creamy and smooth', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', available: true },
            { name: 'Latte', category: 'Coffee', price: 4.00, description: 'Mild and milky', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400', available: true },
            { name: 'Croissant', category: 'Pastry', price: 2.00, description: 'Buttery and flaky', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', available: true },
            { name: 'Blueberry Muffin', category: 'Pastry', price: 2.50, description: 'Fresh and fruity', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', available: true },
            { name: 'Chocolate Cake', category: 'Dessert', price: 4.50, description: 'Rich and decadent', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
            { name: 'Green Tea', category: 'Tea', price: 2.00, description: 'Refreshing and healthy', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', available: true },
            { name: 'Chai Latte', category: 'Tea', price: 3.00, description: 'Spiced and warming', image: 'https://images.unsplash.com/photo-1578899952107-9d9d1b0e0c00?w=400', available: true },
            { name: 'Bagel with Cream Cheese', category: 'Breakfast', price: 3.50, description: 'Classic breakfast', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', available: true },
            { name: 'Avocado Toast', category: 'Breakfast', price: 5.00, description: 'Healthy and delicious', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', available: true },
        ];

        await Menu.insertMany(menuItems);

        console.log('✅ Database seeded successfully!');
        console.log('Admin: admin@cafe.com / admin123');
        console.log('User: user@test.com / user123');
        console.log(`${menuItems.length} menu items created`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
