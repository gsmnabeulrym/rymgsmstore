const mysql = require('mysql2/promise');

async function testUserNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🧪 Testing user notifications API simulation...\n');

    // Get John's user ID
    const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', ['john@example.com']);
    if (users.length === 0) {
      console.log('❌ User john@example.com not found');
      return;
    }
    
    const userId = users[0].id;
    console.log(`👤 John's User ID: ${userId}`);

    // Simulate the exact query that the API uses
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `;
    
    const [notifications] = await connection.execute(query, [userId]);
    
    console.log(`\n📊 Total notifications for John: ${notifications.length}`);
    console.log('\n📋 Recent notifications:');
    
    notifications.slice(0, 10).forEach((notif, index) => {
      console.log(`  ${index + 1}. [${notif.type.toUpperCase()}] ${notif.title}`);
      console.log(`     Read: ${notif.read_status ? 'Yes' : 'No'} | Created: ${notif.created_at}`);
      console.log(`     Message: ${notif.message.substring(0, 60)}...`);
      console.log('');
    });

    // Count unread notifications
    const unreadCount = notifications.filter(n => n.read_status === 0).length;
    console.log(`🔢 Unread notifications: ${unreadCount}`);

    // Show what the API response would look like
    const apiResponse = {
      success: true,
      notifications: notifications.map(notif => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        data: notif.data ? JSON.parse(notif.data) : {},
        read_status: notif.read_status,
        created_at: notif.created_at
      }))
    };

    console.log('\n📡 API Response structure:');
    console.log(`  - success: ${apiResponse.success}`);
    console.log(`  - notifications: Array(${apiResponse.notifications.length})`);
    console.log(`  - unread count: ${apiResponse.notifications.filter(n => !n.read_status).length}`);

  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  } finally {
    await connection.end();
  }
}

testUserNotifications();
