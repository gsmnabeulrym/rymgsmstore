import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, Banknote, Package,
  Eye, MessageCircle, Brain, AlertTriangle, Star, RefreshCw, BarChart3,
  PieChart, Activity, Calendar, Clock
} from 'lucide-react';
import api from '../config/api';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerBehavior, setCustomerBehavior] = useState({});
  const [chatbotInsights, setChatbotInsights] = useState({});
  const [inventoryPerformance, setInventoryPerformance] = useState({});
  const [realTimeData, setRealTimeData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadRealTimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading analytics data...');

      // Test the API first
      try {
        const testRes = await api.get('/analytics/test');
        console.log('✅ Analytics API test:', testRes.data);
      } catch (testError) {
        console.error('❌ Analytics API test failed:', testError);
        alert('Analytics API is not responding. Please check the backend server.');
        return;
      }

      // Load all analytics data with individual error handling
      const results = await Promise.allSettled([
        api.get('/analytics/overview'),
        api.get(`/analytics/sales-chart?period=${selectedPeriod}`),
        api.get('/analytics/top-products'),
        api.get('/analytics/customer-behavior'),
        api.get('/analytics/chatbot-insights'),
        api.get('/analytics/inventory-performance'),
        api.get('/analytics/real-time')
      ]);

      // Handle each result individually
      const [
        overviewRes,
        salesChartRes,
        topProductsRes,
        customerBehaviorRes,
        chatbotInsightsRes,
        inventoryPerformanceRes,
        realTimeRes
      ] = results;

      // Set data with fallbacks
      setOverview(overviewRes.status === 'fulfilled' ? overviewRes.value.data.data : {});
      setSalesChart(salesChartRes.status === 'fulfilled' ? salesChartRes.value.data.data : []);
      setTopProducts(topProductsRes.status === 'fulfilled' ? topProductsRes.value.data.data : []);
      setCustomerBehavior(customerBehaviorRes.status === 'fulfilled' ? customerBehaviorRes.value.data.data : {});
      setChatbotInsights(chatbotInsightsRes.status === 'fulfilled' ? chatbotInsightsRes.value.data.data : {});
      setInventoryPerformance(inventoryPerformanceRes.status === 'fulfilled' ? inventoryPerformanceRes.value.data.data : {});
      setRealTimeData(realTimeRes.status === 'fulfilled' ? realTimeRes.value.data.data : {});
      
      setLastUpdated(new Date());

      // Log any failed requests
      results.forEach((result, index) => {
        const endpoints = ['overview', 'sales-chart', 'top-products', 'customer-behavior', 'chatbot-insights', 'inventory-performance', 'real-time'];
        if (result.status === 'rejected') {
          console.error(`❌ Failed to load ${endpoints[index]}:`, result.reason);
        }
      });

      console.log('✅ Analytics data loading completed');
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      alert(`Analytics loading failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const response = await api.get('/analytics/real-time');
      setRealTimeData(response.data.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('❌ Error loading real-time data:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="12months">Last 12 Months</option>
              </select>
              <button
                onClick={loadAnalyticsData}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview.totalRevenue || 0)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp size={16} className="inline mr-1" />
                  Today: {formatCurrency(overview.todayRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Banknote className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(overview.totalOrders || 0)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <ShoppingCart size={16} className="inline mr-1" />
                  Today: {overview.todayOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(overview.totalCustomers || 0)}</p>
                <p className="text-sm text-purple-600 mt-1">
                  <Users size={16} className="inline mr-1" />
                  Conversion: {overview.conversionRate || 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overview.avgOrderValue || 0)}</p>
                <p className="text-sm text-orange-600 mt-1">
                  <Package size={16} className="inline mr-1" />
                  Products: {overview.totalProducts || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Sales Performance</h2>
          <div className="space-y-4">
            {salesChart.slice(0, 7).map((data, index) => {
              const maxRevenue = Math.max(...salesChart.map(d => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-600">
                    {data.period}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${widthPercentage}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {formatCurrency(data.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600 w-16">
                        {data.orders} orders
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.brand} {product.name}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{product.total_sold} sold</p>
                    <p className="text-sm text-green-600">{formatCurrency(product.total_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Behavior */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">👥 Customer Behavior</h2>
            <div className="space-y-4">
              {(customerBehavior.customerTypes || []).map((type, index) => {
                const total = (customerBehavior.customerTypes || []).reduce((sum, t) => sum + t.count, 0);
                const percentage = total > 0 ? (type.count / total) * 100 : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{type.customer_type}</span>
                      <span className="text-sm font-bold text-gray-600">{type.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Average days between orders: <span className="font-bold">{customerBehavior.avgDaysBetweenOrders || 0}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🤖 AI Chatbot Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{chatbotInsights.totalConversations || 0}</p>
              <p className="text-sm text-gray-600">Total Conversations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Brain className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{chatbotInsights.totalMessages || 0}</p>
              <p className="text-sm text-gray-600">Total Messages</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{chatbotInsights.avgMessagesPerSession || 0}</p>
              <p className="text-sm text-gray-600">Avg Messages/Session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Questions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Asked Questions</h3>
              <div className="space-y-3">
                {(chatbotInsights.topQuestions || []).map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{question.question_category}</span>
                    <span className="text-sm font-bold text-blue-600">{question.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Sentiment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">😊 Positive</span>
                  <span className="text-sm font-bold text-green-600">{chatbotInsights.sentimentAnalysis?.positive || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">😐 Neutral</span>
                  <span className="text-sm font-bold text-gray-600">{chatbotInsights.sentimentAnalysis?.neutral || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">😞 Negative</span>
                  <span className="text-sm font-bold text-red-600">{chatbotInsights.sentimentAnalysis?.negative || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">⚠️ Low Stock Alert</h2>
            <div className="space-y-3">
              {(inventoryPerformance.lowStockProducts || []).slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.brand} {product.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{product.stock_quantity || 0} left</p>
                    <p className="text-sm text-gray-600">{product.total_sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Brand Performance</h2>
            <div className="space-y-4">
              {(inventoryPerformance.brandPerformance || []).map((brand, index) => {
                const maxRevenue = Math.max(...(inventoryPerformance.brandPerformance || []).map(b => b.total_revenue));
                const widthPercentage = maxRevenue > 0 ? (brand.total_revenue / maxRevenue) * 100 : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 capitalize">{brand.brand}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(brand.total_revenue)}</div>
                        <div className="text-xs text-gray-600">{brand.total_sold} sold</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                        style={{ width: `${widthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">⚡ Real-time Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Banknote className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{formatCurrency(realTimeData.todayRevenue || 0)}</p>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{realTimeData.todayOrders || 0}</p>
              <p className="text-sm text-gray-600">Today's Orders</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{realTimeData.currentOnlineUsers || 0}</p>
              <p className="text-sm text-gray-600">Online Users</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(realTimeData.recentActivity || []).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">{activity.description}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
