const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rym_gsm'
};

async function addOrderItems() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check current orders
    const [orders] = await connection.execute('SELECT id, status, created_at FROM orders ORDER BY id');
    console.log(`📦 Found ${orders.length} orders`);

    // Check current products
    const [products] = await connection.execute('SELECT id, name, price FROM products');
    console.log(`📱 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('⚠️ No products found, cannot create order items');
      return;
    }

    // Clear existing order_items to avoid duplicates
    try {
      await connection.execute('DELETE FROM order_items');
      console.log('🧹 Cleared existing order items');
    } catch (error) {
      console.log('ℹ️ No existing order items to clear');
    }

    // Add order items for each order
    let itemsAdded = 0;
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
          itemsAdded++;
        } catch (error) {
          console.log(`⚠️ Failed to add item for order ${order.id}:`, error.message);
        }
      }
    }

    console.log(`✅ Added ${itemsAdded} order items`);

    // Update order statuses to have more completed orders
    const completedOrderIds = orders.slice(0, Math.floor(orders.length * 0.7)).map(o => o.id);
    if (completedOrderIds.length > 0) {
      await connection.execute(
        `UPDATE orders SET status = 'completed' WHERE id IN (${completedOrderIds.join(',')})`
      );
      console.log(`✅ Updated ${completedOrderIds.length} orders to completed status`);
    }

    // Show summary
    const [orderItemCount] = await connection.execute('SELECT COUNT(*) as count FROM order_items');
    const [completedCount] = await connection.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    const [totalRevenue] = await connection.execute(`
      SELECT COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `);

    console.log('\n📊 Analytics Data Summary:');
    console.log(`📦 Total Orders: ${orders.length}`);
    console.log(`✅ Completed Orders: ${completedCount[0].count}`);
    console.log(`🛒 Order Items: ${orderItemCount[0].count}`);
    console.log(`💰 Total Revenue: ${totalRevenue[0].revenue} DT`);
    console.log(`📱 Products: ${products.length}`);

  } catch (error) {
    console.error('❌ Error adding order items:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addOrderItems();
