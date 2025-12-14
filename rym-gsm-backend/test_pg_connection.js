// Test PostgreSQL connection and tables
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('✅ Connected to PostgreSQL');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Current time:', result.rows[0].current_time);
    
    // Check tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    // Check row counts
    console.log('\n📊 Row counts:');
    const tableNames = ['users', 'products', 'cart', 'orders', 'wishlist', 'reviews', 'notifications'];
    for (const table of tableNames) {
      try {
        const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  - ${table}: ${count.rows[0].count} rows`);
      } catch (e) {
        console.log(`  - ${table}: ❌ Table doesn't exist`);
      }
    }
    
    // Check reviews table columns
    console.log('\n🔍 Reviews table columns:');
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position
    `);
    columns.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
    
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
