const { Order, OrderItem, Menu, User } = require('../models');

const orderController = {
    placeOrder: async (req, res) => {
        try {
            const { userId, items } = req.body; // items: [{ menuId, quantity }]

            // Calculate total
            let totalAmount = 0;
            const orderItems = [];

            for (const item of items) {
                const menuItem = await Menu.findByPk(item.menuId);
                if (!menuItem || !menuItem.available) {
                    return res.status(400).json({ message: `Item ${item.menuId} not available` });
                }

                const itemTotal = parseFloat(menuItem.price) * item.quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    menuId: item.menuId,
                    quantity: item.quantity,
                    price: menuItem.price,
                });
            }

            // Create order
            const order = await Order.create({
                userId,
                totalAmount,
                status: 'Pending',
            });

            // Create order items
            for (const item of orderItems) {
                await OrderItem.create({
                    orderId: order.id,
                    ...item,
                });
            }

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

            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        include: [Menu],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(orders);
        } catch (error) {
            console.error('Get user orders error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [Menu],
                    },
                    {
                        model: User,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

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

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Update status
            if (status) {
                order.status = status;
            }

            // Update estimated time if provided
            if (estimatedTime !== undefined) {
                order.estimatedWaitTime = estimatedTime;
            }

            await order.save();

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
