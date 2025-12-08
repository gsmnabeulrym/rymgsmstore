const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function finalFixDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // First, let's see what we have
    const [orders] = await connection.execute('SELECT id, status, total FROM orders');
    console.log('Current orders:');
    orders.forEach(order => {
      console.log(`Order ${order.id}: Status='${order.status}', Total=${order.total}`);
    });

    // Update orders one by one with explicit commits
    console.log('\n🔧 Updating order statuses...');
    
    await connection.execute('UPDATE orders SET status = "delivered" WHERE id = 7');
    await connection.execute('UPDATE orders SET status = "delivered" WHERE id = 8');  
    await connection.execute('UPDATE orders SET status = "delivered" WHERE id = 9');
    await connection.execute('UPDATE orders SET status = "shipped" WHERE id = 10');
    await connection.execute('UPDATE orders SET status = "pending" WHERE id = 11');
    
    console.log('✅ Updated all order statuses');

    // Verify the updates
    const [updatedOrders] = await connection.execute('SELECT id, status, total FROM orders ORDER BY id');
    console.log('\nVerified orders:');
    updatedOrders.forEach(order => {
      console.log(`Order ${order.id}: Status='${order.status}', Total=${order.total}`);
    });

    // Test the analytics queries that will be used
    console.log('\n📊 Testing analytics queries...');
    
    const [deliveredCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "delivered"');
    console.log(`Delivered orders: ${deliveredCount[0].count}`);
    
    const [totalRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(total), 0) as revenue 
      FROM orders 
      WHERE status = 'delivered'
    `);
    console.log(`Total revenue from delivered orders: ${totalRevenue[0].revenue} DT`);
    
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`Total users: ${userCount[0].count}`);
    
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`Total products: ${productCount[0].count}`);

    console.log('\n🎉 Database is now ready for analytics!');

  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
finalFixDatabase();
