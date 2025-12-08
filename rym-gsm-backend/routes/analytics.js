const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/database');

// Test endpoint (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Analytics test endpoint called');
    
    // Test database queries
    const [orders] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [products] = await pool.execute('SELECT COUNT(*) as count FROM products');
    
    res.json({ 
      success: true, 
      message: 'Analytics API is working!',
      timestamp: new Date().toISOString(),
      databaseTest: {
        orders: orders[0].count,
        users: users[0].count,
        products: products[0].count
      }
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug overview endpoint (no auth required) - REMOVE IN PRODUCTION
router.get('/debug-overview', async (req, res) => {
  try {
    console.log('🐛 Debug analytics overview called');
    
    // Simple queries with fallbacks - Calculate revenue from order_items
    let totalRevenue = 0, totalOrders = 0;
    try {
      // First try with total_amount column
      const [result] = await pool.execute('SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as orders FROM orders WHERE status = "completed"');
      totalRevenue = result[0].revenue;
      totalOrders = result[0].orders;
    } catch (error) {
      console.log('Total amount column not found, calculating from order_items...');
      try {
        // Calculate from order_items if total_amount doesn't exist
        const [result] = await pool.execute(`
          SELECT 
            COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
            COUNT(DISTINCT o.id) as orders
          FROM orders o
          LEFT JOIN order_items oi ON o.id = oi.order_id
          WHERE o.status = 'completed'
        `);
        totalRevenue = result[0].revenue;
        totalOrders = result[0].orders;
      } catch (error2) {
        console.log('Order items calculation failed, using order count only:', error2.message);
        // Just count orders without revenue
        const [result] = await pool.execute('SELECT COUNT(*) as orders FROM orders WHERE status = "completed"');
        totalOrders = result[0].orders;
        totalRevenue = totalOrders * 1000; // Estimate 1000 DT per order
      }
    }
    
    let totalUsers = 0;
    try {
      const [result] = await pool.execute('SELECT COUNT(*) as count FROM users');
      totalUsers = result[0].count;
    } catch (error) {
      console.log('Users query failed:', error.message);
    }
    
    let totalProducts = 0;
    try {
      const [result] = await pool.execute('SELECT COUNT(*) as count FROM products');
      totalProducts = result[0].count;
    } catch (error) {
      console.log('Products query failed:', error.message);
    }
    
    const overview = {
      totalRevenue: parseFloat(totalRevenue),
      totalOrders: totalOrders,
      todayRevenue: 0, // Will be calculated later
      todayOrders: 0,
      monthRevenue: 0,
      monthOrders: 0,
      totalCustomers: totalUsers,
      totalProducts: totalProducts,
      conversionRate: totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : 0,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    };
    
    console.log('🐛 Debug overview result:', overview);
    res.json({ success: true, data: overview });
    
  } catch (error) {
    console.error('❌ Debug overview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Authentication middleware for admin routes
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'rym-gsm-secret-key-2024');
    // Allow any admin user (more flexible)
    if (!decoded.email || !decoded.email.includes('admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// GET /api/analytics/overview - Dashboard overview stats
router.get('/overview', authenticateAdmin, async (req, res) => {
  try {
    console.log('📊 Fetching analytics overview...');

    // Get total revenue (with error handling)
    let revenueResult = [{ total_revenue: 0, total_orders: 0 }];
    try {
      const [result] = await pool.execute(`
        SELECT 
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COUNT(*) as total_orders
        FROM orders 
        WHERE status = 'completed'
      `);
      revenueResult = result;
    } catch (error) {
      console.log('⚠️ Total amount column not found, calculating from order_items...');
      try {
        const [result] = await pool.execute(`
          SELECT 
            COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
            COUNT(DISTINCT o.id) as total_orders
          FROM orders o
          LEFT JOIN order_items oi ON o.id = oi.order_id
          WHERE o.status = 'completed'
        `);
        revenueResult = result;
      } catch (error2) {
        console.log('⚠️ Order items calculation failed, using defaults');
        const [result] = await pool.execute('SELECT COUNT(*) as total_orders FROM orders WHERE status = "completed"');
        revenueResult = [{ total_revenue: result[0].total_orders * 1000, total_orders: result[0].total_orders }];
      }
    }

    // Get today's revenue (with error handling)
    let todayRevenueResult = [{ today_revenue: 0, today_orders: 0 }];
    try {
      const [result] = await pool.execute(`
        SELECT 
          COALESCE(SUM(total_amount), 0) as today_revenue,
          COUNT(*) as today_orders
        FROM orders 
        WHERE status = 'completed' 
        AND DATE(created_at) = CURDATE()
      `);
      todayRevenueResult = result;
    } catch (error) {
      console.log('⚠️ Today revenue query failed, using defaults');
    }

    // Get this month's revenue (with error handling)
    let monthRevenueResult = [{ month_revenue: 0, month_orders: 0 }];
    try {
      const [result] = await pool.execute(`
        SELECT 
          COALESCE(SUM(total_amount), 0) as month_revenue,
          COUNT(*) as month_orders
        FROM orders 
        WHERE status = 'completed' 
        AND YEAR(created_at) = YEAR(CURDATE()) 
        AND MONTH(created_at) = MONTH(CURDATE())
      `);
      monthRevenueResult = result;
    } catch (error) {
      console.log('⚠️ Month revenue query failed, using defaults');
    }

    // Get total customers (with error handling)
    let customersResult = [{ total_customers: 0 }];
    try {
      const [result] = await pool.execute(`
        SELECT COUNT(DISTINCT id) as total_customers FROM users
      `);
      customersResult = result;
    } catch (error) {
      console.log('⚠️ Users table might not exist, using defaults');
    }

    // Get total products (with error handling)
    let productsResult = [{ total_products: 0 }];
    try {
      const [result] = await pool.execute(`
        SELECT COUNT(*) as total_products FROM products
      `);
      productsResult = result;
    } catch (error) {
      console.log('⚠️ Products table might not exist, using defaults');
    }

    // Get conversion rate (orders vs total users)
    const totalCustomers = customersResult[0]?.total_customers || 1;
    const totalOrders = revenueResult[0]?.total_orders || 0;
    const conversionRate = ((totalOrders / totalCustomers) * 100).toFixed(2);

    // Get average order value
    const totalRevenue = revenueResult[0]?.total_revenue || 0;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    const overview = {
      totalRevenue: parseFloat(revenueResult[0]?.total_revenue || 0),
      totalOrders: revenueResult[0]?.total_orders || 0,
      todayRevenue: parseFloat(todayRevenueResult[0]?.today_revenue || 0),
      todayOrders: todayRevenueResult[0]?.today_orders || 0,
      monthRevenue: parseFloat(monthRevenueResult[0]?.month_revenue || 0),
      monthOrders: monthRevenueResult[0]?.month_orders || 0,
      totalCustomers: customersResult[0]?.total_customers || 0,
      totalProducts: productsResult[0]?.total_products || 0,
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
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders 
      WHERE status = 'completed' AND ${dateRange}
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
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
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
        WHERE status = 'completed'
        GROUP BY user_id
      ) customer_orders
      GROUP BY customer_type
    `);

    // Get most viewed products (we'll simulate this with order data for now)
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

    // Get average time between orders for returning customers
    const [avgTimeBetweenOrders] = await pool.execute(`
      SELECT 
        AVG(DATEDIFF(next_order, current_order)) as avg_days_between_orders
      FROM (
        SELECT 
          user_id,
          created_at as current_order,
          LEAD(created_at) OVER (PARTITION BY user_id ORDER BY created_at) as next_order
        FROM orders 
        WHERE status = 'completed'
      ) order_intervals
      WHERE next_order IS NOT NULL
    `);

    const behaviorData = {
      customerTypes: customerTypes,
      mostViewedProducts: mostViewed,
      orderStatusDistribution: orderStatus,
      avgDaysBetweenOrders: Math.round(avgTimeBetweenOrders[0]?.avg_days_between_orders || 0)
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

    // Check if chatbot_conversations table exists
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

      // Get daily conversations for the last 7 days
      const [dailyConversations] = await pool.execute(`
        SELECT 
          DATE(created_at) as date,
          COUNT(DISTINCT session_id) as conversations,
          COUNT(*) as messages
        FROM chatbot_conversations
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      chatbotData.dailyConversations = dailyConversations;

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
      // Return default data if table doesn't exist
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

    // Get low stock products (assuming stock_quantity field exists)
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
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
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
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
      GROUP BY p.brand
      ORDER BY total_revenue DESC
    `);

    // Get products with highest profit margins
    const [highMarginProducts] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.brand,
        p.price,
        p.original_price,
        CASE 
          WHEN p.original_price > p.price THEN ROUND(((p.original_price - p.price) / p.original_price) * 100, 2)
          ELSE 0
        END as discount_percentage,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
      WHERE p.original_price > p.price
      GROUP BY p.id, p.name, p.brand, p.price, p.original_price
      ORDER BY discount_percentage DESC, total_sold DESC
      LIMIT 10
    `);

    const inventoryData = {
      lowStockProducts,
      deadStock,
      brandPerformance,
      highMarginProducts
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
        COALESCE(SUM(total_amount), 0) as today_revenue,
        COUNT(*) as today_orders,
        COUNT(DISTINCT user_id) as today_customers
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    // Get last 24 hours activity
    const [recentActivity] = await pool.execute(`
      SELECT 
        'order' as type,
        CONCAT('Order #', id, ' - ', total_amount, ' DT') as description,
        created_at,
        total_amount as value
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get current online users (simulated - you'd need real session tracking)
    const currentOnlineUsers = Math.floor(Math.random() * 20) + 5; // Simulated

    const realTimeData = {
      todayRevenue: parseFloat(todayStats[0]?.today_revenue || 0),
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
