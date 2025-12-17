const { query } = require('../config/database');

async function testDirectQuery() {
  try {
    console.log('🔍 Testing direct database queries...\n');

    // Test order 8
    console.log('Testing Order #8:');
    const order8 = await query('SELECT id, user_id, status, total FROM orders WHERE id = ?', [8]);
    console.log(`  Found: ${order8.length > 0 ? 'YES' : 'NO'}`);
    if (order8.length > 0) {
      console.log(`  Data:`, order8[0]);
    }

    // Test order 6
    console.log('\nTesting Order #6:');
    const order6 = await query('SELECT id, user_id, status, total FROM orders WHERE id = ?', [6]);
    console.log(`  Found: ${order6.length > 0 ? 'YES' : 'NO'}`);
    if (order6.length > 0) {
      console.log(`  Data:`, order6[0]);
    }

    // Test with SELECT *
    console.log('\nTesting Order #8 with SELECT *:');
    const order8Full = await query('SELECT * FROM orders WHERE id = ?', [8]);
    console.log(`  Found: ${order8Full.length > 0 ? 'YES' : 'NO'}`);
    if (order8Full.length > 0) {
      console.log(`  Keys:`, Object.keys(order8Full[0]));
      console.log(`  products type:`, typeof order8Full[0].products);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testDirectQuery();
