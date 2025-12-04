const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    estimatedWaitTime: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
