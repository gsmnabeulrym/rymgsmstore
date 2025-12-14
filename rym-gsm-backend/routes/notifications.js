const express = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const router = express.Router();

// Simple test route without authentication
router.get('/test', (req, res) => {
  console.log('🧪 Test route hit!');
  res.json({ message: 'Notification routes are working!', timestamp: new Date().toISOString() });
});

// Middleware to authenticate user
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rym-gsm-secret-key-2024');
    
    // Get user details from database to include role
    const users = await query('SELECT id, role FROM users WHERE id = ?', [decoded.userId]);
    if (!users || users.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    req.user = { id: decoded.userId, role: users[0].role };
    next();
  } catch (error) {
    console.error('[Notifications Auth] Error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// GET /api/notifications - Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, type } = req.query;

    let sqlQuery = `
      SELECT * FROM notifications 
      WHERE user_id = ?
    `;
    const queryParams = [userId];

    if (type) {
      sqlQuery += ' AND type = ?';
      queryParams.push(type);
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const notifications = await query(sqlQuery, queryParams);

    res.json({
      success: true,
      notifications: notifications,
      count: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching notifications' 
    });
  }
});

// GET /api/notifications/preferences - Get user notification preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const preferences = await query(
      'SELECT * FROM notification_preferences WHERE user_id = ?',
      [userId]
    );

    if (preferences.length === 0) {
      // Create default preferences if none exist
      await query(
        'INSERT INTO notification_preferences (user_id, order_updates, stock_alerts, price_drops, new_products, promotions) VALUES (?, true, true, true, true, true)',
        [userId]
      );

      res.json({
        success: true,
        preferences: {
          order_updates: true,
          stock_alerts: true,
          price_drops: true,
          new_products: true,
          promotions: true
        }
      });
    } else {
      res.json({
        success: true,
        preferences: {
          order_updates: !!preferences[0].order_updates,
          stock_alerts: !!preferences[0].stock_alerts,
          price_drops: !!preferences[0].price_drops,
          new_products: !!preferences[0].new_products,
          promotions: !!preferences[0].promotions
        }
      });
    }

  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching preferences' 
    });
  }
});

// PUT /api/notifications/preferences - Update user notification preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_updates, stock_alerts, price_drops, new_products, promotions } = req.body;

    // Check if preferences exist
    const existing = await query('SELECT id FROM notification_preferences WHERE user_id = ?', [userId]);
    
    if (existing.length > 0) {
      await query(
        'UPDATE notification_preferences SET order_updates = ?, stock_alerts = ?, price_drops = ?, new_products = ?, promotions = ? WHERE user_id = ?',
        [!!order_updates, !!stock_alerts, !!price_drops, !!new_products, !!promotions, userId]
      );
    } else {
      await query(
        'INSERT INTO notification_preferences (user_id, order_updates, stock_alerts, price_drops, new_products, promotions) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, !!order_updates, !!stock_alerts, !!price_drops, !!new_products, !!promotions]
      );
    }

    res.json({
      success: true,
      message: 'Notification preferences updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating preferences' 
    });
  }
});

// PUT /api/notifications/:id/read - Mark specific notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      'UPDATE notifications SET read_status = true WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const rowsAffected = result.rowCount || result.affectedRows || 0;
    if (rowsAffected === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error marking notification as read' 
    });
  }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query(
      'UPDATE notifications SET read_status = true WHERE user_id = ? AND read_status = false',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error marking notifications as read' 
    });
  }
});

// DELETE /api/notifications/clear-all - Clear all notifications for user
router.delete('/clear-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all notifications for the user
    const result = await query(
      'DELETE FROM notifications WHERE user_id = ?',
      [userId]
    );

    const deletedCount = result.rowCount || result.affectedRows || 0;
    res.json({ 
      success: true, 
      message: `Cleared ${deletedCount} notifications`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error clearing notifications' 
    });
  }
});

// DELETE /api/notifications/:id - Delete specific notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Delete the notification (only if it belongs to the user)
    const result = await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const rowsAffected = result.rowCount || result.affectedRows || 0;
    if (rowsAffected === 0) {
      return res.status(404).json({ message: 'Notification not found' });
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

// POST /api/notifications - Create notification (admin or system)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, data = {} } = req.body;

    // Only admins can create notifications for other users
    if (req.user.role !== 'admin' && userId !== req.user.id) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    await query(
      'INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, type, title, message, JSON.stringify(data)]
    );

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

module.exports = router;
