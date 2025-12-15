const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const notificationService = require('../services/notificationService');
const { query } = require('../config/database');

const router = express.Router();

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rym-gsm-secret-key-2024');
    
    // Get user details from database
    const users = await query('SELECT id, role FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = { id: decoded.userId, role: users[0].role };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// GET /api/admin/notifications/all - Get all notifications
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const { search, type, page = 1, limit = 50 } = req.query;
    
    // Get the first user ID to use as "All Users" identifier
    const usersForId = await query('SELECT id FROM users ORDER BY id LIMIT 1');
    const allUsersId = usersForId.length > 0 ? usersForId[0].id : null;
    
    let sqlQuery = `
      SELECT 
        n.*,
        CASE 
          WHEN n.user_id = ? THEN 'All Users'
          ELSE u.name 
        END as user_name,
        CASE 
          WHEN n.user_id = ? THEN 'admin@system'
          ELSE u.email 
        END as user_email
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE 1=1
    `;
    const queryParams = [allUsersId, allUsersId]; // For the two CASE statements
    
    if (search) {
      sqlQuery += ' AND (n.title LIKE ? OR n.message LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (type) {
      sqlQuery += ' AND n.type = ?';
      queryParams.push(type);
    }
    
    sqlQuery += ' ORDER BY n.created_at DESC';
    
    const offset = (page - 1) * limit;
    sqlQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), offset);
    
    const notifications = await query(sqlQuery, queryParams);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE 1=1';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (title LIKE ? OR message LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }
    
    const countResult = await query(countQuery, countParams);
    
    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult[0].total / limit),
        totalNotifications: countResult[0].total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
});

// GET /api/admin/notifications/products - Get products for promotion selection
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const { search } = req.query;
    
    let sqlQuery = 'SELECT id, name, brand, price, category, images FROM products WHERE 1=1';
    const params = [];
    
    if (search) {
      sqlQuery += ' AND (name LIKE ? OR brand LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    sqlQuery += ' ORDER BY name ASC LIMIT 50';
    
    const products = await query(sqlQuery, params);
    
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: parseFloat(product.price),
      category: product.category,
      image: (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []))[0] || null
    }));
    
    res.json({
      success: true,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products for promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
});

// GET /api/admin/notifications/stats - Get notification statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalResult = await query('SELECT COUNT(*) as total FROM notifications');
    const promotionsResult = await query("SELECT COUNT(*) as promotions FROM notifications WHERE type = 'promotion'");
    const usersResult = await query('SELECT COUNT(DISTINCT user_id) as users FROM notifications');
    const monthResult = await query(`
      SELECT COUNT(*) as thisMonth 
      FROM notifications 
      WHERE created_at >= NOW() - INTERVAL '1 MONTH'
    `);
    
    const typeStats = await query(`
      SELECT type, COUNT(*) as count 
      FROM notifications 
      GROUP BY type 
      ORDER BY count DESC
    `);
    
    res.json({
      success: true,
      total: totalResult[0].total,
      promotions: promotionsResult[0].promotions,
      usersNotified: usersResult[0].users,
      thisMonth: monthResult[0].thisMonth,
      byType: typeStats
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
});

// POST /api/admin/notifications - Create new notification/promotion
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { type, title, message, targetUsers = 'all', data = {} } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and message are required'
      });
    }
    
    console.log('🎯 Admin creating notification:', { type, title, targetUsers, data });
    console.log('🔍 Backend data check:', {
      hasProductId: !!data.productId,
      productId: data.productId,
      hasSalePrice: !!data.salePrice,
      salePrice: data.salePrice,
      condition: !!(data.productId && data.salePrice)
    });
    
    if (type === 'promotion') {
      // Handle product promotion with price update
      if (data.productId && data.salePrice) {
        console.log('🏷️ Updating product price for promotion...');
        
        // Get current product details
        const productRows = await query(
          'SELECT id, name, brand, price, original_price, images FROM products WHERE id = ?',
          [data.productId]
        );
        
        if (productRows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Product not found'
          });
        }
        
        const product = productRows[0];
        console.log('🔍 Product found:', product);
        
        const currentPrice = parseFloat(product.price);
        const newPrice = parseFloat(data.salePrice);
        
        console.log('🔍 Price calculation:', { currentPrice, newPrice });
        
        // Use existing original_price if it exists, otherwise use current price
        const originalPrice = product.original_price ? parseFloat(product.original_price) : currentPrice;
        
        console.log('🔍 Original price determined:', originalPrice);
        
        const savings = (originalPrice - newPrice).toFixed(2);
        const discountPercent = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
        
        // Update product price and set original_price if not already set
        if (!product.original_price) {
          await query(
            'UPDATE products SET price = ?, original_price = ? WHERE id = ?',
            [newPrice, currentPrice, data.productId]
          );
        } else {
          await query(
            'UPDATE products SET price = ? WHERE id = ?',
            [newPrice, data.productId]
          );
        }
        
        // Create enhanced notification data
        const enhancedData = {
          ...data,
          productId: product.id,
          productName: product.name,
          productBrand: product.brand,
          productImage: JSON.parse(product.images || '[]')[0] || null,
          originalPrice,
          salePrice: newPrice,
          savings,
          discount: discountPercent,
          isPromotion: true
        };
        
        console.log('🔍 Enhanced data being saved:', JSON.stringify(enhancedData, null, 2));
        
        // Create custom promotion message
        const promotionMessage = `${message}\n\n🏷️ ${product.brand} ${product.name}\n💰 ${originalPrice} Dt → ${newPrice} Dt\n💸 Save ${savings} Dt (${discountPercent}% off!)`;
        
        // Create notifications for ALL users efficiently
        await query(
          'INSERT INTO notifications (user_id, type, title, message, data, created_at) SELECT id, ?, ?, ?, ?, NOW() FROM users',
          ['promotion', `🎉 ${title}`, promotionMessage, JSON.stringify(enhancedData)]
        );
        
        console.log(`✅ Created promotion notifications for all users`);
        
        console.log('✅ Product promotion created successfully');
        
        res.status(201).json({
          success: true,
          message: 'Notification created successfully'
        });
        return; // Exit here to prevent duplicate notification creation
        
      } else {
        // Regular promotion without specific product - create for all users
        await query(
          'INSERT INTO notifications (user_id, type, title, message, data, created_at) SELECT id, ?, ?, ?, ?, NOW() FROM users',
          ['promotion', `🎉 ${title}`, message, JSON.stringify(data)]
        );
        
        console.log(`✅ Created general promotion notifications for all users`);
      }
    } else if (type === 'system') {
      // Create system notification for all users
      await query(
        'INSERT INTO notifications (user_id, type, title, message, data, created_at) SELECT id, ?, ?, ?, ?, NOW() FROM users',
        ['system', `📢 ${title}`, message, JSON.stringify(data)]
      );
      
      console.log(`✅ Created system notifications for all users`);
    } else {
      // Create notification for all users (for other notification types)
      await query(
        'INSERT INTO notifications (user_id, type, title, message, data, created_at) SELECT id, ?, ?, ?, ?, NOW() FROM users',
        [type, title, message, JSON.stringify(data)]
      );
      
      console.log(`✅ Created ${type} notifications for all users`);
    }
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating notification'
    });
  }
});

// Send promotional notification to all users
router.post('/promotion', authenticateAdmin, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('discount').optional().isNumeric().withMessage('Discount must be a number'),
  body('validUntil').optional().isISO8601().withMessage('Valid until must be a valid date'),
  body('productIds').optional().isArray().withMessage('Product IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, discount, validUntil, productIds } = req.body;

    await notificationService.notifyPromotion(title, message, discount, validUntil, productIds);

    res.json({ 
      message: 'Promotional notification sent successfully',
      details: { title, message, discount, validUntil, productIds }
    });

  } catch (error) {
    console.error('Send promotion notification error:', error);
    res.status(500).json({ message: 'Server error sending notification' });
  }
});

// POST /api/admin/notifications/:id/end-promotion - End promotion and restore original price
router.post('/:id/end-promotion', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get notification details
    const notifications = await query(
      "SELECT * FROM notifications WHERE id = ? AND type = 'promotion'",
      [parseInt(id)]
    );
    
    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Promotion notification not found'
      });
    }
    
    const notification = notifications[0];
    const data = JSON.parse(notification.data || '{}');
    
    console.log('🔍 Ending promotion - notification data:', data);
    
    if (data.productId) {
      // Get product details
      const productRows = await query(
        'SELECT id, name, brand, price, original_price FROM products WHERE id = ?',
        [data.productId]
      );
      
      if (productRows.length > 0 && productRows[0].original_price) {
        const product = productRows[0];
        const originalPrice = parseFloat(product.original_price);
        
        // Restore original price
        await query(
          'UPDATE products SET price = ?, original_price = NULL WHERE id = ?',
          [originalPrice, data.productId]
        );
        
        console.log(`✅ Promotion ended for ${product.name}, price restored to ${originalPrice} Dt`);
        
        // Mark notification as ended (you could add an 'ended' status column)
        await query(
          'UPDATE notifications SET data = ? WHERE id = ?',
          [JSON.stringify({ ...data, ended: true, endedAt: new Date().toISOString() }), parseInt(id)]
        );
        
        res.json({
          success: true,
          message: `Promotion ended successfully. ${product.name} price restored to ${originalPrice} Dt`,
          product: {
            id: product.id,
            name: product.name,
            restoredPrice: originalPrice
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No original price found to restore'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'This promotion is not linked to a specific product'
      });
    }
  } catch (error) {
    console.error('Error ending promotion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error ending promotion'
    });
  }
});

// DELETE /api/admin/notifications/:id - Delete notification
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM notifications WHERE id = ?', [parseInt(id)]);
    
    const rowsAffected = result.rowCount || result.affectedRows || 0;
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting notification'
    });
  }
});

module.exports = router;
