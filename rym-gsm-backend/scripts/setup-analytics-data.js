const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'rym_gsm'
};

async function setupAnalyticsData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check existing tables
    console.log('\n📋 Checking existing tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Existing tables:', tables.map(t => Object.values(t)[0]));

    // Check if orders table exists and has data
    try {
      const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
      console.log(`📦 Orders table: ${orders[0].count} records`);
      
      if (orders[0].count === 0) {
        console.log('➕ Adding sample orders...');
        await addSampleOrders(connection);
      }
    } catch (error) {
      console.log('⚠️ Orders table might not exist or has issues');
      await createOrdersTable(connection);
      await addSampleOrders(connection);
    }

    // Check if users table exists and has data
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Users table: ${users[0].count} records`);
      
      if (users[0].count === 0) {
        console.log('➕ Adding sample users...');
        await addSampleUsers(connection);
      }
    } catch (error) {
      console.log('⚠️ Users table might not exist');
    }

    // Create chatbot_conversations table if it doesn't exist
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS chatbot_conversations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          user_message TEXT NOT NULL,
          bot_response TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Chatbot conversations table ready');
      
      // Add sample chatbot data
      const [chatbotCount] = await connection.execute('SELECT COUNT(*) as count FROM chatbot_conversations');
      if (chatbotCount[0].count === 0) {
        await addSampleChatbotData(connection);
      }
    } catch (error) {
      console.log('⚠️ Error with chatbot table:', error.message);
    }

    console.log('\n🎉 Analytics data setup completed!');

  } catch (error) {
    console.error('❌ Error setting up analytics data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createOrdersTable(connection) {
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);
    
    console.log('✅ Orders tables created');
  } catch (error) {
    console.log('⚠️ Error creating orders table:', error.message);
  }
}

async function addSampleOrders(connection) {
  try {
    const sampleOrders = [
      { user_id: 1, total_amount: 1200.00, status: 'completed', created_at: '2024-09-25 10:30:00' },
      { user_id: 2, total_amount: 850.50, status: 'completed', created_at: '2024-09-26 14:15:00' },
      { user_id: 3, total_amount: 2100.00, status: 'completed', created_at: '2024-09-27 09:45:00' },
      { user_id: 1, total_amount: 650.00, status: 'completed', created_at: '2024-09-28 16:20:00' },
      { user_id: 4, total_amount: 1450.75, status: 'completed', created_at: '2024-09-29 11:10:00' },
      { user_id: 2, total_amount: 980.00, status: 'completed', created_at: '2024-09-30 13:30:00' },
      { user_id: 5, total_amount: 1750.25, status: 'completed', created_at: '2024-10-01 08:45:00' },
      { user_id: 3, total_amount: 420.00, status: 'completed', created_at: '2024-10-01 15:20:00' },
      { user_id: 6, total_amount: 890.50, status: 'processing', created_at: '2024-10-02 09:15:00' },
      { user_id: 1, total_amount: 1320.00, status: 'pending', created_at: '2024-10-02 10:00:00' }
    ];

    for (const order of sampleOrders) {
      await connection.execute(
        'INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, ?, ?)',
        [order.user_id, order.total_amount, order.status, order.created_at]
      );
    }

    console.log('✅ Sample orders added');
  } catch (error) {
    console.log('⚠️ Error adding sample orders:', error.message);
  }
}

async function addSampleUsers(connection) {
  try {
    const sampleUsers = [
      { email: 'customer1@example.com', name: 'Ahmed Ben Ali' },
      { email: 'customer2@example.com', name: 'Fatma Trabelsi' },
      { email: 'customer3@example.com', name: 'Mohamed Gharbi' },
      { email: 'customer4@example.com', name: 'Leila Mansouri' },
      { email: 'customer5@example.com', name: 'Karim Bouazizi' },
      { email: 'customer6@example.com', name: 'Amira Jebali' }
    ];

    for (const user of sampleUsers) {
      try {
        await connection.execute(
          'INSERT INTO users (email, name, created_at) VALUES (?, ?, NOW())',
          [user.email, user.name]
        );
      } catch (error) {
        // User might already exist, skip
      }
    }

    console.log('✅ Sample users added');
  } catch (error) {
    console.log('⚠️ Error adding sample users:', error.message);
  }
}

async function addSampleChatbotData(connection) {
  try {
    const sampleConversations = [
      { session_id: 'session_001', user_message: 'Do you have any promotions?', bot_response: 'Yes! We have great deals on iPhones and Samsung phones.' },
      { session_id: 'session_002', user_message: 'What is the price of iPhone 15?', bot_response: 'The iPhone 15 starts at 2800 DT. Would you like to see more details?' },
      { session_id: 'session_003', user_message: 'I love the camera quality', bot_response: 'Great! Our phones have excellent cameras. Which brand interests you most?' },
      { session_id: 'session_004', user_message: 'Samsung vs iPhone comparison', bot_response: 'Both are excellent! iPhone has iOS ecosystem, Samsung has more variety and features.' },
      { session_id: 'session_005', user_message: 'I am frustrated with my current phone', bot_response: 'I understand your frustration. Let me help you find a better phone that meets your needs.' },
      { session_id: 'session_006', user_message: 'What about battery life?', bot_response: 'Battery life varies by model. iPhones typically last 15-20 hours, Samsung flagships similar.' },
      { session_id: 'session_007', user_message: 'This is amazing service!', bot_response: 'Thank you so much! I am happy to help you find the perfect phone.' },
      { session_id: 'session_008', user_message: 'Shipping information please', bot_response: 'We offer free shipping on orders over 100 DT. Delivery takes 2-3 business days.' }
    ];

    for (const conv of sampleConversations) {
      await connection.execute(
        'INSERT INTO chatbot_conversations (session_id, user_message, bot_response, created_at) VALUES (?, ?, ?, NOW())',
        [conv.session_id, conv.user_message, conv.bot_response]
      );
    }

    console.log('✅ Sample chatbot conversations added');
  } catch (error) {
    console.log('⚠️ Error adding chatbot data:', error.message);
  }
}

// Run the setup
setupAnalyticsData();
