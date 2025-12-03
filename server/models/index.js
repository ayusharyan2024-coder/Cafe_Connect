const User = require('./User');
const Menu = require('./Menu');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Menu.hasMany(OrderItem, { foreignKey: 'menuId' });
OrderItem.belongsTo(Menu, { foreignKey: 'menuId' });

module.exports = {
    User,
    Menu,
    Order,
    OrderItem,
};
