const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function fixOrderStatus() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check current order statuses
    const [orderStatuses] = await connection.execute('SELECT id, status FROM orders ORDER BY id');
    console.log('Current order statuses:');
    orderStatuses.forEach(order => {
      console.log(`Order ${order.id}: ${order.status}`);
    });

    // Update first 4 orders to completed
    await connection.execute('UPDATE orders SET status = ? WHERE id IN (1, 2, 3, 4)', ['completed']);
    console.log('✅ Updated orders 1-4 to completed status');

    // Update last order to processing
    await connection.execute('UPDATE orders SET status = ? WHERE id = 5', ['processing']);
    console.log('✅ Updated order 5 to processing status');

    // Check results
    const [updatedStatuses] = await connection.execute('SELECT id, status FROM orders ORDER BY id');
    console.log('\nUpdated order statuses:');
    updatedStatuses.forEach(order => {
      console.log(`Order ${order.id}: ${order.status}`);
    });

    // Calculate revenue
    const [revenue] = await connection.execute(`
      SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `);

    const [completedCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');

    console.log('\n📊 Final Analytics Summary:');
    console.log(`✅ Completed Orders: ${completedCount[0].count}`);
    console.log(`💰 Total Revenue: ${revenue[0].revenue} DT`);

  } catch (error) {
    console.error('❌ Error fixing order status:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
fixOrderStatus();
