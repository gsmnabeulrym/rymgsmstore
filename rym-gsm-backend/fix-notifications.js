const mysql = require('mysql2/promise');

async function fixNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🔧 Fixing notification system...\n');

    // Get actual user IDs
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    console.log('👥 Found users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Create notification preferences for all users
    for (const user of users) {
      try {
        await connection.execute(
          'INSERT INTO notification_preferences (user_id, order_updates, stock_alerts, price_drops, new_products, promotions) VALUES (?, 1, 1, 1, 1, 1)',
          [user.id]
        );
        console.log(`✅ Created notification preferences for user ${user.id} (${user.name})`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          // Update existing preferences
          await connection.execute(
            'UPDATE notification_preferences SET new_products = 1, order_updates = 1, stock_alerts = 1, price_drops = 1, promotions = 1 WHERE user_id = ?',
            [user.id]
          );
          console.log(`✅ Updated notification preferences for user ${user.id} (${user.name})`);
        } else {
          console.error(`❌ Error creating preferences for user ${user.id}:`, error.message);
        }
      }
    }

    // Create test notifications for regular users (non-admin)
    const regularUsers = users.filter(user => user.role !== 'admin');
    
    for (const user of regularUsers) {
      // Create different types of test notifications
      const testNotifications = [
        {
          type: 'system',
          title: 'Welcome to RYM GSM!',
          message: 'Your notification system is now active. You\'ll receive updates about orders, new products, and special offers.',
          data: { welcome: true }
        },
        {
          type: 'new_product',
          title: 'New Product Available',
          message: 'Check out the latest iPhone 15 Pro Max now available in our store!',
          data: { productId: 1, productName: 'iPhone 15 Pro Max' }
        },
        {
          type: 'promotion',
          title: 'Special Offer - 20% Off!',
          message: 'Limited time offer: Get 20% off on all smartphones this weekend!',
          data: { discount: 20, validUntil: '2024-12-31' }
        }
      ];

      for (const notif of testNotifications) {
        await connection.execute(
          'INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
          [user.id, notif.type, notif.title, notif.message, JSON.stringify(notif.data)]
        );
      }
      
      console.log(`✅ Created test notifications for user ${user.id} (${user.name})`);
    }

    // Check final state
    const [finalNotifs] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    const [finalPrefs] = await connection.execute('SELECT COUNT(*) as count FROM notification_preferences');
    
    console.log('\n🎉 Notification system fixed!');
    console.log(`📊 Total notifications: ${finalNotifs[0].count}`);
    console.log(`⚙️ Total preferences: ${finalPrefs[0].count}`);
    
    console.log('\n🧪 Now test:');
    console.log('1. Login as john@example.com / password');
    console.log('2. Look for the notification bell in navbar');
    console.log('3. You should see a red badge with notification count');
    console.log('4. Click the bell to view notifications');

  } catch (error) {
    console.error('❌ Error fixing notifications:', error);
  } finally {
    await connection.end();
  }
}

fixNotifications();
