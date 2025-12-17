const { query } = require('./config/database');

async function inspectData() {
  try {
    console.log('Inspecting database...');
    
    // Check users
    const users = await query('SELECT count(*) as count FROM users');
    console.log(`Users count: ${users[0].count}`);
    
    // Check products
    const products = await query('SELECT count(*) as count FROM products');
    console.log(`Products count: ${products[0].count}`);
    
    // Check existing reviews
    const reviews = await query('SELECT count(*) as count FROM reviews');
    console.log(`Reviews count: ${reviews[0].count}`);
    
    // Get sample users and products to verify IDs
    const sampleUsers = await query('SELECT id, name FROM users LIMIT 5');
    console.log('Sample users:', sampleUsers);
    
    const sampleProducts = await query('SELECT id, name FROM products LIMIT 5');
    console.log('Sample products:', sampleProducts);
    
    process.exit(0);
  } catch (error) {
    console.error('Error inspecting data:', error);
    process.exit(1);
  }
}

inspectData();
