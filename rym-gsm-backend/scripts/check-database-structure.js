const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function checkDatabaseStructure() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check orders table structure
    console.log('\n📦 Orders table structure:');
    try {
      const [columns] = await connection.execute('DESCRIBE orders');
      console.table(columns);
      
      const [sampleOrders] = await connection.execute('SELECT * FROM orders LIMIT 3');
      console.log('\nSample orders:');
      console.table(sampleOrders);
    } catch (error) {
      console.log('❌ Orders table error:', error.message);
    }

    // Check users table structure
    console.log('\n👥 Users table structure:');
    try {
      const [columns] = await connection.execute('DESCRIBE users');
      console.table(columns);
    } catch (error) {
      console.log('❌ Users table error:', error.message);
    }

    // Check products table structure
    console.log('\n📱 Products table structure:');
    try {
      const [columns] = await connection.execute('DESCRIBE products');
      console.table(columns);
    } catch (error) {
      console.log('❌ Products table error:', error.message);
    }

    // Check if order_items exists
    console.log('\n🛒 Order items table structure:');
    try {
      const [columns] = await connection.execute('DESCRIBE order_items');
      console.table(columns);
    } catch (error) {
      console.log('❌ Order items table error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error checking database structure:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the check
checkDatabaseStructure();
