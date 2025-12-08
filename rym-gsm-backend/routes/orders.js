const express = require('express');
const jwt = require('jsonwebtoken');
const notificationService = require('../services/notificationService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user.id;

    // Get user's cart
    const [carts] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId]
    );

    if (carts.length === 0 || JSON.parse(carts[0].products).length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const cartProducts = JSON.parse(carts[0].products);
    let total = 0;

    // Validate stock and calculate total
    for (const item of cartProducts) {
      const [products] = await pool.execute(
        'SELECT stock, price FROM products WHERE id = ?',
        [item.productId]
      );

      if (products.length === 0) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }

      const product = products[0];
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}` 
        });
      }

      total += product.price * item.quantity;
    }

    // Create order
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, products, total, shipping_address) VALUES (?, ?, ?, ?)',
      [userId, JSON.stringify(cartProducts), total, shippingAddress || null]
    );

    // Update product stock
    for (const item of cartProducts) {
      await pool.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Clear cart
    await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    const orderId = result.insertId;

    // Notify user about order creation
    await notificationService.notifyOrderUpdate(userId, orderId, 'confirmed', total);

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        products: cartProducts,
        total,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Parse products JSON
    const formattedOrders = orders.map(order => ({
      ...order,
      products: JSON.parse(order.products)
    }));

    res.json({ orders: formattedOrders });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Get single order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    order.products = JSON.parse(order.products);

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// Get all orders (Admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
    `;
    const queryParams = [];

    if (status) {
      query += ' WHERE o.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), offset);

    const [orders] = await pool.execute(query, queryParams);

    // Parse products JSON
    const formattedOrders = orders.map(order => ({
      ...order,
      products: JSON.parse(order.products)
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders';
    const countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      orders: formattedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get order details before updating
    const [orders] = await pool.execute(
      'SELECT user_id, total FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    // Notify user about status change
    await notificationService.notifyOrderUpdate(order.user_id, id, status, order.total);

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

module.exports = router;
