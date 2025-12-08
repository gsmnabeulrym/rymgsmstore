const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server');

    // Create database and tables
    const schema = `
      -- Create database
      CREATE DATABASE IF NOT EXISTS rym_gsm;
      USE rym_gsm;

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          role ENUM('user', 'admin') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Products table
      CREATE TABLE IF NOT EXISTS products (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(200) NOT NULL,
          brand VARCHAR(50) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          stock INT DEFAULT 0,
          category ENUM('phone', 'accessory') DEFAULT 'phone',
          images JSON,
          specs JSON,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Orders table
      CREATE TABLE IF NOT EXISTS orders (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          products JSON NOT NULL,
          total DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
          shipping_address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Cart table
      CREATE TABLE IF NOT EXISTS cart (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          products JSON NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Reviews table
      CREATE TABLE IF NOT EXISTS reviews (
          id INT PRIMARY KEY AUTO_INCREMENT,
          product_id INT NOT NULL,
          user_id INT NOT NULL,
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_product_review (user_id, product_id)
      );

      -- Wishlist table
      CREATE TABLE IF NOT EXISTS wishlist (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_product (user_id, product_id)
      );

      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          type ENUM('order_update', 'stock_alert', 'price_drop', 'promotion', 'new_product', 'system') NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          data JSON,
          read_status TINYINT(1) DEFAULT 0,
          read_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_read_status (read_status),
          INDEX idx_created_at (created_at),
          INDEX idx_type (type)
      );

      -- Notification preferences table
      CREATE TABLE IF NOT EXISTS notification_preferences (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL UNIQUE,
          order_updates TINYINT(1) DEFAULT 1,
          stock_alerts TINYINT(1) DEFAULT 1,
          price_drops TINYINT(1) DEFAULT 1,
          new_products TINYINT(1) DEFAULT 0,
          promotions TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await connection.query(schema);
    console.log('Database schema created successfully');

    // Switch to the rym_gsm database
    await connection.query('USE rym_gsm');

    // Hash the default password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Clear existing data (in correct order due to foreign keys)
    await connection.query('DELETE FROM notifications');
    await connection.query('DELETE FROM notification_preferences');
    await connection.query('DELETE FROM wishlist');
    await connection.query('DELETE FROM reviews');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM cart');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM users');

    // Insert admin user
    await connection.execute(
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin User', 'admin@rymgsm.com', hashedPassword, 'admin', '+1234567890', '123 Admin St, City, State']
    );

    // Insert regular user
    await connection.execute(
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      ['John Doe', 'john@example.com', hashedPassword, 'user', '+1234567891', '456 User Ave, City, State']
    );

    // Insert sample products
    const products = [
      ['iPhone 15 Pro', 'Apple', 999.99, 25, 'phone', 
       '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", "https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500"]',
       '{"ram": "8GB", "storage": "128GB", "camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto", "battery": "3274 mAh", "display": "6.1-inch Super Retina XDR", "processor": "A17 Pro chip"}',
       'The latest iPhone with titanium design and advanced camera system.'],
      
      ['Samsung Galaxy S24 Ultra', 'Samsung', 1199.99, 20, 'phone',
       '["https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]',
       '{"ram": "12GB", "storage": "256GB", "camera": "200MP Main, 12MP Ultra Wide, 10MP Telephoto, 10MP Periscope", "battery": "5000 mAh", "display": "6.8-inch Dynamic AMOLED 2X", "processor": "Snapdragon 8 Gen 3"}',
       'Premium Android flagship with S Pen and advanced AI features.'],
      
      ['Google Pixel 8 Pro', 'Google', 899.99, 15, 'phone',
       '["https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]',
       '{"ram": "12GB", "storage": "128GB", "camera": "50MP Main, 48MP Ultra Wide, 48MP Telephoto", "battery": "5050 mAh", "display": "6.7-inch LTPO OLED", "processor": "Google Tensor G3"}',
       'AI-powered smartphone with exceptional camera capabilities.'],
      
      ['AirPods Pro (2nd Gen)', 'Apple', 249.99, 50, 'accessory',
       '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"]',
       '{"battery": "Up to 6 hours listening time", "connectivity": "Bluetooth 5.3", "features": "Active Noise Cancellation, Spatial Audio, Adaptive Transparency", "case": "MagSafe Charging Case"}',
       'Premium wireless earbuds with active noise cancellation.']
    ];

    for (const product of products) {
      await connection.execute(
        'INSERT INTO products (name, brand, price, stock, category, images, specs, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }
    console.log('Sample data inserted successfully');

    console.log('\n✅ Database setup completed successfully!');
    console.log('📧 Admin credentials: admin@rymgsm.com / password');
    console.log('👤 User credentials: john@example.com / password');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
