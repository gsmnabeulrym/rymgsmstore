const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function addMoreAnalyticsData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Add more orders with recent dates for better analytics
    console.log('➕ Adding more recent orders...');
    const moreOrders = [
      { user_id: 1, total_amount: 2800.00, status: 'completed', created_at: '2024-10-01 09:30:00' },
      { user_id: 2, total_amount: 1200.50, status: 'completed', created_at: '2024-10-01 11:15:00' },
      { user_id: 3, total_amount: 950.00, status: 'completed', created_at: '2024-10-01 14:45:00' },
      { user_id: 1, total_amount: 1650.00, status: 'completed', created_at: '2024-10-01 16:20:00' },
      { user_id: 2, total_amount: 750.75, status: 'completed', created_at: '2024-10-02 08:10:00' },
      { user_id: 3, total_amount: 2100.00, status: 'completed', created_at: '2024-10-02 10:30:00' },
      { user_id: 1, total_amount: 890.25, status: 'processing', created_at: '2024-10-02 09:45:00' },
      { user_id: 2, total_amount: 1420.00, status: 'pending', created_at: '2024-10-02 10:00:00' }
    ];

    for (const order of moreOrders) {
      try {
        await connection.execute(
          'INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, ?)',
          [order.user_id, order.total_amount, order.status, order.created_at]
        );
      } catch (error) {
        // Skip if duplicate
      }
    }

    // Check if order_items table exists, if not create it
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          product_id INT,
          quantity INT NOT NULL DEFAULT 1,
          price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id)
        )
      `);
      console.log('✅ Order items table ready');
    } catch (error) {
      console.log('⚠️ Order items table issue:', error.message);
    }

    // Add sample order items
    console.log('➕ Adding order items...');
    const [orders] = await connection.execute('SELECT id FROM orders ORDER BY id DESC LIMIT 10');
    const [products] = await connection.execute('SELECT id, price FROM products LIMIT 10');
    
    if (products.length > 0) {
      for (const order of orders) {
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
        for (let i = 0; i < numItems; i++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
          
          try {
            await connection.execute(
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [order.id, randomProduct.id, quantity, randomProduct.price]
            );
          } catch (error) {
            // Skip duplicates
          }
        }
      }
    }

    // Add more chatbot conversations with varied content
    console.log('➕ Adding more chatbot conversations...');
    const moreChatbotData = [
      { session_id: 'session_009', user_message: 'iPhone 15 Pro Max price?', bot_response: 'iPhone 15 Pro Max starts at 3200 DT. It has the best camera and performance!' },
      { session_id: 'session_010', user_message: 'Samsung Galaxy S24 features', bot_response: 'Galaxy S24 has amazing AI features, 200MP camera, and great battery life.' },
      { session_id: 'session_011', user_message: 'I need a phone under 1000 DT', bot_response: 'Great! I can recommend several excellent phones under 1000 DT. What features matter most?' },
      { session_id: 'session_012', user_message: 'Gaming phone recommendations', bot_response: 'For gaming, I recommend phones with high refresh rates and powerful processors.' },
      { session_id: 'session_013', user_message: 'Terrible customer service', bot_response: 'I apologize for your bad experience. Let me help make this right for you.' },
      { session_id: 'session_014', user_message: 'Best camera phone 2024', bot_response: 'The iPhone 15 Pro and Galaxy S24 Ultra have the best cameras this year!' },
      { session_id: 'session_015', user_message: 'Warranty information', bot_response: 'All phones come with 2-year manufacturer warranty and 14-day return policy.' },
      { session_id: 'session_016', user_message: 'Payment methods available', bot_response: 'We accept credit cards, bank transfers, and cash on delivery.' },
      { session_id: 'session_017', user_message: 'Excellent service thank you', bot_response: 'You are very welcome! I am so happy I could help you today.' },
      { session_id: 'session_018', user_message: 'Phone battery replacement', bot_response: 'We offer battery replacement services for most phone models.' }
    ];

    for (const conv of moreChatbotData) {
      try {
        await connection.execute(
          'INSERT INTO chatbot_conversations (session_id, user_message, bot_response, created_at) VALUES (?, ?, ?, ?)',
          [conv.session_id, conv.user_message, conv.bot_response, new Date()]
        );
      } catch (error) {
        // Skip duplicates
      }
    }

    // Update products to have stock_quantity if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 50
      `);
      
      // Set some products to low stock for analytics
      await connection.execute(`
        UPDATE products SET stock_quantity = FLOOR(RAND() * 100) + 1 WHERE stock_quantity IS NULL
      `);
      
      await connection.execute(`
        UPDATE products SET stock_quantity = FLOOR(RAND() * 5) + 1 WHERE id IN (1, 3, 5) 
      `);
      
      console.log('✅ Stock quantities updated');
    } catch (error) {
      console.log('⚠️ Stock update issue:', error.message);
    }

    console.log('\n🎉 Additional analytics data setup completed!');
    
    // Show summary
    const [orderCount] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [chatbotCount] = await connection.execute('SELECT COUNT(*) as count FROM chatbot_conversations');
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    
    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${userCount[0].count}`);
    console.log(`📦 Orders: ${orderCount[0].count}`);
    console.log(`📱 Products: ${productCount[0].count}`);
    console.log(`🤖 Chatbot Conversations: ${chatbotCount[0].count}`);

  } catch (error) {
    console.error('❌ Error adding analytics data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
addMoreAnalyticsData();
