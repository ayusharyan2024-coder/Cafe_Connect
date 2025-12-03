const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Preparing', 'Ready', 'Completed'),
        defaultValue: 'Pending',
    },
    estimatedWaitTime: {
        type: DataTypes.INTEGER, // in minutes
    },
}, {
    timestamps: true,
});

module.exports = Order;
