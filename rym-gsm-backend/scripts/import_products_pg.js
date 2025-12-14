require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read the products backup file
const productsFile = path.join(__dirname, '..', 'products_backup.json');

if (!fs.existsSync(productsFile)) {
  console.error('❌ Products backup file not found:', productsFile);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

console.log(`📦 Found ${products.length} products to import`);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importProducts() {
  const client = await pool.connect();
  
  try {
    console.log('🔌 Connected to PostgreSQL');
    
    // Begin transaction
    await client.query('BEGIN');
    
    let importedCount = 0;
    
    for (const product of products) {
      // Parse JSON fields if they are strings
      let images = product.images;
      let specs = product.specs;
      
      if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = []; }
      }
      
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
      }
      
      // Default stock if missing
      const stock = product.stock !== undefined ? product.stock : 999;
      
      const query = `
        INSERT INTO products (name, brand, price, stock, category, images, specs, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `;
      
      const values = [
        product.name,
        product.brand,
        product.price,
        stock,
        product.category,
        JSON.stringify(images || []),
        JSON.stringify(specs || {}),
        product.description || ''
      ];
      
      await client.query(query, values);
      importedCount++;
      process.stdout.write(`\r✅ Imported ${importedCount}/${products.length} products`);
    }
    
    await client.query('COMMIT');
    console.log('\n✨ Import completed successfully!');
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error importing products:', err);
  } finally {
    client.release();
    pool.end();
  }
}

// Run the import
if (process.env.DATABASE_URL) {
  importProducts();
} else {
  console.error('❌ DATABASE_URL environment variable is missing');
}
