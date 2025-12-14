const db = require('../config/database');

async function addWatchCategory() {
  try {
    console.log('🔄 Adding "watch" category to products table...');
    
    // Modify the ENUM to include 'watch'
    const sql = `ALTER TABLE products MODIFY COLUMN category ENUM('phone', 'accessory', 'watch') DEFAULT 'phone'`;
    await db.pool.execute(sql);
    
    console.log('✅ Successfully added "watch" category to products table');
    
    // Verify the change
    const [columns] = await db.pool.execute('DESCRIBE products');
    const categoryColumn = columns.find(col => col.Field === 'category');
    console.log(`📊 Category column now supports: ${categoryColumn.Type}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding watch category:', error);
    process.exit(1);
  }
}

addWatchCategory();

