const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function checkAndFixOrders() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Get all orders with their details
    const [orders] = await connection.execute('SELECT * FROM orders ORDER BY id');
    console.log(`📦 Found ${orders.length} orders:`);
    orders.forEach(order => {
      console.log(`Order ${order.id}: Status=${order.status}, User=${order.user_id}, Created=${order.created_at}`);
    });

    if (orders.length === 0) {
      console.log('⚠️ No orders found! Creating sample orders...');
      
      // Create sample orders
      const sampleOrders = [
        { user_id: 1, status: 'completed' },
        { user_id: 2, status: 'completed' },
        { user_id: 1, status: 'completed' },
        { user_id: 3, status: 'processing' },
        { user_id: 2, status: 'pending' }
      ];

      for (const order of sampleOrders) {
        await connection.execute(
          'INSERT INTO orders (user_id, status, created_at) VALUES (?, ?, NOW())',
          [order.user_id, order.status]
        );
      }
      
      console.log('✅ Created 5 sample orders');
      
      // Get the new orders
      const [newOrders] = await connection.execute('SELECT * FROM orders ORDER BY id');
      console.log('New orders created:');
      newOrders.forEach(order => {
        console.log(`Order ${order.id}: Status=${order.status}, User=${order.user_id}`);
      });
      
      return;
    }

    // Update existing orders to have proper statuses
    const orderIds = orders.map(o => o.id);
    const completedIds = orderIds.slice(0, Math.ceil(orderIds.length * 0.6)); // 60% completed
    const processingIds = orderIds.slice(completedIds.length, completedIds.length + 1); // 1 processing
    
    if (completedIds.length > 0) {
      await connection.execute(
        `UPDATE orders SET status = 'completed' WHERE id IN (${completedIds.join(',')})`
      );
      console.log(`✅ Updated orders ${completedIds.join(', ')} to completed`);
    }
    
    if (processingIds.length > 0) {
      await connection.execute(
        `UPDATE orders SET status = 'processing' WHERE id IN (${processingIds.join(',')})`
      );
      console.log(`✅ Updated orders ${processingIds.join(', ')} to processing`);
    }

    // Check order_items
    const [orderItems] = await connection.execute('SELECT * FROM order_items');
    console.log(`🛒 Found ${orderItems.length} order items`);

    if (orderItems.length === 0) {
      console.log('⚠️ No order items found! Adding sample order items...');
      
      const [products] = await connection.execute('SELECT id, price FROM products LIMIT 5');
      if (products.length > 0) {
        for (const order of orders) {
          const numItems = Math.floor(Math.random() * 2) + 1; // 1-2 items per order
          for (let i = 0; i < numItems; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
            
            await connection.execute(
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [order.id, randomProduct.id, quantity, randomProduct.price]
            );
          }
        }
        console.log('✅ Added order items for all orders');
      }
    }

    // Final summary
    const [finalStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders
      FROM orders
    `);

    const [revenueStats] = await connection.execute(`
      SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `);

    const [itemCount] = await connection.execute('SELECT COUNT(*) as count FROM order_items');

    console.log('\n📊 Final Database Summary:');
    console.log(`📦 Total Orders: ${finalStats[0].total_orders}`);
    console.log(`✅ Completed Orders: ${finalStats[0].completed_orders}`);
    console.log(`🔄 Processing Orders: ${finalStats[0].processing_orders}`);
    console.log(`⏳ Pending Orders: ${finalStats[0].pending_orders}`);
    console.log(`🛒 Order Items: ${itemCount[0].count}`);
    console.log(`💰 Total Revenue: ${revenueStats[0].total_revenue} DT`);

  } catch (error) {
    console.error('❌ Error checking and fixing orders:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
checkAndFixOrders();
