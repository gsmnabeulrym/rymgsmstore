const mysql = require('mysql2/promise');
const notificationService = require('./services/notificationService');

async function debugNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🔍 Debugging notification system...\n');

    // Check current users
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    console.log('👥 Current users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Check notification preferences
    console.log('\n⚙️ Notification preferences:');
    const [prefs] = await connection.execute('SELECT * FROM notification_preferences');
    prefs.forEach(pref => {
      console.log(`  - User ${pref.user_id}: new_products=${pref.new_products}, promotions=${pref.promotions}`);
    });

    // Test the notification service directly
    console.log('\n🧪 Testing notification service directly...');
    
    // Get regular users who should receive notifications
    const regularUsers = users.filter(user => user.role === 'user');
    console.log(`📊 Found ${regularUsers.length} regular users`);

    if (regularUsers.length > 0) {
      console.log('\n🆕 Testing new product notification...');
      await notificationService.notifyNewProduct(999, 'Test Product', 'Test Brand', 299.99, 'phone');
      console.log('✅ New product notification sent');

      // Check if notification was created
      const [newNotifications] = await connection.execute(
        'SELECT * FROM notifications WHERE title LIKE "%Test Product%" ORDER BY created_at DESC LIMIT 5'
      );
      
      console.log(`\n📨 New notifications created: ${newNotifications.length}`);
      newNotifications.forEach(notif => {
        console.log(`  - User ${notif.user_id}: ${notif.title} (${notif.type})`);
      });
    }

    // Check total notifications count
    const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    console.log(`\n📊 Total notifications in database: ${totalCount[0].count}`);

    // Check recent notifications for john@example.com
    const johnUser = users.find(u => u.email === 'john@example.com');
    if (johnUser) {
      const [johnNotifications] = await connection.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
        [johnUser.id]
      );
      
      console.log(`\n📬 Recent notifications for John (User ID: ${johnUser.id}):`);
      johnNotifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. [${notif.type.toUpperCase()}] ${notif.title}`);
        console.log(`     Read: ${notif.read_status ? 'Yes' : 'No'} | Created: ${notif.created_at}`);
      });
    }

  } catch (error) {
    console.error('❌ Error debugging notifications:', error);
  } finally {
    await connection.end();
  }
}

debugNotifications();
