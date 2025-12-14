// Script to add status column to reviews table in PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function addStatusColumn() {
  const client = await pool.connect();
  try {
    console.log('Adding status column to reviews table...');
    
    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reviews' AND column_name = 'status'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add the column
      await client.query(`
        ALTER TABLE reviews 
        ADD COLUMN status VARCHAR(20) DEFAULT 'approved' 
        CHECK (status IN ('pending', 'approved', 'rejected'))
      `);
      console.log('✅ Status column added to reviews table');
    } else {
      console.log('✅ Status column already exists');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addStatusColumn();
