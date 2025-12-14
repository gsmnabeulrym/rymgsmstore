const express = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
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
    const users = await query('SELECT id, role FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    req.user = { id: decoded.userId, role: users[0].role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Helper function to calculate average rating for a product
const calculateProductRating = async (productId) => {
  try {
    // Try with status column first, fallback to without
    let rows;
    try {
      rows = await query(
        "SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = 'approved'",
        [productId]
      );
    } catch (e) {
      // Fallback if status column doesn't exist
      rows = await query(
        "SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE product_id = ?",
        [productId]
      );
    }
    
    const result = rows[0];
    return {
      average: result.average ? parseFloat(result.average).toFixed(1) : 0,
      count: parseInt(result.count) || 0
    };
  } catch (error) {
    console.error('Error calculating product rating:', error);
    return { average: 0, count: 0 };
  }
};

// Helper function to get rating distribution
const getRatingDistribution = async (productId) => {
  try {
    // Try with status column first, fallback to without
    let rows;
    try {
      rows = await query(
        "SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = 'approved' GROUP BY rating",
        [productId]
      );
    } catch (e) {
      // Fallback if status column doesn't exist
      rows = await query(
        "SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = ? GROUP BY rating",
        [productId]
      );
    }
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rows.forEach(row => {
      distribution[row.rating] = row.count;
    });
    
    return distribution;
  } catch (error) {
    console.error('Error getting rating distribution:', error);
    return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  }
};

// GET /api/products/:productId/reviews - Get all approved reviews for a product
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'newest'; // newest, oldest, highest, lowest
    
    // Build sort clause
    let orderBy = 'r.created_at DESC'; // default: newest
    switch (sortBy) {
      case 'oldest':
        orderBy = 'r.created_at ASC';
        break;
      case 'highest':
        orderBy = 'r.rating DESC';
        break;
      case 'lowest':
        orderBy = 'r.rating ASC';
        break;
    }
    
    // Get reviews with user names
    const offset = (page - 1) * limit;
    const reviews = await query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? AND r.status = 'approved' 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `, [productId, limit, offset]);
    
    // Get total count for pagination
    const countResult = await query(
      "SELECT COUNT(*) as total FROM reviews WHERE product_id = ? AND status = 'approved'",
      [productId]
    );
    const totalReviews = countResult[0].total;
    
    // Calculate stats
    const stats = await calculateProductRating(productId);
    const distribution = await getRatingDistribution(productId);
    
    res.json({
      reviews: reviews,
      stats: {
        averageRating: parseFloat(stats.average),
        totalReviews: stats.count,
        distribution: distribution
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews: totalReviews,
        hasNext: offset + limit < totalReviews,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/products/:productId/reviews - Add a new review (authenticated users only)
router.post('/products/:productId/reviews', authenticateToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters long' });
    }
    
    // Check if user already reviewed this product
    const existingReviews = await query(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [productId, userId]
    );
    
    if (existingReviews.length > 0) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product. Each customer can only submit one review per product.' 
      });
    }
    
    // Insert new review into database
    const result = await query(
      'INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [productId, userId, parseInt(rating), comment.trim(), 'approved']
    );
    
    // Get the created review with user name
    const newReview = await query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      message: 'Review submitted successfully and is now visible!',
      review: newReview[0]
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reviews - Get all reviews (admin only)
router.get('/reviews', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const status = req.query.status; // pending, approved, rejected
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = '';
    let params = [];
    if (status) {
      whereClause = 'WHERE r.status = ?';
      params.push(status);
    }
    
    // Get reviews with user names and product names
    const reviews = await query(`
      SELECT r.*, u.name as user_name, p.name as product_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      JOIN products p ON r.product_id = p.id 
      ${whereClause}
      ORDER BY r.created_at DESC 
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total FROM reviews r ${whereClause}
    `, params);
    const totalReviews = countResult[0].total;
    
    // Get stats
    const statsResult = await query(`
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM reviews
    `);
    
    res.json({
      reviews: reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews: totalReviews,
        hasNext: offset + limit < totalReviews,
        hasPrev: page > 1
      },
      stats: statsResult[0]
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/reviews/:reviewId - Update review status (admin only)
router.put('/reviews/:reviewId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const reviewId = parseInt(req.params.reviewId);
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update review status
    const result = await query(
      'UPDATE reviews SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, reviewId]
    );
    
    const rowsAffected = result.rowCount || result.affectedRows || 0;
    if (rowsAffected === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Get updated review
    const updatedReview = await query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [reviewId]);
    
    res.json({
      message: 'Review status updated successfully',
      review: updatedReview[0]
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/reviews/:reviewId - Delete a review (admin only)
router.delete('/reviews/:reviewId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const reviewId = parseInt(req.params.reviewId);
    
    // Get review before deleting
    const reviewToDelete = await query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [reviewId]);
    
    if (reviewToDelete.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Delete review
    await query('DELETE FROM reviews WHERE id = ?', [reviewId]);
    
    res.json({
      message: 'Review deleted successfully',
      review: reviewToDelete[0]
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products/:productId/rating - Get product rating summary
router.get('/products/:productId/rating', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const stats = await calculateProductRating(productId);
    const distribution = await getRatingDistribution(productId);
    
    res.json({
      productId: productId,
      averageRating: parseFloat(stats.average),
      totalReviews: stats.count,
      distribution: distribution
    });
  } catch (error) {
    console.error('Error fetching product rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
