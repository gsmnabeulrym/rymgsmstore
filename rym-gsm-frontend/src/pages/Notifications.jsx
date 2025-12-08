import React, { useState } from 'react';
import { 
  Bell, Check, CheckCheck, Trash2, Settings, Filter,
  Package, TrendingDown, Tag, AlertCircle, Gift, Clock,
  Search, ArrowLeft, Eye, X
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    preferences,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    updatePreferences
  } = useNotifications();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Bell className="h-16 w-16 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-lg text-gray-600 mb-8">You need to be logged in to view your notifications</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'stock_alert':
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case 'price_drop':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-purple-500" />;
      case 'new_product':
        return <Tag className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'order_update' && notification.data?.orderId) {
      navigate(`/orders/${notification.data.orderId}`);
    } else if (notification.type === 'stock_alert' && notification.data?.productId) {
      navigate(`/products/${notification.data.productId}`);
    } else if (notification.type === 'price_drop' && notification.data?.productId) {
      navigate(`/products/${notification.data.productId}`);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || notification.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'order_update', label: 'Orders', count: getNotificationsByType('order_update').length },
    { id: 'stock_alert', label: 'Stock Alerts', count: getNotificationsByType('stock_alert').length },
    { id: 'price_drop', label: 'Price Drops', count: getNotificationsByType('price_drop').length },
    { id: 'promotion', label: 'Promotions', count: getNotificationsByType('promotion').length }
  ];

  const handlePreferencesUpdate = async (newPreferences) => {
    await updatePreferences(newPreferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>
          
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn-secondary text-sm flex items-center"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="btn-secondary text-sm flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) {
                      clearAllNotifications();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        {showPreferences && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
                { key: 'stockAlerts', label: 'Stock Alerts', description: 'Notify when wishlist items are back in stock' },
                { key: 'priceDrops', label: 'Price Drops', description: 'Alert when prices drop on wishlist items' },
                { key: 'newProducts', label: 'New Products', description: 'Notify about new product arrivals' },
                { key: 'promotions', label: 'Promotions', description: 'Get notified about sales and special offers' }
              ].map((pref) => (
                <label key={pref.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[pref.key]}
                    onChange={(e) => handlePreferencesUpdate({
                      ...preferences,
                      [pref.key]: e.target.checked
                    })}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{pref.label}</div>
                    <div className="text-sm text-gray-600">{pref.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No matching notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group ${
                    !notification.read ? 'bg-blue-50/30 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-lg font-semibold mb-2 ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {getTimeAgo(notification.created_at)}
                            </div>
                            {!notification.read && (
                              <span className="flex items-center text-blue-600 font-medium">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                Unread
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
