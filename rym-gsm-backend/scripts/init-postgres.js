require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing PostgreSQL database...\n');

    // Create tables
    console.log('📦 Creating tables...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ users table created');

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        images TEXT,
        specs TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ products table created');

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        products TEXT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ orders table created');

    // Cart table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        products TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ cart table created');

    // Wishlist table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);
    console.log('  ✅ wishlist table created');

    // Reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ reviews table created');

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        type VARCHAR(50),
        title VARCHAR(255),
        message TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ notifications table created');

    // Seed initial data
    console.log('\n🌱 Seeding initial data...');

    // Check if admin exists
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', ['admin@rymgsm.com']);
    
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      
      // Create admin user
      await client.query(`
        INSERT INTO users (name, email, password, phone, address, role)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['Admin User', 'admin@rymgsm.com', hashedPassword, '+216 12 345 678', 'Tunis, Tunisia', 'admin']);
      console.log('  ✅ Admin user created (admin@rymgsm.com / password)');

      // Create test user
      await client.query(`
        INSERT INTO users (name, email, password, phone, address, role)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['Test User', 'user@test.com', hashedPassword, '+216 98 765 432', 'Sfax, Tunisia', 'user']);
      console.log('  ✅ Test user created (user@test.com / password)');
    } else {
      console.log('  ⏭️  Users already exist, skipping...');
    }

    // Check if products exist
    const productCheck = await client.query('SELECT id FROM products LIMIT 1');
    
    if (productCheck.rows.length === 0) {
      // Seed products
      const products = [
        {
          name: 'iPhone 15 Pro',
          brand: 'Apple',
          price: 4999.00,
          stock: 25,
          category: 'phone',
          images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500']),
          specs: JSON.stringify({ ram: '8GB', storage: '256GB', camera: '48MP', battery: '3274 mAh' }),
          description: 'Le dernier iPhone avec design en titane et système de caméra avancé.'
        },
        {
          name: 'Samsung Galaxy S24 Ultra',
          brand: 'Samsung',
          price: 4499.00,
          stock: 30,
          category: 'phone',
          images: JSON.stringify(['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500']),
          specs: JSON.stringify({ ram: '12GB', storage: '256GB', camera: '200MP', battery: '5000 mAh' }),
          description: 'Le smartphone Samsung le plus puissant avec S Pen intégré.'
        },
        {
          name: 'MacBook Pro 14"',
          brand: 'Apple',
          price: 7999.00,
          stock: 15,
          category: 'laptop',
          images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500']),
          specs: JSON.stringify({ ram: '16GB', storage: '512GB SSD', display: '14.2" Liquid Retina XDR' }),
          description: 'MacBook Pro avec puce M3 Pro pour les professionnels.'
        },
        {
          name: 'AirPods Pro 2',
          brand: 'Apple',
          price: 899.00,
          stock: 50,
          category: 'accessory',
          images: JSON.stringify(['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500']),
          specs: JSON.stringify({ type: 'In-ear', noise_cancellation: 'Active', battery: '6h' }),
          description: 'Écouteurs sans fil avec réduction de bruit active.'
        },
        {
          name: 'iPad Pro 12.9"',
          brand: 'Apple',
          price: 5499.00,
          stock: 20,
          category: 'tablet',
          images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500']),
          specs: JSON.stringify({ ram: '8GB', storage: '256GB', display: '12.9" Liquid Retina XDR' }),
          description: 'La tablette la plus puissante avec puce M2.'
        }
      ];

      for (const product of products) {
        await client.query(`
          INSERT INTO products (name, brand, price, stock, category, images, specs, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [product.name, product.brand, product.price, product.stock, product.category, product.images, product.specs, product.description]);
      }
      console.log('  ✅ Sample products created');
    } else {
      console.log('  ⏭️  Products already exist, skipping...');
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\n📋 Summary:');
    console.log('   - Tables: users, products, orders, cart, wishlist, reviews, notifications');
    console.log('   - Admin: admin@rymgsm.com / password');
    console.log('   - User: user@test.com / password');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch(console.error);
