const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

class shopController {

    async getAllProducts(req, res) {
        const products = await Product.findAll();
        console.log(products);
        res.status(201).json({
            products: products
        });
    }

    async getCart(req, res) {
        const userCart = await req.user.getCart();
        console.log(userCart);
        const cartProducts = await userCart.getProducts();
        res.status(201).json({
            products: cartProducts
        })
    }

    async addProduct(req, res) {
        try {
            const productId = req.params.productId;
            const userId = req.user.id; // Assuming the user is authenticated and user ID is available

            // Fetch the user and associated cart
            const user = await User.findByPk(userId, { include: ['cart'] }); // Ensure User is associated with Cart
            const cart = await user.getCart();

            // Fetch the product by ID
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Check if the product is already in the cart
            const cartProducts = await cart.getProducts({ where: { id: productId } });

            if (cartProducts.length > 0) {
                // Product already exists in the cart
                const cartProduct = cartProducts[0];
                const updatedQuantity = cartProduct.cartItem.quantity + 1; // Increment quantity
                console.log('Product already exists in cart, increasing quantity by 1');

                // Update the junction table (CartItem)
                await cartProduct.cartItem.update({ quantity: updatedQuantity });
            } else {
                // If the product does not exist in the cart, add it
                await cart.addProduct(product, { through: { quantity: 1 } });
            }

            res.status(200).json({ message: 'Product added to cart' });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ message: 'An error occurred while adding the product to the cart' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.productId; // Extract product ID from URL parameters
            const userId = req.user.id; // Assuming the user is authenticated and user ID is available

            // Fetch the user and their associated cart
            const user = await User.findByPk(userId, { include: ['cart'] });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const cart = await user.getCart();

            // Check if the product is in the cart
            const cartProducts = await cart.getProducts({ where: { id: productId } });
            if (cartProducts.length === 0) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            // Remove the product from the cart
            const product = cartProducts[0];
            await product.cartItem.destroy(); // Deletes the entry in the CartItem table

            res.status(200).json({ message: 'Product removed from cart successfully' });
        } catch (error) {
            console.error('Error removing product from cart:', error);
            res.status(500).json({ message: 'An error occurred while removing the product from the cart' });
        }
    }
}

    module.exports = new shopController();