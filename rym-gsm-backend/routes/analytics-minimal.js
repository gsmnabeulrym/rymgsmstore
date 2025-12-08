const express = require('express');
const router = express.Router();

// Minimal authentication (allow all for testing)
const allowAll = (req, res, next) => {
  req.user = { email: 'admin@test.com', id: 1 };
  next();
};

// Test endpoint (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Analytics test endpoint called (minimal version)');
    
    res.json({ 
      success: true, 
      message: 'Analytics API is working!',
      timestamp: new Date().toISOString(),
      databaseTest: {
        orders: 5,
        users: 3,
        products: 5
      }
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/overview - Dashboard overview stats (with hardcoded data)
router.get('/overview', allowAll, async (req, res) => {
  try {
    console.log('📊 Fetching analytics overview (minimal version)...');

    // Return real-looking data for testing
    const overview = {
      totalRevenue: 398.00,
      totalOrders: 3,
      todayRevenue: 125.50,
      todayOrders: 1,
      monthRevenue: 398.00,
      monthOrders: 3,
      totalCustomers: 3,
      totalProducts: 5,
      conversionRate: 100.00,
      avgOrderValue: 132.67
    };

    console.log('✅ Analytics overview (minimal):', overview);
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
router.get('/sales-chart', allowAll, async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    console.log(`📈 Fetching sales chart data for period: ${period}`);

    // Sample sales data
    const salesData = [
      { period: '2024-09-26', orders: 1, revenue: 125.50 },
      { period: '2024-09-27', orders: 0, revenue: 0 },
      { period: '2024-09-28', orders: 1, revenue: 142.50 },
      { period: '2024-09-29', orders: 0, revenue: 0 },
      { period: '2024-09-30', orders: 1, revenue: 130.00 },
      { period: '2024-10-01', orders: 0, revenue: 0 },
      { period: '2024-10-02', orders: 0, revenue: 0 }
    ];

    console.log(`✅ Sales chart data: ${salesData.length} data points`);
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
router.get('/top-products', allowAll, async (req, res) => {
  try {
    console.log('🏆 Fetching top products...');

    const topProducts = [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        brand: 'Apple',
        price: 2800.00,
        original_price: 3000.00,
        total_sold: 2,
        total_revenue: 280.00,
        order_count: 2
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        price: 2400.00,
        original_price: 2600.00,
        total_sold: 1,
        total_revenue: 118.00,
        order_count: 1
      }
    ];

    console.log(`✅ Top products: ${topProducts.length} products`);
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
router.get('/customer-behavior', allowAll, async (req, res) => {
  try {
    console.log('👥 Fetching customer behavior analytics...');

    const behaviorData = {
      customerTypes: [
        { customer_type: 'New Customer', count: 2 },
        { customer_type: 'Returning Customer', count: 1 }
      ],
      mostViewedProducts: [
        { name: 'iPhone 15 Pro Max', brand: 'Apple', view_count: 15 },
        { name: 'Samsung Galaxy S24', brand: 'Samsung', view_count: 12 }
      ],
      orderStatusDistribution: [
        { status: 'delivered', count: 3, percentage: 60.00 },
        { status: 'shipped', count: 1, percentage: 20.00 },
        { status: 'pending', count: 1, percentage: 20.00 }
      ],
      avgDaysBetweenOrders: 15
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
router.get('/chatbot-insights', allowAll, async (req, res) => {
  try {
    console.log('🤖 Fetching chatbot insights...');

    const chatbotData = {
      totalConversations: 25,
      totalMessages: 78,
      avgMessagesPerSession: 3.12,
      topQuestions: [
        { question_category: 'Pricing Questions', count: 15 },
        { question_category: 'iPhone Questions', count: 12 },
        { question_category: 'Samsung Questions', count: 8 },
        { question_category: 'Shipping Questions', count: 6 }
      ],
      dailyConversations: [],
      sentimentAnalysis: {
        positive: 18,
        neutral: 5,
        negative: 2
      }
    };

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
router.get('/inventory-performance', allowAll, async (req, res) => {
  try {
    console.log('📦 Fetching inventory performance...');

    const inventoryData = {
      lowStockProducts: [
        {
          id: 3,
          name: 'iPhone 14',
          brand: 'Apple',
          price: 2200.00,
          stock_quantity: 2,
          total_sold: 8
        }
      ],
      deadStock: [
        {
          id: 5,
          name: 'Old Samsung Model',
          brand: 'Samsung',
          price: 800.00,
          days_in_inventory: 45
        }
      ],
      brandPerformance: [
        {
          brand: 'Apple',
          total_products: 3,
          total_sold: 12,
          total_revenue: 3360.00,
          avg_sold_per_product: 4.00
        },
        {
          brand: 'Samsung',
          total_products: 2,
          total_sold: 5,
          total_revenue: 1200.00,
          avg_sold_per_product: 2.50
        }
      ],
      highMarginProducts: []
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
router.get('/real-time', allowAll, async (req, res) => {
  try {
    console.log('⚡ Fetching real-time data...');

    const realTimeData = {
      todayRevenue: 125.50,
      todayOrders: 1,
      todayCustomers: 1,
      currentOnlineUsers: Math.floor(Math.random() * 15) + 3, // 3-17 random users
      recentActivity: [
        {
          type: 'order',
          description: 'Order #1001 - Status: delivered',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          value: 125.50
        },
        {
          type: 'order',
          description: 'Order #1002 - Status: shipped',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          value: 142.50
        }
      ],
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
