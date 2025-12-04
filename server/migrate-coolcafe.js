const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Order = require('./models/Order');

const migrateToCoolCafe = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_connect');
        console.log('MongoDB connected successfully');

        // 1. Create Cool Cafe admin user
        let coolCafeAdmin = await User.findOne({ email: 'coolcafe@admin.com' });

        if (!coolCafeAdmin) {
            coolCafeAdmin = new User({
                name: 'Cool Cafe Admin',
                email: 'coolcafe@admin.com',
                password: 'coolcafe123',
                role: 'restaurant'
            });
            await coolCafeAdmin.save();
            console.log('✅ Cool Cafe admin user created');
        } else {
            console.log('ℹ️  Cool Cafe admin already exists');
        }

        // 2. Create Cool Cafe restaurant
        let coolCafe = await Restaurant.findOne({ name: 'Cool Cafe' });

        if (!coolCafe) {
            coolCafe = new Restaurant({
                name: 'Cool Cafe',
                ownerId: coolCafeAdmin._id,
                description: 'Your favorite neighborhood cafe serving delicious food and beverages',
                address: '123 Main Street, Downtown',
                phone: '+1 234 567 8900',
                image: '/assets/burger.png',
                isActive: true
            });
            await coolCafe.save();
            console.log('✅ Cool Cafe restaurant created');
        } else {
            console.log('ℹ️  Cool Cafe restaurant already exists');
        }

        // 3. Update admin user with restaurantId
        coolCafeAdmin.restaurantId = coolCafe._id;
        await coolCafeAdmin.save();
        console.log('✅ Linked admin user to Cool Cafe');

        // 4. Update all existing menu items with Cool Cafe restaurantId
        const menuUpdateResult = await Menu.updateMany(
            { restaurantId: { $exists: false } },
            { $set: { restaurantId: coolCafe._id } }
        );
        console.log(`✅ Updated ${menuUpdateResult.modifiedCount} menu items with Cool Cafe restaurantId`);

        // 5. Update all existing orders with Cool Cafe restaurantId
        const orderUpdateResult = await Order.updateMany(
            { restaurantId: { $exists: false } },
            { $set: { restaurantId: coolCafe._id } }
        );
        console.log(`✅ Updated ${orderUpdateResult.modifiedCount} orders with Cool Cafe restaurantId`);

        console.log('\n🎉 Migration completed successfully!');
        console.log('\nCool Cafe Credentials:');
        console.log('Email: coolcafe@admin.com');
        console.log('Password: coolcafe123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};

migrateToCoolCafe();
