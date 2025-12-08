const mysql = require('mysql2/promise');

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    // Check users
    const [users] = await connection.execute('SELECT * FROM users');
    console.log('👥 Users in database:');
    if (users.length === 0) {
      console.log('  ❌ No users found!');
    } else {
      users.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

    // Check notification preferences
    const [prefs] = await connection.execute('SELECT * FROM notification_preferences');
    console.log('\n⚙️ Notification preferences:');
    if (prefs.length === 0) {
      console.log('  ❌ No preferences found!');
    } else {
      prefs.forEach(pref => {
        console.log(`  - User ${pref.user_id}: new_products=${pref.new_products}`);
      });
    }

    // Check notifications
    const [notifications] = await connection.execute('SELECT * FROM notifications');
    console.log('\n🔔 Notifications:');
    if (notifications.length === 0) {
      console.log('  ❌ No notifications found!');
    } else {
      notifications.forEach(notif => {
        console.log(`  - User ${notif.user_id}: ${notif.title}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkUsers();
