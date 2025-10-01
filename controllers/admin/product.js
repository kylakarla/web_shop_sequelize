const Product = require('../../models/product');

class adminController {

    async addProduct(req, res) {
        const product = await Product.create({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        })
        res.status(201).json({
            message: 'Product has been added',
            productId: product.id
        })
    }

    async getAllProducts(req, res) {
        const products = await Product.findAll();
        res.status(201).json({
            products: products
        });
    }

    async getProductById(req, res) {
        const product = await Product.findByPk(req.params.id);
        res.status(201).json({
            product: product
        });
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updatedData = {
                title: req.body.title,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description
            };

            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await product.update(updatedData);

            res.status(200).json({
                message: 'Product has been updated successfully',
                product: product
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'An error occurred while updating the product' });
        }
    }

    async deleteProduct(req, res) {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        await product.destroy();
        res.status(200).json({
            message: 'Product has been deleted successfully'
        });
    }
}

    module.exports = new adminController();