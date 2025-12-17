const { Client } = require('pg');

const DATABASE_URL = 'postgresql://rym_gsm_user:mfr6ddBRD26Hml2k8QH50VOI2aiQgMgg@dpg-d4rak3je5dus73f5iir0-a.frankfurt-postgres.render.com/rym_gsm';

async function checkOrders() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // 1. Check recent orders with user details
    console.log('🔍 Checking recent orders...');
    const query = `
      SELECT o.id, o.user_id, o.total, o.created_at,
             u.id as user_table_id, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;

    const res = await client.query(query);
    
    if (res.rows.length === 0) {
      console.log('⚠️ No orders found in database.');
    } else {
      console.log('📋 Found', res.rows.length, 'orders:');
      res.rows.forEach(row => {
        console.log('------------------------------------------------');
        console.log(`Order ID: ${row.id}`);
        console.log(`User ID: ${row.user_id}`);
        console.log(`Total: ${row.total}`);
        console.log(`User Name (from join): ${row.user_name}`);
        console.log(`User Email (from join): ${row.user_email}`);
        console.log('------------------------------------------------');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkOrders();
