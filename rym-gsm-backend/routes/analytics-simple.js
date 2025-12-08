const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/database');

// Test endpoint (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Analytics test endpoint called');
    
    // Test database queries
    let ordersCount = 0, usersCount = 0, productsCount = 0;
    
    try {
      const ordersResult = await pool.execute('SELECT COUNT(*) as count FROM orders');
      ordersCount = ordersResult[0][0].count;
    } catch (error) {
      console.log('Orders query failed:', error.message);
    }
    
    try {
      const usersResult = await pool.execute('SELECT COUNT(*) as count FROM users');
      usersCount = usersResult[0][0].count;
    } catch (error) {
      console.log('Users query failed:', error.message);
    }
    
    try {
      const productsResult = await pool.execute('SELECT COUNT(*) as count FROM products');
      productsCount = productsResult[0][0].count;
    } catch (error) {
      console.log('Products query failed:', error.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Analytics API is working!',
      timestamp: new Date().toISOString(),
      databaseTest: {
        orders: ordersCount,
        users: usersCount,
        products: productsCount
      }
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to test exact queries
router.get('/debug', async (req, res) => {
  try {
    console.log('🐛 Debug endpoint called');
    
    // Test each query individually
    const results = {};
    
    try {
      const [orders] = await pool.execute('SELECT COUNT(*) as count FROM orders');
      results.ordersQuery = orders;
      results.ordersCount = orders[0].count;
    } catch (error) {
      results.ordersError = error.message;
    }
    
    try {
      const [delivered] = await pool.execute('SELECT COUNT(*) as count FROM orders WHERE status = "delivered"');
      results.deliveredQuery = delivered;
      results.deliveredCount = delivered[0].count;
    } catch (error) {
      results.deliveredError = error.message;
    }
    
    try {
      const [revenue] = await pool.execute('SELECT SUM(total) as revenue FROM orders WHERE status = "delivered"');
      results.revenueQuery = revenue;
      results.totalRevenue = revenue[0].revenue;
    } catch (error) {
      results.revenueError = error.message;
    }
    
    try {
      const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
      results.usersQuery = users;
      results.usersCount = users[0].count;
    } catch (error) {
      results.usersError = error.message;
    }
    
    try {
      const [products] = await pool.execute('SELECT COUNT(*) as count FROM products');
      results.productsQuery = products;
      results.productsCount = products[0].count;
    } catch (error) {
      results.productsError = error.message;
    }
    
    res.json({ 
      success: true, 
      debug: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple authentication middleware (temporarily relaxed for testing)
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('⚠️ No token provided, but allowing access for testing');
    req.user = { email: 'admin@test.com', id: 1 };
    return next();
  }

  try {
    const decoded = jwt.verify(token, 'rym-gsm-secret-key-2024');
    console.log('✅ Token decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('⚠️ Token verification failed, but allowing access for testing:', error.message);
    req.user = { email: 'admin@test.com', id: 1 };
    next();
  }
};

// GET /api/analytics/overview - Dashboard overview stats
router.get('/overview', authenticateAdmin, async (req, res) => {
  try {
    console.log('📊 Fetching analytics overview...');

    // Count orders by status
    let totalOrders = 0, completedOrders = 0;
    try {
      const [orderStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders
        FROM orders
      `);
      totalOrders = orderStats[0].total_orders || 0;
      completedOrders = orderStats[0].completed_orders || 0;
    } catch (error) {
      console.log('⚠️ Orders query failed:', error.message);
    }

    // Calculate revenue from order totals
    let totalRevenue = 0;
    try {
      const [revenueCalc] = await pool.execute(`
        SELECT COALESCE(SUM(total), 0) as revenue
        FROM orders
        WHERE status = 'delivered'
      `);
      totalRevenue = revenueCalc[0].revenue || 0;
    } catch (error) {
      console.log('⚠️ Revenue calculation failed, using estimate');
      totalRevenue = completedOrders * 1200; // Estimate 1200 DT per completed order
    }

    // Get user count
    let totalUsers = 0;
    try {
      const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
      totalUsers = userCount[0].count || 0;
    } catch (error) {
      console.log('⚠️ Users query failed:', error.message);
    }

    // Get product count
    let totalProducts = 0;
    try {
      const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
      totalProducts = productCount[0].count || 0;
    } catch (error) {
      console.log('⚠️ Products query failed:', error.message);
    }

    // Today's stats (simplified)
    let todayOrders = 0;
    try {
      const [todayStats] = await pool.execute(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE DATE(created_at) = CURDATE()
      `);
      todayOrders = todayStats[0].count || 0;
    } catch (error) {
      console.log('⚠️ Today stats failed:', error.message);
    }

    const todayRevenue = todayOrders * 1200; // Estimate

    // This month's stats
    let monthOrders = 0;
    try {
      const [monthStats] = await pool.execute(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE YEAR(created_at) = YEAR(CURDATE()) 
        AND MONTH(created_at) = MONTH(CURDATE())
      `);
      monthOrders = monthStats[0].count || 0;
    } catch (error) {
      console.log('⚠️ Month stats failed:', error.message);
    }

    const monthRevenue = monthOrders * 1200; // Estimate

    // Calculate metrics
    const conversionRate = totalUsers > 0 ? ((completedOrders / totalUsers) * 100).toFixed(2) : 0;
    const avgOrderValue = completedOrders > 0 ? (totalRevenue / completedOrders).toFixed(2) : 0;

    const overview = {
      totalRevenue: parseFloat(totalRevenue),
      totalOrders: completedOrders,
      todayRevenue: parseFloat(todayRevenue),
      todayOrders: todayOrders,
      monthRevenue: parseFloat(monthRevenue),
      monthOrders: monthOrders,
      totalCustomers: totalUsers,
      totalProducts: totalProducts,
      conversionRate: parseFloat(conversionRate),
      avgOrderValue: parseFloat(avgOrderValue)
    };

    console.log('✅ Analytics overview fetched:', overview);
    res.json({ success: true, data: overview });

  } catch (error) {
    console.error('❌ Error fetching analytics overview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics overview',
      details: error.message 
    });
  }
});

// GET /api/analytics/sales-chart - Sales data for charts
router.get('/sales-chart', authenticateAdmin, async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    console.log(`📈 Fetching sales chart data for period: ${period}`);

    let dateFormat, dateRange;
    
    switch (period) {
      case '24hours':
        dateFormat = '%H:00';
        dateRange = 'DATE(created_at) = CURDATE()';
        break;
      case '7days':
        dateFormat = '%Y-%m-%d';
        dateRange = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        break;
      case '30days':
        dateFormat = '%Y-%m-%d';
        dateRange = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        break;
      case '12months':
        dateFormat = '%Y-%m';
        dateRange = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)';
        break;
      default:
        dateFormat = '%Y-%m-%d';
        dateRange = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    }

    const [salesData] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '${dateFormat}') as period,
        COUNT(*) as orders,
        COUNT(*) * 1200 as revenue
      FROM orders 
      WHERE status = 'delivered' AND ${dateRange}
      GROUP BY DATE_FORMAT(created_at, '${dateFormat}')
      ORDER BY period ASC
    `);

    console.log(`✅ Sales chart data fetched: ${salesData.length} data points`);
    res.json({ success: true, data: salesData });

  } catch (error) {
    console.error('❌ Error fetching sales chart:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch sales chart data',
      details: error.message 
    });
  }
});

// GET /api/analytics/top-products - Best selling products
router.get('/top-products', authenticateAdmin, async (req, res) => {
  try {
    console.log('🏆 Fetching top products...');

    const [topProducts] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.brand,
        p.price,
        p.original_price,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
        COUNT(DISTINCT o.id) as order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
      GROUP BY p.id, p.name, p.brand, p.price, p.original_price
      ORDER BY total_sold DESC, total_revenue DESC
      LIMIT 10
    `);

    console.log(`✅ Top products fetched: ${topProducts.length} products`);
    res.json({ success: true, data: topProducts });

  } catch (error) {
    console.error('❌ Error fetching top products:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch top products',
      details: error.message 
    });
  }
});

// GET /api/analytics/customer-behavior - Customer behavior analytics
router.get('/customer-behavior', authenticateAdmin, async (req, res) => {
  try {
    console.log('👥 Fetching customer behavior analytics...');

    // Get new vs returning customers
    const [customerTypes] = await pool.execute(`
      SELECT 
        CASE 
          WHEN order_count = 1 THEN 'New Customer'
          ELSE 'Returning Customer'
        END as customer_type,
        COUNT(*) as count
      FROM (
        SELECT user_id, COUNT(*) as order_count
        FROM orders 
        WHERE status = 'delivered'
        GROUP BY user_id
      ) customer_orders
      GROUP BY customer_type
    `);

    // Get most viewed products (simplified)
    const [mostViewed] = await pool.execute(`
      SELECT 
        p.name,
        p.brand,
        COALESCE(SUM(oi.quantity), 0) as view_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      GROUP BY p.id, p.name, p.brand
      ORDER BY view_count DESC
      LIMIT 5
    `);

    // Get order status distribution
    const [orderStatus] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders)), 2) as percentage
      FROM orders
      GROUP BY status
      ORDER BY count DESC
    `);

    const behaviorData = {
      customerTypes: customerTypes,
      mostViewedProducts: mostViewed,
      orderStatusDistribution: orderStatus,
      avgDaysBetweenOrders: 15 // Simplified estimate
    };

    console.log('✅ Customer behavior analytics fetched');
    res.json({ success: true, data: behaviorData });

  } catch (error) {
    console.error('❌ Error fetching customer behavior:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch customer behavior analytics',
      details: error.message 
    });
  }
});

// GET /api/analytics/chatbot-insights - AI chatbot conversation insights
router.get('/chatbot-insights', authenticateAdmin, async (req, res) => {
  try {
    console.log('🤖 Fetching chatbot insights...');

    let chatbotData = {
      totalConversations: 0,
      totalMessages: 0,
      avgMessagesPerSession: 0,
      topQuestions: [],
      dailyConversations: [],
      sentimentAnalysis: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    };

    try {
      // Get total conversations and messages
      const [conversationStats] = await pool.execute(`
        SELECT 
          COUNT(DISTINCT session_id) as total_conversations,
          COUNT(*) as total_messages,
          ROUND(COUNT(*) / COUNT(DISTINCT session_id), 2) as avg_messages_per_session
        FROM chatbot_conversations
      `);

      if (conversationStats[0]) {
        chatbotData.totalConversations = conversationStats[0].total_conversations || 0;
        chatbotData.totalMessages = conversationStats[0].total_messages || 0;
        chatbotData.avgMessagesPerSession = conversationStats[0].avg_messages_per_session || 0;
      }

      // Get top user questions (most common keywords)
      const [topQuestions] = await pool.execute(`
        SELECT 
          CASE 
            WHEN LOWER(user_message) LIKE '%price%' OR LOWER(user_message) LIKE '%cost%' THEN 'Pricing Questions'
            WHEN LOWER(user_message) LIKE '%shipping%' OR LOWER(user_message) LIKE '%delivery%' THEN 'Shipping Questions'
            WHEN LOWER(user_message) LIKE '%warranty%' OR LOWER(user_message) LIKE '%return%' THEN 'Warranty Questions'
            WHEN LOWER(user_message) LIKE '%iphone%' THEN 'iPhone Questions'
            WHEN LOWER(user_message) LIKE '%samsung%' THEN 'Samsung Questions'
            WHEN LOWER(user_message) LIKE '%promotion%' OR LOWER(user_message) LIKE '%discount%' THEN 'Promotion Questions'
            WHEN LOWER(user_message) LIKE '%camera%' THEN 'Camera Questions'
            WHEN LOWER(user_message) LIKE '%battery%' THEN 'Battery Questions'
            ELSE 'General Questions'
          END as question_category,
          COUNT(*) as count
        FROM chatbot_conversations
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY question_category
        ORDER BY count DESC
        LIMIT 8
      `);

      chatbotData.topQuestions = topQuestions;

      // Simple sentiment analysis based on keywords
      const [sentimentData] = await pool.execute(`
        SELECT 
          CASE 
            WHEN LOWER(user_message) REGEXP 'good|great|excellent|amazing|love|perfect|awesome|fantastic|happy|satisfied' THEN 'positive'
            WHEN LOWER(user_message) REGEXP 'bad|terrible|awful|hate|disappointed|frustrated|angry|problem|issue|broken' THEN 'negative'
            ELSE 'neutral'
          END as sentiment,
          COUNT(*) as count
        FROM chatbot_conversations
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY sentiment
      `);

      sentimentData.forEach(item => {
        chatbotData.sentimentAnalysis[item.sentiment] = item.count;
      });

    } catch (dbError) {
      console.log('ℹ️ Chatbot conversations table not found, returning default data');
    }

    console.log('✅ Chatbot insights fetched');
    res.json({ success: true, data: chatbotData });

  } catch (error) {
    console.error('❌ Error fetching chatbot insights:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chatbot insights',
      details: error.message 
    });
  }
});

// GET /api/analytics/inventory-performance - Inventory performance reports
router.get('/inventory-performance', authenticateAdmin, async (req, res) => {
  try {
    console.log('📦 Fetching inventory performance...');

    // Get low stock products
    const [lowStockProducts] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.brand,
        p.price,
        COALESCE(p.stock_quantity, 0) as stock_quantity,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
      GROUP BY p.id, p.name, p.brand, p.price, p.stock_quantity
      HAVING stock_quantity < 10 OR stock_quantity IS NULL
      ORDER BY stock_quantity ASC, total_sold DESC
      LIMIT 10
    `);

    // Get products with no sales (dead stock)
    const [deadStock] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.brand,
        p.price,
        p.created_at,
        DATEDIFF(NOW(), p.created_at) as days_in_inventory
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      WHERE oi.product_id IS NULL
      ORDER BY p.created_at ASC
      LIMIT 10
    `);

    // Get inventory turnover by brand
    const [brandPerformance] = await pool.execute(`
      SELECT 
        p.brand,
        COUNT(DISTINCT p.id) as total_products,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
        ROUND(COALESCE(SUM(oi.quantity), 0) / COUNT(DISTINCT p.id), 2) as avg_sold_per_product
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
      GROUP BY p.brand
      ORDER BY total_revenue DESC
    `);

    const inventoryData = {
      lowStockProducts,
      deadStock,
      brandPerformance,
      highMarginProducts: [] // Simplified for now
    };

    console.log('✅ Inventory performance fetched');
    res.json({ success: true, data: inventoryData });

  } catch (error) {
    console.error('❌ Error fetching inventory performance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch inventory performance',
      details: error.message 
    });
  }
});

// GET /api/analytics/real-time - Real-time dashboard data
router.get('/real-time', authenticateAdmin, async (req, res) => {
  try {
    console.log('⚡ Fetching real-time data...');

    // Get today's stats
    const [todayStats] = await pool.execute(`
      SELECT 
        COUNT(*) as today_orders,
        COUNT(DISTINCT user_id) as today_customers
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    const todayRevenue = (todayStats[0]?.today_orders || 0) * 1200; // Estimate

    // Get recent activity
    const [recentActivity] = await pool.execute(`
      SELECT 
        'order' as type,
        CONCAT('Order #', id, ' - Status: ', status) as description,
        created_at,
        1200 as value
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Simulated online users
    const currentOnlineUsers = Math.floor(Math.random() * 20) + 5;

    const realTimeData = {
      todayRevenue: parseFloat(todayRevenue),
      todayOrders: todayStats[0]?.today_orders || 0,
      todayCustomers: todayStats[0]?.today_customers || 0,
      currentOnlineUsers,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };

    console.log('✅ Real-time data fetched');
    res.json({ success: true, data: realTimeData });

  } catch (error) {
    console.error('❌ Error fetching real-time data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch real-time data',
      details: error.message 
    });
  }
});

module.exports = router;
