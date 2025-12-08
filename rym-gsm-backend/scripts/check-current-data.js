const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function checkCurrentData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check all tables and their data
    console.log('\n📊 DATABASE SUMMARY:');
    console.log('='.repeat(50));

    // Orders
    const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    const [ordersByStatus] = await connection.execute(`
      SELECT status, COUNT(*) as count, SUM(total) as revenue 
      FROM orders 
      GROUP BY status
    `);
    console.log(`📦 ORDERS: ${orders[0].count} total`);
    ordersByStatus.forEach(row => {
      console.log(`   ${row.status || 'NULL'}: ${row.count} orders, ${row.revenue || 0} DT revenue`);
    });

    // Users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`👥 USERS: ${users[0].count} total`);

    // Products
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`📱 PRODUCTS: ${products[0].count} total`);

    // Order Items
    const [orderItems] = await connection.execute('SELECT COUNT(*) as count FROM order_items');
    console.log(`🛒 ORDER ITEMS: ${orderItems[0].count} total`);

    // Chatbot Conversations
    const [chatbot] = await connection.execute('SELECT COUNT(*) as count FROM chatbot_conversations');
    console.log(`🤖 CHATBOT CONVERSATIONS: ${chatbot[0].count} total`);

    // Reviews
    const [reviews] = await connection.execute('SELECT COUNT(*) as count FROM reviews');
    console.log(`⭐ REVIEWS: ${reviews[0].count} total`);

    console.log('\n📈 ANALYTICS READY STATUS:');
    console.log('='.repeat(50));

    const deliveredOrders = ordersByStatus.find(row => row.status === 'delivered');
    if (deliveredOrders && deliveredOrders.count > 0) {
      console.log(`✅ Revenue Data: ${deliveredOrders.revenue} DT from ${deliveredOrders.count} delivered orders`);
    } else {
      console.log('❌ No delivered orders found - analytics will show 0 revenue');
    }

    if (users[0].count > 0) {
      console.log(`✅ Customer Data: ${users[0].count} users`);
    } else {
      console.log('❌ No users found - customer analytics will be empty');
    }

    if (products[0].count > 0) {
      console.log(`✅ Product Data: ${products[0].count} products`);
    } else {
      console.log('❌ No products found - product analytics will be empty');
    }

    if (chatbot[0].count > 0) {
      console.log(`✅ Chatbot Data: ${chatbot[0].count} conversations`);
    } else {
      console.log('⚠️ No chatbot conversations - chatbot analytics will be empty');
    }

    // Check what needs to be added
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('='.repeat(50));

    if (deliveredOrders && deliveredOrders.count >= 3) {
      console.log('✅ Analytics should work with current data');
    } else {
      console.log('⚠️ Need more delivered orders for meaningful analytics');
    }

    if (users[0].count < 5) {
      console.log('⚠️ Consider adding more users for better customer analytics');
    }

    if (orderItems[0].count === 0) {
      console.log('⚠️ No order items found - product sales analytics will be limited');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the check
checkCurrentData();
