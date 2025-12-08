const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const router = express.Router();

// Middleware to authenticate user
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, 'rym-gsm-secret-key-2024');
    
    // Get user details from database to include role
    const [users] = await pool.execute('SELECT id, role FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    req.user = { id: decoded.userId, role: users[0].role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// GET /api/wishlist - Get user's wishlist
router.get('/wishlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get wishlist items with product details
    const [wishlistItems] = await pool.execute(`
      SELECT w.*, p.name, p.price, p.images, p.brand, p.category, p.stock, p.description
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    // Parse images for each product
    const wishlist = wishlistItems.map(item => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      images: item.images ? item.images.split(',').map(img => img.trim()) : [],
      brand: item.brand,
      category: item.category,
      stock: item.stock,
      description: item.description,
      addedAt: item.created_at
    }));

    res.json({
      success: true,
      wishlist: wishlist,
      count: wishlist.length
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// POST /api/wishlist/add - Add product to wishlist
router.post('/wishlist/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Check if product exists
    const [products] = await pool.execute('SELECT id FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if product is already in wishlist
    const [existingItems] = await pool.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItems.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already in wishlist' 
      });
    }

    // Add to wishlist
    await pool.execute(
      'INSERT INTO wishlist (user_id, product_id, created_at) VALUES (?, ?, NOW())',
      [userId, productId]
    );

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove product from wishlist
router.delete('/wishlist/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Remove from wishlist
    const [result] = await pool.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found in wishlist' 
      });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });

  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// DELETE /api/wishlist/clear - Clear entire wishlist
router.delete('/wishlist/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Clear wishlist
    await pool.execute('DELETE FROM wishlist WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });

  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/wishlist/check/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [items] = await pool.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({
      success: true,
      inWishlist: items.length > 0
    });

  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// GET /api/wishlist/stats - Get wishlist statistics
router.get('/wishlist/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get wishlist stats
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalItems,
        SUM(p.price) as totalValue,
        AVG(p.price) as averagePrice
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `, [userId]);

    res.json({
      success: true,
      stats: {
        totalItems: stats[0].totalItems || 0,
        totalValue: parseFloat(stats[0].totalValue || 0).toFixed(2),
        averagePrice: parseFloat(stats[0].averagePrice || 0).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error fetching wishlist stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
