const mockData = require('../mockData');

const orderController = {
    placeOrder: async (req, res) => {
        try {
            const { userId, items } = req.body; // items: [{ menuId, quantity }]

            // Calculate total
            let totalAmount = 0;
            const orderItems = [];

            for (const item of items) {
                const menuItem = mockData.menuItems.find(m => m.id === item.menuId);
                if (!menuItem || !menuItem.available) {
                    return res.status(400).json({ message: `Item ${item.menuId} not available` });
                }

                const itemTotal = parseFloat(menuItem.price) * item.quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    menuId: item.menuId,
                    quantity: item.quantity,
                    price: menuItem.price,
                    Menu: menuItem // Include menu details for response
                });
            }

            // Create order
            const order = {
                id: mockData.getNextOrderId(),
                userId,
                totalAmount,
                status: 'Pending',
                estimatedWaitTime: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                OrderItems: orderItems
            };

            mockData.orders.push(order);

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

            const orders = mockData.orders
                .filter(order => order.userId === parseInt(userId))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            res.json(orders);
        } catch (error) {
            console.error('Get user orders error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const ordersWithUsers = mockData.orders.map(order => {
                const user = mockData.users.find(u => u.id === order.userId);
                return {
                    ...order,
                    User: user ? {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    } : null
                };
            }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            res.json(ordersWithUsers);
        } catch (error) {
            console.error('Get all orders error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, estimatedTime } = req.body;

            const order = mockData.orders.find(o => o.id === parseInt(id));

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

            order.updatedAt = new Date();

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
