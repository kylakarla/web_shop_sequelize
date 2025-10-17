const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

router.post('/order/create', (req, res) => orderController.createOrder(req, res))

router.get('/order/:userId', (req, res) => orderController.getUserOrders(req, res))

module.exports = router;