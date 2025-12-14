const db = require('../config/database');

async function updatePrice(productId, newPrice) {
  try {
    const sql = `UPDATE products SET price = ? WHERE id = ?`;
    const [result] = await db.pool.execute(sql, [newPrice, productId]);
    
    if (result.affectedRows === 0) {
      console.log(`❌ Product with ID ${productId} not found`);
      process.exit(1);
    }
    
    console.log(`✅ Price updated successfully for product ID ${productId} to ${newPrice} Dt`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating price:', error);
    process.exit(1);
  }
}

const productId = process.argv[2];
const newPrice = parseFloat(process.argv[3]);

if (!productId || !newPrice) {
  console.error('❌ Usage: node update_price.js <productId> <newPrice>');
  process.exit(1);
}

updatePrice(productId, newPrice);

