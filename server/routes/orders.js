const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.placeOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/all', orderController.getAllOrders);
router.put('/:id', orderController.updateOrderStatus);

module.exports = router;
