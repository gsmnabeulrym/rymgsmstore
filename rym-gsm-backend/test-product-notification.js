const mysql = require('mysql2/promise');
const notificationService = require('./services/notificationService');

async function testProductNotification() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🧪 Testing Product Notification Creation...\n');

    // Step 1: Clear previous test notifications
    await connection.execute('DELETE FROM notifications WHERE message LIKE "%Test Product Real%"');
    console.log('✅ Cleared previous test notifications');

    // Step 2: Test notification service directly
    console.log('\n🔔 Testing notification service directly...');
    await notificationService.notifyNewProduct(
      99999, 
      'Test Product Real Time', 
      'Test Brand', 
      299.99, 
      'phone'
    );

    // Step 3: Verify notifications were created
    console.log('\n📊 Checking created notifications...');
    const [notifications] = await connection.execute(
      'SELECT * FROM notifications WHERE message LIKE "%Test Product Real%" ORDER BY created_at DESC'
    );

    console.log(`📨 Notifications created: ${notifications.length}`);
    notifications.forEach(notif => {
      console.log(`  - User ${notif.user_id}: ${notif.title} (Read: ${notif.read_status ? 'Yes' : 'No'})`);
    });

    // Step 4: Check current unread count for John
    const [johnNotifs] = await connection.execute(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = 10 AND read_status = 0'
    );
    
    console.log(`\n🔢 John's current unread notifications: ${johnNotifs[0].unread}`);

    console.log('\n✅ Test completed!');
    console.log('\n🔧 INSTRUCTIONS:');
    console.log('1. Now login as john@example.com in your frontend');
    console.log('2. You should see the notification bell with unread count');
    console.log('3. Create a new product as admin and watch the server logs');
    console.log('4. The notification should appear within 2 seconds');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await connection.end();
  }
}

testProductNotification();
