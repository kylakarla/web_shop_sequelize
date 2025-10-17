const { Order, OrderItem, Cart } = require('../models');

class OrderController {
  // POST /orders
  // Body: { userId?: number } or use req.user.id if available
  async createOrder(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      // Get user's cart via association helpers
      const user = req.user || null;
      let cart;

      if (user?.getCart) {
        cart = await user.getCart();
      } else {
        // If req.user is not hydrated with helpers, fetch via models.User if needed
        const { User } = require('../models');
        const fetchedUser = await User.findByPk(userId, { include: ['cart'] });
        if (!fetchedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        cart = await fetchedUser.getCart();
      }

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Load products in the cart via many-to-many helper
      const cartProducts = await cart.getProducts();
      if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
        return res.status(404).json({ message: 'Cart is empty' });
      }

      // Compute totals and prepare order items
      let totalAmount = 0;
      let totalPrice = 0;

      const orderItemsData = cartProducts.map((p) => {
        const qty = Number(p.CartItem?.quantity || 0);
        const price = Number(p.price || 0);
        totalAmount += qty;
        totalPrice += qty * price;

        return {
          productId: p.id,
          quantity: qty,
          price
        };
      });

      // Create order
      const order = await Order.create({
        userId,
        totalAmount,
        totalPrice
      });

      // Persist order items
      await OrderItem.bulkCreate(
        orderItemsData.map(oi => ({
          orderId: order.id,
          productId: oi.productId,
          quantity: oi.quantity,
          price: oi.price
        }))
      );

      // Do NOT clear cart in DB. The app should clear its local state after success.
      return res.status(201).json({
        order: {
          id: order.id,
          userId,
          totalAmount,
          totalPrice,
          items: orderItemsData
        },
        message: 'Order created. Clear cart only in the app state.'
      });
    } catch (err) {
      console.error('createOrder error:', err);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  }

  async getUserOrders(req, res) {
      console.log(req.user);
      const userId = req.user.id;
      const orders = await Order.findAll({ where: { userId } });
      res.status(201).json({
          orders: orders
      });
  }
}

module.exports = new OrderController();