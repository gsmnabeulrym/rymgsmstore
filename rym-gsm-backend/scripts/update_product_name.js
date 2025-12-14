const db = require('../config/database');

async function updateProductName(productId, newName) {
  try {
    const sql = `UPDATE products SET name = ? WHERE id = ?`;
    const [result] = await db.pool.execute(sql, [newName, productId]);
    
    if (result.affectedRows === 0) {
      console.log(`❌ Product with ID ${productId} not found`);
      process.exit(1);
    }
    
    console.log(`✅ Product name updated successfully for product ID ${productId} to "${newName}"`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product name:', error);
    process.exit(1);
  }
}

const productId = process.argv[2];
const newName = process.argv[3];

if (!productId || !newName) {
  console.error('❌ Usage: node update_product_name.js <productId> "<newName>"');
  process.exit(1);
}

updateProductName(productId, newName);

