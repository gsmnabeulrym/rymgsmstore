require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking Render PostgreSQL database...\n');

    // Check tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in database:');
    tables.rows.forEach(t => console.log('  ✅', t.table_name));

    // Count records
    console.log('\n📊 Record counts:');
    
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('  👥 Users:', users.rows[0].count);

    const products = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('  📦 Products:', products.rows[0].count);

    const orders = await pool.query('SELECT COUNT(*) as count FROM orders');
    console.log('  🛒 Orders:', orders.rows[0].count);

    // Show sample data
    console.log('\n👤 Users:');
    const userList = await pool.query('SELECT id, name, email, role FROM users');
    userList.rows.forEach(u => console.log(`  - ${u.name} (${u.email}) [${u.role}]`));

    console.log('\n📱 Products:');
    const productList = await pool.query('SELECT id, name, brand, price FROM products');
    productList.rows.forEach(p => console.log(`  - ${p.name} (${p.brand}) - ${p.price} Dt`));

    console.log('\n✅ Database verification complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
