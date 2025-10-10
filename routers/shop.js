const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', (req, res) => shopController.getCart(req, res))

router.post('/cart/add/:productId', (req, res) => shopController.addProduct(req, res))

router.delete('/cart/delete/:productId', (req, res) => shopController.deleteProduct(req, res))

module.exports = router;