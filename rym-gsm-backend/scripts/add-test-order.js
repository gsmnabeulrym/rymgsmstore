const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function addTestOrder() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Add a new test order
    const testOrder = {
      user_id: 1,
      products: JSON.stringify([{ id: 1, name: 'iPhone 15 Pro Max', quantity: 1, price: 2800 }]),
      total: 2800.00,
      status: 'delivered',
      shipping_address: 'Test Address, Tunis',
      payment_method: 'credit_card'
    };

    const [result] = await connection.execute(
      'INSERT INTO orders (user_id, products, total, status, shipping_address, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [testOrder.user_id, testOrder.products, testOrder.total, testOrder.status, testOrder.shipping_address, testOrder.payment_method]
    );

    console.log(`✅ Added new test order with ID: ${result.insertId}`);

    // Add corresponding order item
    await connection.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [result.insertId, 1, 1, 2800.00]
    );

    console.log('✅ Added order item');

    // Show updated stats
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total ELSE 0 END), 0) as total_revenue
      FROM orders
    `);

    console.log('\n📊 Updated Analytics:');
    console.log(`📦 Total Orders: ${stats[0].total_orders}`);
    console.log(`✅ Delivered Orders: ${stats[0].delivered_orders}`);
    console.log(`💰 Total Revenue: ${stats[0].total_revenue} DT`);
    console.log('\n🎉 Analytics should now show updated numbers!');

  } catch (error) {
    console.error('❌ Error adding test order:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addTestOrder();
