const bcrypt = require('bcryptjs');

// Mock data storage (in-memory)
let users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@cafe.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: 'Test User',
        email: 'user@test.com',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

let menuItems = [
    { id: 1, name: 'Espresso', category: 'Coffee', price: 2.50, description: 'Strong and bold', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', available: true },
    { id: 2, name: 'Cappuccino', category: 'Coffee', price: 3.50, description: 'Creamy and smooth', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', available: true },
    { id: 3, name: 'Latte', category: 'Coffee', price: 4.00, description: 'Mild and milky', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400', available: true },
    { id: 4, name: 'Croissant', category: 'Pastry', price: 2.00, description: 'Buttery and flaky', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', available: true },
    { id: 5, name: 'Blueberry Muffin', category: 'Pastry', price: 2.50, description: 'Fresh and fruity', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', available: true },
    { id: 6, name: 'Chocolate Cake', category: 'Dessert', price: 4.50, description: 'Rich and decadent', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', available: true },
    { id: 7, name: 'Green Tea', category: 'Tea', price: 2.00, description: 'Refreshing and healthy', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', available: true },
    { id: 8, name: 'Chai Latte', category: 'Tea', price: 3.00, description: 'Spiced and warming', image: 'https://images.unsplash.com/photo-1578899952107-9d9d1b0e0c00?w=400', available: true },
    { id: 9, name: 'Bagel with Cream Cheese', category: 'Breakfast', price: 3.50, description: 'Classic breakfast', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', available: true },
    { id: 10, name: 'Avocado Toast', category: 'Breakfast', price: 5.00, description: 'Healthy and delicious', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', available: true },
];

let orders = [];
let orderIdCounter = 1;

module.exports = {
    users,
    menuItems,
    orders,
    getNextOrderId: () => orderIdCounter++,
    getNextUserId: () => users.length + 1,
    getNextMenuId: () => Math.max(...menuItems.map(m => m.id), 0) + 1
};
