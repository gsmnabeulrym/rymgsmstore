const mysql = require('mysql2/promise');

async function createTestNotifications() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rym_gsm'
  });

  try {
    console.log('🔔 Creating test notifications...\n');

    // Get all regular users
    const [users] = await connection.execute('SELECT id, name, email FROM users WHERE role = "user"');
    console.log('👥 Found users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });

    if (users.length === 0) {
      console.log('❌ No regular users found!');
      return;
    }

    // Create test notifications for each user
    for (const user of users) {
      const testNotifications = [
        {
          type: 'system',
          title: '🎉 Welcome to RYM GSM!',
          message: 'Your notification system is now active. You\'ll receive updates about orders, new products, and special offers.',
          data: { welcome: true }
        },
        {
          type: 'new_product',
          title: '🆕 New iPhone 15 Pro Max Available!',
          message: 'Check out the latest iPhone 15 Pro Max with titanium design and advanced camera system. Now available in our store!',
          data: { productId: 1, productName: 'iPhone 15 Pro Max', brand: 'Apple', price: 1299 }
        },
        {
          type: 'promotion',
          title: '🎯 Black Friday Sale - 40% Off!',
          message: 'Don\'t miss our biggest sale of the year! Get up to 40% off on all smartphones and accessories. Limited time offer!',
          data: { discount: 40, validUntil: '2024-12-31', isPromotion: true }
        },
        {
          type: 'price_drop',
          title: '💰 Price Drop Alert!',
          message: 'Great news! Samsung Galaxy S24 Ultra price has dropped from 1199 DT to 999 DT. Save 200 DT now!',
          data: { productId: 2, productName: 'Samsung Galaxy S24 Ultra', oldPrice: 1199, newPrice: 999 }
        },
        {
          type: 'stock_alert',
          title: '📦 Back in Stock!',
          message: 'Good news! Google Pixel 8 Pro is now back in stock. Get it before it runs out again!',
          data: { productId: 3, productName: 'Google Pixel 8 Pro' }
        }
      ];

      for (const notif of testNotifications) {
        await connection.execute(
          'INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [user.id, notif.type, notif.title, notif.message, JSON.stringify(notif.data)]
        );
      }
      
      console.log(`✅ Created ${testNotifications.length} test notifications for ${user.name} (${user.email})`);
    }

    // Also ensure notification preferences are set
    for (const user of users) {
      try {
        await connection.execute(
          'INSERT INTO notification_preferences (user_id, order_updates, stock_alerts, price_drops, new_products, promotions) VALUES (?, 1, 1, 1, 1, 1) ON DUPLICATE KEY UPDATE new_products = 1, promotions = 1, stock_alerts = 1, price_drops = 1, order_updates = 1',
          [user.id]
        );
        console.log(`✅ Updated notification preferences for ${user.name}`);
      } catch (error) {
        console.log(`ℹ️ Preferences already exist for ${user.name}`);
      }
    }

    // Check final count
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM notifications');
    console.log(`\n📊 Total notifications in database: ${count[0].total}`);

    // Show recent notifications
    const [recent] = await connection.execute(`
      SELECT n.type, n.title, u.name as user_name, n.read_status
      FROM notifications n 
      JOIN users u ON n.user_id = u.id 
      ORDER BY n.created_at DESC 
      LIMIT 10
    `);

    console.log('\n📨 Recent notifications:');
    recent.forEach((notif, index) => {
      console.log(`  ${index + 1}. [${notif.type.toUpperCase()}] ${notif.title}`);
      console.log(`     User: ${notif.user_name} | Read: ${notif.read_status ? 'Yes' : 'No'}`);
    });

    console.log('\n🎉 Test notifications created successfully!');
    console.log('\n🧪 Now test:');
    console.log('1. Go to http://localhost:5173/');
    console.log('2. Login with: john@example.com / password');
    console.log('3. Look at the notification bell in the navbar');
    console.log('4. You should see a red badge with notification count');
    console.log('5. Click the bell to view notifications');

  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
  } finally {
    await connection.end();
  }
}

createTestNotifications();
