const mysql = require('mysql2/promise');

async function testNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🔍 Testing notification system...\n');

    // Check if tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'notifications'");
    console.log('✅ Notifications table exists:', tables.length > 0);

    const [prefTables] = await connection.execute("SHOW TABLES LIKE 'notification_preferences'");
    console.log('✅ Notification preferences table exists:', prefTables.length > 0);

    // Check users
    const [users] = await connection.execute('SELECT id, name, email FROM users');
    console.log('\n👥 Users in database:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });

    // Check notification preferences
    const [prefs] = await connection.execute('SELECT * FROM notification_preferences');
    console.log('\n⚙️ Notification preferences:');
    prefs.forEach(pref => {
      console.log(`  - User ${pref.user_id}: new_products=${pref.new_products}, promotions=${pref.promotions}`);
    });

    // Check existing notifications
    const [notifications] = await connection.execute('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5');
    console.log('\n🔔 Recent notifications:');
    notifications.forEach(notif => {
      console.log(`  - User ${notif.user_id}: ${notif.title} (${notif.type}) - Read: ${notif.read_status}`);
    });

    // Create a test notification for user 2
    await connection.execute(
      'INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
      [
        2,
        'system',
        'Test Notification',
        'This is a test notification to verify the system is working correctly.',
        JSON.stringify({ test: true, timestamp: new Date().toISOString() })
      ]
    );

    console.log('\n✅ Test notification created for user 2');

    // Check unread count for user 2
    const [unreadCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = 2 AND read_status = 0'
    );
    console.log(`📊 Unread notifications for user 2: ${unreadCount[0].count}`);

    console.log('\n🎉 Notification system test completed!');
    console.log('\nNow try:');
    console.log('1. Login as john@example.com / password');
    console.log('2. Look at the notification bell in the navbar');
    console.log('3. Click the bell to see notifications');

  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  } finally {
    await connection.end();
  }
}

testNotifications();
