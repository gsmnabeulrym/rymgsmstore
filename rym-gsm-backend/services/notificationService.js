const { pool } = require('../config/database');

class NotificationService {
  
  // Create a notification for specific user(s)
  async createNotification(userIds, type, title, message, data = {}) {
    try {
      // Ensure userIds is an array
      const users = Array.isArray(userIds) ? userIds : [userIds];
      
      for (const userId of users) {
        await pool.execute(
          'INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [userId, type, title, message, JSON.stringify(data)]
        );
      }
      
      console.log(`✅ Created ${type} notification for ${users.length} user(s): ${title}`);
      return true;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      return false;
    }
  }

  // Get all users who want specific notification type
  async getUsersForNotificationType(notificationType) {
    try {
      const [users] = await pool.execute(`
        SELECT u.id, u.name, u.email 
        FROM users u 
        LEFT JOIN notification_preferences np ON u.id = np.user_id 
        WHERE u.role = 'user' 
        AND (
          (? = 'new_product' AND (np.new_products = 1 OR np.new_products IS NULL))
          OR (? = 'promotion' AND (np.promotions = 1 OR np.promotions IS NULL))
          OR (? = 'order_update' AND (np.order_updates = 1 OR np.order_updates IS NULL))
          OR (? = 'stock_alert' AND (np.stock_alerts = 1 OR np.stock_alerts IS NULL))
          OR (? = 'price_drop' AND (np.price_drops = 1 OR np.price_drops IS NULL))
          OR ? = 'system'
        )
      `, [notificationType, notificationType, notificationType, notificationType, notificationType, notificationType]);
      
      return users;
    } catch (error) {
      console.error('❌ Error getting users for notification type:', error);
      return [];
    }
  }

  // Notify all users about new product
  async notifyNewProduct(productId, productName, brand, price, category) {
    try {
      console.log(`🔍 NotificationService: Starting notification for product ${productName}`);
      
      const users = await this.getUsersForNotificationType('new_product');
      console.log(`👥 Found ${users.length} users for new_product notifications:`, users.map(u => u.email));
      
      const userIds = users.map(user => user.id);
      
      if (userIds.length === 0) {
        console.log('ℹ️ No users to notify for new product');
        return;
      }

      console.log(`📨 Creating notifications for user IDs: ${userIds.join(', ')}`);
      
      const result = await this.createNotification(
        userIds,
        'new_product',
        '🆕 New Product Available!',
        `Check out the new ${productName} by ${brand}! Now available in our store starting at ${price} DT.`,
        { productId, productName, brand, price, category }
      );
      
      console.log(`✅ Notification creation result: ${result}`);
    } catch (error) {
      console.error('❌ Error notifying new product:', error);
      throw error; // Re-throw to see the error in product creation
    }
  }

  // Notify all users about promotions
  async notifyPromotion(title, message, discount = null, validUntil = null, productIds = []) {
    try {
      const users = await this.getUsersForNotificationType('promotion');
      const userIds = users.map(user => user.id);
      
      if (userIds.length === 0) {
        console.log('ℹ️ No users to notify for promotion');
        return;
      }

      await this.createNotification(
        userIds,
        'promotion',
        `🎉 ${title}`,
        message,
        { discount, validUntil, productIds, isPromotion: true }
      );
    } catch (error) {
      console.error('❌ Error notifying promotion:', error);
    }
  }

  // Notify user about order status changes
  async notifyOrderUpdate(userId, orderId, status, orderTotal = null) {
    try {
      let title, message;
      
      switch (status) {
        case 'confirmed':
          title = '✅ Order Confirmed';
          message = `Your order #${orderId} has been confirmed and is being processed. We'll notify you when it ships!`;
          break;
        case 'shipped':
          title = '🚚 Order Shipped';
          message = `Great news! Your order #${orderId} has been shipped and is on its way to you.`;
          break;
        case 'delivered':
          title = '📦 Order Delivered';
          message = `Your order #${orderId} has been delivered! Thank you for shopping with RYM GSM.`;
          break;
        case 'cancelled':
          title = '❌ Order Cancelled';
          message = `Your order #${orderId} has been cancelled. If you have any questions, please contact our support team.`;
          break;
        default:
          title = '📋 Order Update';
          message = `Your order #${orderId} status has been updated to: ${status}`;
      }

      await this.createNotification(
        userId,
        'order_update',
        title,
        message,
        { orderId, status, orderTotal }
      );
    } catch (error) {
      console.error('❌ Error notifying order update:', error);
    }
  }

  // Notify users about product modifications (price changes, stock updates)
  async notifyProductModification(productId, productName, modificationType, oldValue, newValue) {
    try {
      let users = [];
      let title, message, notificationType;

      if (modificationType === 'price_drop') {
        // Notify users who have this product in wishlist
        const [wishlistUsers] = await pool.execute(`
          SELECT DISTINCT u.id, u.name 
          FROM users u 
          JOIN wishlist w ON u.id = w.user_id 
          LEFT JOIN notification_preferences np ON u.id = np.user_id
          WHERE w.product_id = ? 
          AND (np.price_drops = 1 OR np.price_drops IS NULL)
        `, [productId]);
        
        users = wishlistUsers;
        notificationType = 'price_drop';
        title = '💰 Price Drop Alert!';
        message = `Great news! ${productName} price has dropped from ${oldValue} DT to ${newValue} DT. Don't miss out!`;
      } else if (modificationType === 'back_in_stock') {
        // Notify users who have this product in wishlist
        const [wishlistUsers] = await pool.execute(`
          SELECT DISTINCT u.id, u.name 
          FROM users u 
          JOIN wishlist w ON u.id = w.user_id 
          LEFT JOIN notification_preferences np ON u.id = np.user_id
          WHERE w.product_id = ? 
          AND (np.stock_alerts = 1 OR np.stock_alerts IS NULL)
        `, [productId]);
        
        users = wishlistUsers;
        notificationType = 'stock_alert';
        title = '📦 Back in Stock!';
        message = `${productName} is now back in stock! Get it before it runs out again.`;
      }

      if (users.length > 0) {
        const userIds = users.map(user => user.id);
        await this.createNotification(
          userIds,
          notificationType,
          title,
          message,
          { productId, productName, modificationType, oldValue, newValue }
        );
      }
    } catch (error) {
      console.error('❌ Error notifying product modification:', error);
    }
  }

  // Notify all users about system updates or important announcements
  async notifySystemUpdate(title, message, isUrgent = false) {
    try {
      const [allUsers] = await pool.execute('SELECT id FROM users WHERE role = "user"');
      const userIds = allUsers.map(user => user.id);
      
      if (userIds.length === 0) {
        console.log('ℹ️ No users to notify for system update');
        return;
      }

      const notificationTitle = isUrgent ? `🚨 URGENT: ${title}` : `📢 ${title}`;
      
      await this.createNotification(
        userIds,
        'system',
        notificationTitle,
        message,
        { isSystemUpdate: true, isUrgent }
      );
    } catch (error) {
      console.error('❌ Error notifying system update:', error);
    }
  }

  // Clean up old notifications (older than 30 days)
  async cleanupOldNotifications() {
    try {
      const [result] = await pool.execute(
        'DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)'
      );
      
      if (result.affectedRows > 0) {
        console.log(`🧹 Cleaned up ${result.affectedRows} old notifications`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up notifications:', error);
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const [totalStats] = await pool.execute('SELECT COUNT(*) as total FROM notifications');
      const [unreadStats] = await pool.execute('SELECT COUNT(*) as unread FROM notifications WHERE read_status = 0');
      const [typeStats] = await pool.execute(`
        SELECT type, COUNT(*) as count 
        FROM notifications 
        GROUP BY type 
        ORDER BY count DESC
      `);
      
      return {
        total: totalStats[0].total,
        unread: unreadStats[0].unread,
        byType: typeStats
      };
    } catch (error) {
      console.error('❌ Error getting notification stats:', error);
      return null;
    }
  }
}

module.exports = new NotificationService();
