const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const carts = await query(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    if (carts.length === 0) {
      return res.json({ cart: { products: [], total: 0 } });
    }

    const cart = carts[0];
    cart.products = typeof cart.products === 'string' ? JSON.parse(cart.products) : (cart.products || []);

    // Calculate total
    let total = 0;
    for (const item of cart.products) {
      total += item.price * item.quantity;
    }

    res.json({ cart: { ...cart, total } });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    // Get product details
    const products = await query(
      'SELECT id, name, price, stock FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get existing cart
    const carts = await query(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    let cartProducts = [];
    if (carts.length > 0) {
      cartProducts = typeof carts[0].products === 'string' ? JSON.parse(carts[0].products) : (carts[0].products || []);
    }

    // Check if product already in cart
    const existingItemIndex = cartProducts.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cartProducts[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartProducts.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    // Save cart
    if (carts.length > 0) {
      await query(
        'UPDATE cart SET products = ? WHERE user_id = ?',
        [JSON.stringify(cartProducts), userId]
      );
    } else {
      await query(
        'INSERT INTO cart (user_id, products) VALUES (?, ?)',
        [userId, JSON.stringify(cartProducts)]
      );
    }

    res.json({ message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
});

// Update item quantity in cart
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity < 0) {
      return res.status(400).json({ message: 'Valid product ID and quantity required' });
    }

    // Get existing cart
    const carts = await query(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    if (carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let cartProducts = typeof carts[0].products === 'string' ? JSON.parse(carts[0].products) : (carts[0].products || []);
    const itemIndex = cartProducts.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cartProducts.splice(itemIndex, 1);
    } else {
      // Update quantity
      cartProducts[itemIndex].quantity = quantity;
    }

    // Save cart
    await query(
      'UPDATE cart SET products = ? WHERE user_id = ?',
      [JSON.stringify(cartProducts), userId]
    );

    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Get existing cart
    const carts = await query(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    if (carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let cartProducts = typeof carts[0].products === 'string' ? JSON.parse(carts[0].products) : (carts[0].products || []);
    const itemIndex = cartProducts.findIndex(item => item.productId === parseInt(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item
    cartProducts.splice(itemIndex, 1);

    // Save cart
    await query(
      'UPDATE cart SET products = ? WHERE user_id = ?',
      [JSON.stringify(cartProducts), userId]
    );

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
});

module.exports = router;
