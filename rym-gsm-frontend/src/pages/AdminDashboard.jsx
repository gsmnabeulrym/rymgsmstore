import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingCart, Banknote, TrendingUp, Eye, MessageSquare, Bell, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard/stats');
      return response.data.stats;
    },
    enabled: isAdmin
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Products',
      value: statsData?.totalProducts || 0,
      icon: <Package className="h-8 w-8 text-blue-600" />,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: statsData?.totalOrders || 0,
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Total Users',
      value: statsData?.totalUsers || 0,
      icon: <Users className="h-8 w-8 text-purple-600" />,
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Revenue',
      value: `${(statsData?.totalRevenue || 0).toLocaleString()} Dt`,
      icon: <Banknote className="h-8 w-8 text-yellow-600" />,
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {statsData?.recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {statsData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user_name} - {order.user_email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {parseFloat(order.total || 0).toFixed(2)} Dt
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/admin/products"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Products</p>
                    <p className="text-sm text-gray-500">Add, edit, or remove products</p>
                  </div>
                </Link>

                <Link
                  to="/admin/orders"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-500">Track and manage orders</p>
                  </div>
                </Link>

                <Link
                  to="/products"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">View Store</p>
                    <p className="text-sm text-gray-500">See how customers see your store</p>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-500">Add, edit, or remove users</p>
                  </div>
                </Link>

                <Link
                  to="/admin/reviews"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Reviews</p>
                    <p className="text-sm text-gray-500">Moderate customer reviews</p>
                  </div>
                </Link>

                <Link
                  to="/admin/notifications"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Bell className="h-8 w-8 text-pink-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications & Promotions</p>
                    <p className="text-sm text-gray-500">Create sales, promotions, and announcements</p>
                  </div>
                </Link>

                <Link
                  to="/admin/analytics"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors border-blue-200"
                >
                  <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">📊 Analytics Dashboard</p>
                    <p className="text-sm text-gray-500">Real-time insights & AI chatbot analytics</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    New order #1234 received from John Doe
                  </p>
                  <span className="text-xs text-gray-400">2 minutes ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Product "iPhone 15 Pro" stock updated
                  </p>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Order #1233 status changed to "Shipped"
                  </p>
                  <span className="text-xs text-gray-400">3 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    New user registered: jane@example.com
                  </p>
                  <span className="text-xs text-gray-400">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
