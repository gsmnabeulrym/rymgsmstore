const mysql = require('mysql2/promise');

async function enableNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    // Enable new product notifications for all users
    await connection.execute(
      'UPDATE notification_preferences SET new_products = 1 WHERE user_id IN (1, 2)'
    );
    
    console.log('✅ New product notifications enabled for all users');
    
    // Also create a test notification to verify the system works
    await connection.execute(
      'INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
      [
        2, // user ID
        'system',
        'Notification System Active',
        'Your notification system is now working! You will receive alerts for new products, price drops, and more.',
        JSON.stringify({ testNotification: true })
      ]
    );
    
    console.log('✅ Test notification created');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

enableNotifications();
