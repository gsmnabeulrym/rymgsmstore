const db = require('../config/database');

async function addLaptopCategory() {
  try {
    console.log('🔄 Adding "laptop" category to products table...');
    
    // Modify the ENUM to include 'laptop'
    const sql = `ALTER TABLE products MODIFY COLUMN category ENUM('phone', 'accessory', 'watch', 'tablet', 'laptop') DEFAULT 'phone'`;
    await db.pool.execute(sql);
    
    console.log('✅ Successfully added "laptop" category to products table');
    
    // Verify the change
    const [columns] = await db.pool.execute('DESCRIBE products');
    const categoryColumn = columns.find(col => col.Field === 'category');
    console.log(`📊 Category column now supports: ${categoryColumn.Type}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding laptop category:', error);
    process.exit(1);
  }
}

addLaptopCategory();

