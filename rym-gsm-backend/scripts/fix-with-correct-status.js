const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function fixWithCorrectStatus() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    console.log('🔧 Updating orders with correct ENUM values...');
    
    // Use 'delivered' instead of 'completed' since that's what the ENUM allows
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['delivered', 7]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['delivered', 8]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['delivered', 9]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['shipped', 10]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['pending', 11]);
    
    console.log('✅ Updated all order statuses with correct ENUM values');

    // Verify updates
    const [updatedOrders] = await connection.execute('SELECT id, user_id, status FROM orders');
    console.log('\nUpdated orders:');
    updatedOrders.forEach(order => {
      console.log(`Order ${order.id}: User=${order.user_id}, Status='${order.status}'`);
    });

    // Calculate revenue from delivered orders (equivalent to completed)
    const [revenue] = await connection.execute(`
      SELECT 
        o.id,
        o.status,
        o.total as order_total,
        COALESCE(SUM(oi.quantity * oi.price), 0) as calculated_revenue
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.status, o.total
      ORDER BY o.id
    `);

    console.log('\nRevenue by order:');
    let totalRevenue = 0;
    let totalFromOrderItems = 0;
    revenue.forEach(order => {
      console.log(`Order ${order.id} (${order.status}): Total=${order.order_total} DT, Calculated=${order.calculated_revenue} DT`);
      if (order.status === 'delivered') {
        totalRevenue += parseFloat(order.order_total || 0);
        totalFromOrderItems += parseFloat(order.calculated_revenue || 0);
      }
    });

    console.log(`\n💰 Total Revenue from Delivered Orders (using total column): ${totalRevenue} DT`);
    console.log(`💰 Total Revenue from Order Items: ${totalFromOrderItems} DT`);

    // Final verification
    const [deliveredCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "delivered"');
    const [shippedCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "shipped"');
    const [pendingCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    
    console.log('\n📊 Order Status Summary:');
    console.log(`✅ Delivered Orders: ${deliveredCount[0].count}`);
    console.log(`🚚 Shipped Orders: ${shippedCount[0].count}`);
    console.log(`⏳ Pending Orders: ${pendingCount[0].count}`);

  } catch (error) {
    console.error('❌ Error fixing orders:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
fixWithCorrectStatus();
