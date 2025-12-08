import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, X, Check, CheckCheck, Trash2, Settings, 
  Package, Tag, AlertCircle, Gift,
  Clock, Eye, RefreshCw, TrendingDown
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getNotificationsByType,
    fetchNotifications
  } = useNotifications();

  const { isAuthenticated } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'stock_alert':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'promotion':
        return <Gift className="w-4 h-4 text-purple-500" />;
      case 'new_product':
        return <Tag className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return '\u00c0 l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
    return notificationDate.toLocaleDateString();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'order_update' && notification.data?.orderId) {
      window.location.href = `/orders/${notification.data.orderId}`;
    } else if (notification.type === 'stock_alert' && notification.data?.productId) {
      window.location.href = `/products/${notification.data.productId}`;
    } else if (notification.type === 'price_drop' && notification.data?.productId) {
      window.location.href = `/products/${notification.data.productId}`;
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : getNotificationsByType(activeTab);

  const tabs = [
    { id: 'all', label: 'Tout', count: notifications.length },
    { id: 'order_update', label: 'Commandes', count: getNotificationsByType('order_update').length },
    { id: 'stock_alert', label: 'Stock', count: getNotificationsByType('stock_alert').length },
    { id: 'price_drop', label: 'Prix', count: getNotificationsByType('price_drop').length }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-700 hover:text-primary-600 p-3 rounded-xl transition-all duration-300 hover:bg-primary-50 group"
      >
        <Bell className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Pulse Animation for New Notifications */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchNotifications}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  title="Refresh notifications"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Actualiser
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                    title="Tout marquer comme lu"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Chargement des notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Aucune notification</p>
                <p className="text-gray-400 text-sm">Vous êtes à jour !</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-semibold ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.created_at)}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                title="Marquer comme lu"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Supprimer la notification"
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

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <Link
                  to="/notifications"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir toutes les notifications
                </Link>
                <Link
                  to="/profile#notifications"
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Paramètres
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
