const mysql = require('mysql2/promise');
const notificationService = require('./services/notificationService');

async function testCompleteNotificationFlow() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🔍 DEEP ANALYSIS: Testing Complete Notification Flow\n');

    // Step 1: Check users and preferences
    console.log('1️⃣ Checking users and notification preferences...');
    const [users] = await connection.execute('SELECT id, name, email, role FROM users');
    console.log('👥 All users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

    const [prefs] = await connection.execute('SELECT * FROM notification_preferences');
    console.log('\n⚙️ Notification preferences:');
    prefs.forEach(pref => {
      console.log(`  - User ${pref.user_id}: new_products=${pref.new_products}, promotions=${pref.promotions}`);
    });

    // Step 2: Test getUsersForNotificationType function
    console.log('\n2️⃣ Testing getUsersForNotificationType...');
    
    // Test the exact query from the service
    const [testUsers] = await connection.execute(`
      SELECT u.id, u.name, u.email 
      FROM users u 
      LEFT JOIN notification_preferences np ON u.id = np.user_id 
      WHERE u.role = 'user' 
      AND (
        ('new_product' = 'new_product' AND (np.new_products = 1 OR np.new_products IS NULL))
        OR ('new_product' = 'promotion' AND (np.promotions = 1 OR np.promotions IS NULL))
        OR ('new_product' = 'order_update' AND (np.order_updates = 1 OR np.order_updates IS NULL))
        OR ('new_product' = 'stock_alert' AND (np.stock_alerts = 1 OR np.stock_alerts IS NULL))
        OR ('new_product' = 'price_drop' AND (np.price_drops = 1 OR np.price_drops IS NULL))
        OR 'new_product' = 'system'
      )
    `);
    
    console.log(`📊 Users who should receive new_product notifications: ${testUsers.length}`);
    testUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    // Step 3: Test notification service directly
    console.log('\n3️⃣ Testing notification service directly...');
    
    // Clear recent test notifications first
    await connection.execute('DELETE FROM notifications WHERE title LIKE "%Test Product%"');
    
    // Test the service
    console.log('Creating test notification...');
    await notificationService.notifyNewProduct(999, 'Test Product Deep Analysis', 'Test Brand', 199.99, 'phone');
    
    // Check if notifications were created
    const [newNotifications] = await connection.execute(
      'SELECT * FROM notifications WHERE title LIKE "%Test Product Deep Analysis%" ORDER BY created_at DESC'
    );
    
    console.log(`📨 Notifications created: ${newNotifications.length}`);
    newNotifications.forEach(notif => {
      console.log(`  - User ${notif.user_id}: ${notif.title} (Read: ${notif.read_status ? 'Yes' : 'No'})`);
    });

    // Step 4: Check current notification count for John
    const johnUser = users.find(u => u.email === 'john@example.com');
    if (johnUser) {
      const [johnNotifs] = await connection.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
        [johnUser.id]
      );
      
      console.log(`\n📬 John's recent notifications (User ID: ${johnUser.id}):`);
      johnNotifs.forEach((notif, index) => {
        console.log(`  ${index + 1}. [${notif.type}] ${notif.title}`);
        console.log(`     Read: ${notif.read_status ? 'Yes' : 'No'} | Created: ${notif.created_at}`);
      });
      
      const unreadCount = johnNotifs.filter(n => n.read_status === 0).length;
      console.log(`🔢 John's unread notifications: ${unreadCount}`);
    }

    // Step 5: Test API response simulation
    console.log('\n4️⃣ Simulating API response...');
    if (johnUser) {
      const [apiNotifications] = await connection.execute(`
        SELECT * FROM notifications 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `, [johnUser.id]);
      
      const apiResponse = {
        success: true,
        notifications: apiNotifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          data: notif.data ? JSON.parse(notif.data) : {},
          read_status: notif.read_status,
          created_at: notif.created_at
        }))
      };
      
      console.log(`📡 API would return ${apiResponse.notifications.length} notifications`);
      console.log(`🔢 Unread count: ${apiResponse.notifications.filter(n => !n.read_status).length}`);
    }

    console.log('\n✅ Deep analysis complete!');

  } catch (error) {
    console.error('❌ Error in deep analysis:', error);
  } finally {
    await connection.end();
  }
}

testCompleteNotificationFlow();
