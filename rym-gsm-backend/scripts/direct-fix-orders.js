const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function directFixOrders() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check orders table structure
    const [columns] = await connection.execute('DESCRIBE orders');
    console.log('Orders table structure:');
    columns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Get current orders
    const [orders] = await connection.execute('SELECT id, user_id, status FROM orders');
    console.log('\nCurrent orders:');
    orders.forEach(order => {
      console.log(`Order ${order.id}: User=${order.user_id}, Status='${order.status}'`);
    });

    // Directly update orders with explicit status values
    console.log('\n🔧 Fixing order statuses...');
    
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['completed', 7]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['completed', 8]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['completed', 9]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['processing', 10]);
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['pending', 11]);
    
    console.log('✅ Updated all order statuses individually');

    // Verify updates
    const [updatedOrders] = await connection.execute('SELECT id, user_id, status FROM orders');
    console.log('\nUpdated orders:');
    updatedOrders.forEach(order => {
      console.log(`Order ${order.id}: User=${order.user_id}, Status='${order.status}'`);
    });

    // Calculate revenue from completed orders
    const [revenue] = await connection.execute(`
      SELECT 
        o.id,
        o.status,
        COALESCE(SUM(oi.quantity * oi.price), 0) as order_revenue
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.status
      ORDER BY o.id
    `);

    console.log('\nRevenue by order:');
    let totalRevenue = 0;
    revenue.forEach(order => {
      console.log(`Order ${order.id} (${order.status}): ${order.order_revenue} DT`);
      if (order.status === 'completed') {
        totalRevenue += parseFloat(order.order_revenue);
      }
    });

    console.log(`\n💰 Total Revenue from Completed Orders: ${totalRevenue} DT`);

    // Final verification
    const [completedCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    console.log(`✅ Completed Orders Count: ${completedCount[0].count}`);

  } catch (error) {
    console.error('❌ Error fixing orders:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
directFixOrders();
