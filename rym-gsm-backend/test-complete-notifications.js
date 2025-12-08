const mysql = require('mysql2/promise');
const notificationService = require('./services/notificationService');

async function testCompleteNotificationSystem() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🧪 Testing Complete Notification System\n');

    // 1. Test New Product Notification
    console.log('1️⃣ Testing New Product Notifications...');
    await notificationService.notifyNewProduct(1, 'iPhone 15 Pro Max', 'Apple', 1299, 'phone');
    console.log('✅ New product notification sent\n');

    // 2. Test Promotion Notification
    console.log('2️⃣ Testing Promotion Notifications...');
    await notificationService.notifyPromotion(
      'Black Friday Sale',
      'Huge discounts on all smartphones! Save up to 40% on selected items.',
      40,
      '2024-11-30',
      [1, 2, 3]
    );
    console.log('✅ Promotion notification sent\n');

    // 3. Test Order Update Notifications
    console.log('3️⃣ Testing Order Update Notifications...');
    const [users] = await connection.execute('SELECT id FROM users WHERE role = "user" LIMIT 1');
    if (users.length > 0) {
      const userId = users[0].id;
      await notificationService.notifyOrderUpdate(userId, 1001, 'shipped', 599.99);
      console.log('✅ Order update notification sent\n');
    }

    // 4. Test Product Modification Notifications
    console.log('4️⃣ Testing Product Modification Notifications...');
    await notificationService.notifyProductModification(1, 'iPhone 15 Pro', 'price_drop', 1299, 1199);
    await notificationService.notifyProductModification(2, 'Samsung Galaxy S24', 'back_in_stock', 0, 10);
    console.log('✅ Product modification notifications sent\n');

    // 5. Test System Update Notification
    console.log('5️⃣ Testing System Update Notifications...');
    await notificationService.notifySystemUpdate(
      'Website Maintenance',
      'Our website will undergo scheduled maintenance on Sunday from 2 AM to 4 AM. Thank you for your patience.',
      false
    );
    console.log('✅ System update notification sent\n');

    // 6. Test Urgent System Notification
    console.log('6️⃣ Testing Urgent System Notifications...');
    await notificationService.notifySystemUpdate(
      'Security Update',
      'We have implemented important security updates. Please log out and log back in for the changes to take effect.',
      true
    );
    console.log('✅ Urgent system notification sent\n');

    // 7. Get Statistics
    console.log('7️⃣ Getting Notification Statistics...');
    const stats = await notificationService.getNotificationStats();
    if (stats) {
      console.log(`📊 Total notifications: ${stats.total}`);
      console.log(`📬 Unread notifications: ${stats.unread}`);
      console.log('📈 Notifications by type:');
      stats.byType.forEach(type => {
        console.log(`   - ${type.type}: ${type.count}`);
      });
    }
    console.log('✅ Statistics retrieved\n');

    // 8. Check final notification count
    const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM notifications');
    console.log(`🎯 Final notification count: ${finalCount[0].count}\n`);

    // 9. Show recent notifications for users
    console.log('9️⃣ Recent Notifications for Users:');
    const [recentNotifications] = await connection.execute(`
      SELECT n.*, u.name as user_name 
      FROM notifications n 
      JOIN users u ON n.user_id = u.id 
      ORDER BY n.created_at DESC 
      LIMIT 10
    `);

    recentNotifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. [${notif.type.toUpperCase()}] ${notif.title}`);
      console.log(`      User: ${notif.user_name} | Read: ${notif.read_status ? 'Yes' : 'No'}`);
      console.log(`      Message: ${notif.message.substring(0, 80)}...`);
      console.log('');
    });

    console.log('🎉 Complete Notification System Test Completed Successfully!\n');
    
    console.log('🧪 Now test in the frontend:');
    console.log('1. Login as john@example.com / password');
    console.log('2. Check the notification bell in navbar');
    console.log('3. You should see multiple notifications');
    console.log('4. Test creating a new product as admin');
    console.log('5. Test updating order status as admin');
    console.log('6. Test sending promotions via admin panel');

  } catch (error) {
    console.error('❌ Error testing notification system:', error);
  } finally {
    await connection.end();
  }
}

testCompleteNotificationSystem();
