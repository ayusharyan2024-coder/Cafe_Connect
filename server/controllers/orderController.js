const Order = require('../models/Order');
const Menu = require('../models/Menu');

const orderController = {
    placeOrder: async (req, res) => {
        try {
            const { userId, items } = req.body; // items: [{ menuId, quantity }]

            // Calculate total and prepare order items
            let totalAmount = 0;
            const orderItems = [];

            for (const item of items) {
                const menuItem = await Menu.findById(item.menuId);
                if (!menuItem || !menuItem.available) {
                    return res.status(400).json({ message: `Item ${item.menuId} not available` });
                }

                const itemTotal = parseFloat(menuItem.price) * item.quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    menuId: menuItem._id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: item.quantity
                });
            }

            // Create order
            const order = new Order({
                userId,
                items: orderItems,
                totalAmount,
                status: 'Pending'
            });
            await order.save();

            res.status(201).json({
                message: 'Order placed successfully',
                order,
            });
        } catch (error) {
            console.error('Place order error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const { userId } = req.params;

            const orders = await Order.find({ userId })
                .populate('items.menuId')
                .sort({ createdAt: -1 });

            res.json(orders);
        } catch (error) {
            console.error('Get user orders error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find()
                .populate('userId', 'name email')
                .populate('items.menuId')
                .sort({ createdAt: -1 });

            res.json(orders);
        } catch (error) {
            console.error('Get all orders error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, estimatedTime } = req.body;

            const updateData = {};
            if (status) updateData.status = status;
            if (estimatedTime !== undefined) updateData.estimatedWaitTime = estimatedTime;

            const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json({
                message: 'Order updated successfully',
                order,
            });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ error: 'Failed to update order' });
        }
    },
};

module.exports = orderController;
