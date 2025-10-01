const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/product');

router.post('/product/add', (req, res) => productController.addProduct(req, res));

router.get('/products', (req, res) => productController.getAllProducts(req, res));

router.get('/products/:id', (req, res) => productController.getProductById(req, res));

router.patch('/products/edit/:id', (req, res) => productController.updateProduct(req, res));

router.delete('/products/delete/:id', (req, res) => productController.deleteProduct(req, res));

module.exports = router;