const { query } = require('../config/database');

async function debugOrders() {
  try {
    console.log('🔍 Debugging Admin Orders Query...');
    
    // 1. Check raw orders
    const orders = await query('SELECT id, user_id FROM orders LIMIT 5');
    console.log('📋 Recent Orders:', orders);

    if (orders.length === 0) {
      console.log('⚠️ No orders found.');
      process.exit(0);
    }

    // 2. Check the specific join query used in the endpoint
    const sqlQuery = `
      SELECT o.id, o.user_id, u.id as joined_user_id, u.name, u.email, u.name as user_name, u.email as user_email
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;
    
    const results = await query(sqlQuery);
    console.log('\n📋 Join Query Results:');
    results.forEach(row => {
      console.log(`Order #${row.id}: user_id=${row.user_id}, joined_user_id=${row.joined_user_id}`);
      console.log(`   -> name="${row.name}", user_name="${row.user_name}"`);
      console.log(`   -> email="${row.email}", user_email="${row.user_email}"`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

debugOrders();
