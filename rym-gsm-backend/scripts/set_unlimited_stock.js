const db = require('../config/database');

async function setUnlimitedStock() {
  try {
    console.log('🔄 Setting all products to unlimited stock...');
    
    // Set stock to 9999 (effectively unlimited) for all products
    const sql = `UPDATE products SET stock = 9999 WHERE stock < 9999`;
    const [result] = await db.pool.execute(sql);
    
    console.log(`✅ Successfully updated ${result.affectedRows} products to unlimited stock (9999)`);
    
    // Verify the update
    const [products] = await db.pool.execute('SELECT COUNT(*) as total FROM products WHERE stock = 9999');
    console.log(`📊 Total products with unlimited stock: ${products[0].total}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    process.exit(1);
  }
}

setUnlimitedStock();

