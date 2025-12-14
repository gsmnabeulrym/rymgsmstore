require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const SCHEMA_FILE = path.join(__dirname, '..', 'pg_schema.sql');
const PRODUCTS_FILE = path.join(__dirname, '..', 'products_backup.json');

// Check files
if (!fs.existsSync(SCHEMA_FILE)) {
  console.error('❌ Schema file not found:', SCHEMA_FILE);
  process.exit(1);
}
if (!fs.existsSync(PRODUCTS_FILE)) {
  console.error('❌ Products backup file not found:', PRODUCTS_FILE);
  process.exit(1);
}

// Create Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function deployDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting Database Deployment...');
    console.log('🔌 Connected to PostgreSQL');

    // 1. Run Schema Migration
    console.log('\n📝 Applying Database Schema...');
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema applied successfully!');

    // 2. Import Products
    console.log('\n📦 Importing Products...');
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    console.log(`Found ${products.length} products to import.`);

    await client.query('BEGIN'); // Start transaction for data import

    // Optional: Clear existing products to avoid duplicates if running multiple times
    // await client.query('DELETE FROM products'); 

    let importedCount = 0;
    for (const product of products) {
      // Parse fields
      let images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
      let specs = typeof product.specs === 'string' ? JSON.parse(product.specs || '{}') : (product.specs || {});
      const stock = product.stock !== undefined ? product.stock : 999;
      const category = product.category || 'phone';

      const query = `
        INSERT INTO products (name, brand, price, stock, category, images, specs, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;
      
      const values = [
        product.name,
        product.brand,
        product.price,
        stock,
        category,
        JSON.stringify(images),
        JSON.stringify(specs),
        product.description || ''
      ];

      await client.query(query, values);
      importedCount++;
      if (importedCount % 10 === 0) process.stdout.write(`.`);
    }

    await client.query('COMMIT');
    console.log(`\n✅ Successfully imported ${importedCount} products!`);
    
    console.log('\n🎉 DEPLOYMENT COMPLETE! Your database is ready.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Deployment Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

// Run
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is missing');
  process.exit(1);
}

deployDatabase();
